const { check } = require('express-validator');
const { default: slugify } = require('slugify');
const bcrypt = require('bcryptjs');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userModel');
const ApiError = require('../apiError');

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

// exports.updateUserValidator = [
//   check('id').isMongoId().withMessage('Invalied User ID Format'),
//   body('name')
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   check('email')
//     .notEmpty()
//     .withMessage('Email required')
//     .isEmail()
//     .withMessage('Invalid Email Address')
//     .custom((val) =>
//       User.findOne({ email: val }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error('E-mail already exists'));
//         }
//       })
//     ),
//   check('phone')
//     .optional()
//     .isMobilePhone(['ar-EG', 'ar-SA', 'ar-AE', 'ar-BH', 'ar-IQ'])
//     .withMessage('Invalied phone number'),
//   check('profileImage').optional(),
//   check('role').optional(),
//   validatorMiddleware,
// ];

// exports.deleteUserValidator = [
//   check('id').isMongoId().withMessage('Invalied User ID Format'),
//   validatorMiddleware,
// ];

// exports.changeUserPasswordValidator = [
//   check('id').isMongoId().withMessage('Invalied User ID Format'),
//   check('currentPassword')
//     .notEmpty()
//     .withMessage('enter your current password'),
//   check('password')
//     .notEmpty()
//     .withMessage('please enter the new password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 character')
//     .custom(async (val, { req }) => {
//       const user = await User.findOne({ _id: req.params.id });
//       if (!user) {
//         throw new ApiError('Invalid id', 400);
//       }
//       const incorrectPassword = await bcrypt.compare(
//         req.body.currentPassword,
//         user.password
//       );
//       if (!incorrectPassword) {
//         throw new ApiError("Current Password doesn't match your password", 422);
//       }
//     }),
//   check('confirmPassword')
//     .notEmpty()
//     .withMessage('please enter the confirm password')
//     .custom((confirmPassword, { req }) => {
//       if (confirmPassword !== req.body.password) {
//         throw new ApiError("Confirm password doesn't match new password", 422);
//       }
//       return true;
//     }),
//   validatorMiddleware,
// ];
