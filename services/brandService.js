const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const Brand = require('../models/brandModel');

// upload single image
exports.uploadBrandImage = uploadSingleImage('image');

// image processing with sharp package
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(`uploads/brands/${fileName}`);

    // Save images in database
    req.body.image = fileName;
  }

  next();
});
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
