const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');

exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;
  const Brands = await Brand.find({}).skip(skip).limit(limit);
  res.json({ results: Brands.length, page, data: Brands });
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

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findOneAndDelete({ _id: id });
  if (!brand) {
    return next(new ApiError('No Brand Found', 404));
  }
  res.json({
    stutes: 'succes',
    msg: 'Brand Deleted',
  });
});
