const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');
const Review = require('../models/reviewModel');

// @desc    Get all Reviews
exports.getReviews = getAll(Review);
// @desc    Get a single Review by id
exports.getReview = getOne(Review);
// @desc    Create new Review
exports.createReview = createOne(Review);
// @desc    Update existing Review
exports.updateReview = updateOne(Review);
// @desc    Delete an existing Review
exports.deleteReview = deleteOne(Review);
