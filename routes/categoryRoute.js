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

const { auth, allowedTo } = require('../services/authService');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoriesRoute);

router
  .route('/')
  .get(getCategories)
  .post(
    auth,
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
    auth,
    allowedTo('maneger', 'admin'),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    auth,
    allowedTo('maneger', 'admin'),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
