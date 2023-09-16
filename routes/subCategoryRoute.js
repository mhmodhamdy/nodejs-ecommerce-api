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
const { authorization, allowedTo } = require('../services/authService');

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getSubCategories)
  .post(
    authorization,
    allowedTo('manager', 'admin'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authorization,
    allowedTo('manager', 'admin'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authorization,
    allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
