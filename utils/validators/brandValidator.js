const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalied Brand ID Format'),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name required')
    .isLength({ min: 3 })
    .withMessage('Too short Brand name')
    .isLength({ max: 32 })
    .withMessage('Too long Brand name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalied Brand ID Format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalied Brand ID Format'),
  validatorMiddleware,
];
