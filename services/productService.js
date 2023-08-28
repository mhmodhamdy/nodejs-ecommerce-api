const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

const { deleteOne } = require('./handlersFactory');

exports.getProducts = asyncHandler(async (req, res, next) => {
  const doucumentCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .limitFields()
    .paginate(doucumentCount)
    .search('Products')
    .sort();

  //excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;
  res.json({ results: products.length, paginationResult, data: products });
});

// let mongooseQuery = Product.find(JSON.parse(queryStr)).populate({
//   path: 'category',
//   select: 'name -_id',
// });

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

exports.deleteProduct = deleteOne(Product);
