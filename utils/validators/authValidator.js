const { check } = require('express-validator');
const { default: slugify } = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userModel');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalied User ID Format'),
  validatorMiddleware,
];

exports.signUpValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid Email Address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exists'));
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Confirm password doesn't match password");
      }
      return true;
    }),
  check('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation required'),
  validatorMiddleware,
];
exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid Email Address'),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character'),
  validatorMiddleware,
];
exports.resetPasswordValidator = [
  check('email').isEmail().withMessage('Invalid Email Address'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character')
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.confirmPassword) {
        throw new Error(
          'New Password and Confirm New Password does not matched'
        );
      }
      return true;
    }),
  validatorMiddleware,
];
