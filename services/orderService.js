const asyncHandler = require('express-async-handler');

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// @desc    Create cash order for logged in user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // create order in database and send it back to client side
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // Get cart depends on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    res.status(401).json({ message: 'Cart not found' });
  }
  // Get order price depends on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // Create Order with cash paymentMethod
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // Update product quantity and sold number after creating order
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // Clear my cart after creating order
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    status: 'Success',
    message: 'Your order has been placed successfully.',
    data: order,
  });
});
