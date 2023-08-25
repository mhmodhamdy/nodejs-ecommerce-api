const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');

exports.getProducts = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find({
    // price: req.query.price,
    // sold: req.query.sold,
  })
    .where('price')
    .equals(req.query.price)
    .where('sold')
    .equals(req.query.sold)
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name -_id' });
  res.json({ results: products.length, page, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: 'category',
    select: 'name -_id',
  });
  if (!product) {
    return next(new ApiError('No Product Found', 404));
  }
  res.json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.json({ stutes: 'succes', data: product });
  //.stutes(201)
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError('No Product Found', 404));
  }
  res.json({ stutes: 'succes', data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) {
    return next(new ApiError('No Product Found', 404));
  }
  res.json({
    stutes: 'succes',
    msg: 'Product Deleted',
  });
});
