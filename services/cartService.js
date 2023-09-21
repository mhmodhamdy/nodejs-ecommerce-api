const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Coupon = require('../models/couponModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to cart
// @route   POST /api/v1/carts
// @access  Private (Admin, User)
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  calcTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: 'Success',
    message: 'Product added to your card successflly',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   POST /api/v1/carts
// @access  Private (Admin, User)
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  const cart = await Cart.findOne({ user: loggedInUserId }).populate(
    'cartItems.product',
    'user.name'
  );
  if (!cart) {
    return next(new ApiError(`No such a cart for this user`, 404));
  }
  res.status(200).json({
    status: 'Success',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/// @desc   Remove product from cart
// @route   Delete /api/v1/carts/:itemId
// @access  Private (Admin, User)
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError('no such item in the cart'));
  }

  if (!cart.cartItems.includes(req.params.itemId)) {
    return next(new ApiError('item not found'));
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: 'Success',
    message: 'Product removed successfully',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/// @desc   Update cartItem quantity
// @route   Put /api/v1/carts/:itemId
// @access  Private (Admin, User)
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity, color } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('No Such A Cart', 404));
  }

  if (req.user._id.toString() !== cart.user._id.toString()) {
    return next(new ApiError("You can't update other user's items", 403));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cartItem.color = color;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`Can not find the product with id ${req.params.itemId}`, 404)
    );
  }

  calcTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: 'Success',
    message: 'Quantity updated successfully',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/// @desc   Apply coupon to cart
// @route   Put /api/v1/cart/applycoupon
// @access  Private (Admin, User)
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ name: req.body.couponCode });
  if (!coupon) {
    return next(new ApiError(`${req.body.couponCode} is invalid`, 500));
  }
  if (coupon.expire < Date.now()) {
    return next(
      new ApiError(`${req.body.couponCode}'s expire date has been passed.`, 500)
    );
  }
  const cart = await Cart.findOne({ user: req.user._id });

  if (req.user._id.toString() !== cart.user._id.toString()) {
    return next(new ApiError("You can't apply coupon to other users", 401));
  }
  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    message: 'Successfully applied discount!',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
