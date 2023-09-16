const express = require('express');
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../services/reviewService');
const {
  updateReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(authorization, allowedTo('user'), createReviewValidator, createReview);

router
  .route('/:id')
  .get(getReview)
  .put(authorization, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    authorization,
    allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
