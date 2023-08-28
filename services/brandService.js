const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const { deleteOne } = require('./handlersFactory');

exports.getBrands = asyncHandler(async (req, res) => {
  const doucumentCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .filter()
    .limitFields()
    .paginate(doucumentCount)
    .search()
    .sort();

  //excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;
  res.json({ results: brands.length, paginationResult, data: brands });
});

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError('No Category Found', 404));
  }
  res.json({ data: brand });
});

exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.json({ stutes: 'succes', data: brand });
  //.stutes(201)
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError('No Brand Found', 404));
  }
  res.json({ stutes: 'succes', data: brand });
});

exports.deleteBrand = deleteOne(Brand);
