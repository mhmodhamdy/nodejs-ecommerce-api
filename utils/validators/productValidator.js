const { check } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const categoryModel = require('../../models/categoryModel');
const subCategoryModel = require('../../models/subCategoryModel');

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('product title required')
    .isLength({ max: 128 })
    .withMessage('product title must be less than 1024 character'),
  check('description')
    .notEmpty()
    .withMessage('product description  required')
    .isLength({ max: 1024 })
    .withMessage('product description must be less than 1024 character'),
  check('quantity')
    .notEmpty()
    .withMessage('product quantity required')
    .isNumeric()
    .withMessage('product quantity must be number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('product quantit must be number'),
  check('price')
    .notEmpty()
    .withMessage('product price required')
    .isNumeric()
    .withMessage('product price mustbe number')
    .isLength({ max: 16 })
    .withMessage('invalied price, it so much big number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('product price mustbe number')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('price after discount must be lower than price');
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray()
    .withMessage('product colors must be array of strings'),
  check('imageCover').notEmpty().withMessage('product imageCover required'),
  check('category')
    .notEmpty()
    .withMessage('product mustbe belong to category')
    .isMongoId()
    .withMessage('invalid id format')
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new Error('No category for this id'));
        }
      })
    ),
  check('subCategories')
    .optional()
    .isMongoId()
    .withMessage('invalid id format')
    .custom((subCategoriesIds) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: subCategoriesIds } })
        .then((result) => {
          if (result.length < 1 || result.length !== subCategoriesIds) {
            return Promise.reject(new Error('Invalid sub categories ids'));
          }
        })
    ),
  check('brand').optional().isMongoId().withMessage('invalid id format'),
  check('ratingAvarege')
    .optional()
    .isNumeric()
    .withMessage('rating avarege must be number')
    .isLength({ min: 1, max: 5 })
    .withMessage(
      'Rating must be more than or equal 1',
      'Rating must be less than or equal 5'
    ),
  check('ratingQuantity')
    .optional()
    .isNumeric()
    .withMessage('rating quantity must be number'),
  validatorMiddleware,
];

exports.getProductValidator = [
  check('id').isMongoId().withMessage('invalid product id format'),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check('id').isMongoId().withMessage('invalid product id format'),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('invalid product id format'),
  validatorMiddleware,
];
