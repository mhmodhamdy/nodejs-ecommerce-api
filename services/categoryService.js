const Category = require('../models/categoryModel');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// @desc    Get all categories
exports.getCategories = getAll(Category);
// @desc    Get one category by id
exports.getCategory = getOne(Category);
// @desc    Create new category
exports.createCategory = createOne(Category);
// @desc    Update a category with id
exports.updateCategory = updateOne(Category);
// @desc    Delete a category with id
exports.deleteCategory = deleteOne(Category);
