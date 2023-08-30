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
const Category = require('../models/categoryModel');

// upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// image processing with sharp package
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`uploads/categories/${fileName}`);

  // Save images in database
  req.body.image = fileName;
  next();
});

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
