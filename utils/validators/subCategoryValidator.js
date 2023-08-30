const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalied subCategory ID Format'),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory name required')
    .isLength({ min: 1 })
    .withMessage('Too short subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isMongoId()
    .withMessage('Invalied Category ID Format'),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalied subCategory ID Format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalied subCategory ID Format'),
  validatorMiddleware,
];
