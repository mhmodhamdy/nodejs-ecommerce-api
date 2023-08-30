const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const Category = require('../models/categoryModel');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories');
  },
  filename: function (req, file, cb) {
    const extName = file.mimetype.split('/')[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${extName}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: multerStorage });

exports.uploadCategoryImage = upload.single('image');

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
