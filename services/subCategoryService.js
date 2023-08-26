const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/subCategoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.getSubCategories = asyncHandler(async (req, res) => {
  const doucumentCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .filter()
    .limitFields()
    .paginate(doucumentCount)
    .search()
    .sort();

  //excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res.json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError('No subCategory Found', 404));
  }
  res.json({ data: subCategory });
});

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.json({ stutes: 'succes', data: subCategory });
  //.stutes(201)
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError('No subCategory Found', 404));
  }
  res.json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findOneAndDelete({ _id: id });
  if (!subCategory) {
    return next(new ApiError('No subCategory Found', 404));
  }
  res.json({
    stutes: 'Success',
    msg: 'SubCategory Deleted',
  });
});
