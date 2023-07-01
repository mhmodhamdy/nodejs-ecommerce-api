const express = require('express');
const {
  getSubCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObj,
  setCategoryIdToBody,
} = require('../services/subCategoryService');
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
