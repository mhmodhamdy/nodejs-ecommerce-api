const Brand = require('../models/brandModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// @desc    Get all brands
exports.getBrands = getAll(Brand);
// @desc    Get a single brand by id
exports.getBrand = getOne(Brand);
// @desc    Create new brand
exports.createBrand = createOne(Brand);
// @desc    Update existing brand
exports.updateBrand = updateOne(Brand);
// @desc    Delete an existing brand
exports.deleteBrand = deleteOne(Brand);
