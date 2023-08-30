const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require('../services/categoryService');
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require('../utils/validators/categoryValidator');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoriesRoute);

router
  .route('/')
  .get(getCategories)
  .post(uploadCategoryImage, createCategoryValidator, createCategory);

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
