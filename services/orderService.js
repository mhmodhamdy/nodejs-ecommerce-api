const asyncHandler = require('express-async-handler');
// require('dotenv').config({ path: './.env' });
const Stripe = require('stripe');

const stripe = Stripe(
  'sk_test_51NuCSzIS5ZmmIC2atQAD4DKBQXRCfjPPLT4v2JzSBNiBvKRoovH4M7rLYBNEggTcxxhpnkMdU7ISgsOS1rXb5Ivu00SW9K7u0d'
);
// const stripe = require('stripe')(process.env.STRIPE_SECRET);

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { getAll, getOne } = require('./handlersFactory');
const ApiError = require('../utils/apiError');

// @desc    Create cash order for logged in user
// @route   POST /api/orders/:id
// @access  Private (user)
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

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get Orders
// @route   GET /api/orders/:userId?sort=createdAt&limit=5&page=1
// @access  Private User & Admin & Manager
exports.getAllOders = getAll(Order);

// @desc    Get order
// @route   GET /api/orders/:orderId
// @access  Private User & Admin & Manager
exports.getOrderById = getOne(Order);

// @desc    Update order paid status to true
// @route   PUT /api/orders/:orderId/pay
// @access  Private Admin & Manager
exports.updatePaidStatusToTrue = asyncHandler(async (req, res, next) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.params.orderId },
    { iaPaid: true, paidAt: Date.now() },
    { new: true }
  );
  if (!order) throw new ApiError('No order found with that id!', 404);
  res.status(200).json({ success: true, data: order });
});

//desc      Update order delivered status to true
//@route    PUT /api/orders/:orderId/delivered
//@access   Private Admin & Manager
exports.updateDeliverdStatusToTrue = asyncHandler(async (req, res, next) => {
  if (!req.params || !req.params.orderId) {
    return next(new ApiError('Please provide orderId', 400));
  }
  const order = await Order.findOneAndUpdate(
    { _id: req.params.orderId },
    { isDelivered: true, deliveredAt: Date.now() },
    { new: true }
  );
  if (!order) {
    throw new ApiError('No order Found With That Id!', 404);
  }
  res.status(200).json({ success: true, data: order });
});

//desc      Get checkout session from stripe and send it as a response
//@route    Get /api/orders/checkout-session/cartId
//@access   Private User & Admin
exports.checkoutSession = asyncHandler(async (req, res, next) => {
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
  // Create strip checkout session
  const session = await stripe.checkout.sessions.create({
    // paymentMethod: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  // Send session to response
  res.status(200).json({ status: 'Success', data: session });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log('Create order here.....!');
  }
});
