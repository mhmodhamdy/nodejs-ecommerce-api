const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');
const Coupon = require('../models/couponModel');

// @desc    Get all coupons
exports.getCoupons = getAll(Coupon);
// @desc    Get a single coupon by id
exports.getCoupon = getOne(Coupon);
// @desc    Create new coupon
exports.createCoupon = createOne(Coupon);
// @desc    Update existing coupon
exports.updateCoupon = updateOne(Coupon);
// @desc    Delete an existing coupon
exports.deleteCoupon = deleteOne(Coupon);
