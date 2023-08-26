const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getCategories = asyncHandler(async (req, res) => {
  const doucumentCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .filter()
    .limitFields()
    .paginate(doucumentCount)
    .search()
    .sort();

  //excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res.json({ results: categories.length, paginationResult, data: categories });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError('No Category Found', 404));
  }
  res.json({ data: category });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.json({ stutes: 'succes', data: category });
  //.stutes(201)
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError('No Category Found', 404));
  }
  res.json({ stutes: 'succes', data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOneAndDelete({ _id: id });
  if (!category) {
    return next(new ApiError('No Category Found', 404));
  }
  res.json({
    stutes: 'succes',
    msg: 'Category Deleted',
  });
});
