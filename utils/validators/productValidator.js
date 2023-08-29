const { check, body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const categoryModel = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('product title required')
    .isLength({ max: 128 })
    .withMessage('product title must be less than 1024 character')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID formate')
    //check if all my req subcategories ids in database or not
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    //combination all subcategories ids which belong to the category in the req in one array
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in in the created array include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
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
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('invalid product id format'),
  validatorMiddleware,
];
