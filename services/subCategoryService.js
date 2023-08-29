const SubCategory = require('../models/subCategoryModel');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// Nested route
// POST /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    Get all subcategories
exports.getSubCategories = getAll(SubCategory);
// @desc    Create a new subcategory
exports.getSubCategory = getOne(SubCategory);
// @desc    Update an existing subcategory by id
exports.createSubCategory = createOne(SubCategory);
// @desc    Delete an existing subcategory by id
exports.updateSubCategory = updateOne(SubCategory);
// @desc    Delete an existing subcategory by id
exports.deleteSubCategory = deleteOne(SubCategory);
