const express = require('express');
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
  setLoggedUserId,
} = require('../services/reviewService');
const {
  getReviewValidator,
  updateReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    authorization,
    allowedTo('user'),
    setProductIdAndUserIdToBody,
    setLoggedUserId,
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(authorization, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    authorization,
    allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
