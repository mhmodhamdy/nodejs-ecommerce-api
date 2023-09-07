const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require('../services/categoryService');
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require('../utils/validators/categoryValidator');

const { authorization, allowedTo } = require('../services/authService');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoriesRoute);

router
  .route('/')
  .get(getCategories)
  .post(
    authorization,
    allowedTo('maneger', 'admin'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    authorization,
    allowedTo('maneger', 'admin'),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authorization,
    allowedTo('maneger', 'admin'),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
