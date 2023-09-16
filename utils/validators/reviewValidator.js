const { check } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');
const Product = require('../../models/productModel');
const ApiError = require('../apiError');

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalied Review ID Format'),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check('title').optional(),
  check('rating')
    .notEmpty()
    .withMessage('Rating Required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating value shoud be between 1 to 5'),
  check('user')
    .isMongoId()
    .withMessage('Invalied Review ID Format')
    .custom(async (id) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
    }),
  check('product')
    .isMongoId()
    .withMessage('Invalied Review ID Format')
    .custom(async (id, { req }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new ApiError('Product Not Found');
      }
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new ApiError('You have already reviewed this Product');
      }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalied Review ID Format')
    .custom(async (id, { req }) => {
      const review = await Review.findById(id);
      if (!review) {
        return Promise.reject(new Error('Incorrect Review Id'));
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error('You are not allowed to perform this review')
        );
      }
    }),
  check('title').optional(),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalied Review ID Format')
    .custom(async (id, { req }) => {
      const review = await Review.findById(id);
      if (!review) {
        throw new ApiError('Incorrect Review Id');
      }
      if (req.user.role === 'user') {
        if (review.user.toString() !== req.user._id.toString()) {
          throw new ApiError('You are not allowed to delete this review');
        }
      }
    }),
  validatorMiddleware,
];
