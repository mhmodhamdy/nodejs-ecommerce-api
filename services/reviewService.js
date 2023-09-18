const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');
const Review = require('../models/reviewModel');

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// Nested route
// GET /api/v1/products/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Get all Reviews
exports.getReviews = getAll(Review);
// @desc    Get a single Review by id
exports.getReview = getOne(Review);

// Set UserId from logged user
exports.setLoggedUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc    Create new Review
exports.createReview = createOne(Review);
// @desc    Update existing Review
exports.updateReview = updateOne(Review);
// @desc    Delete an existing Review
exports.deleteReview = deleteOne(Review);
