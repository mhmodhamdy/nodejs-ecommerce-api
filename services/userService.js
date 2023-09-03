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
const User = require('../models/userModel');

// upload single image
exports.uploadUserImage = uploadSingleImage('profileImage');

// image processing with sharp package
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(`uploads/users/${fileName}`);

    // Save images in database
    req.body.profileImage = fileName;
  }
  next();
});
// @desc    Get all Users
exports.getUsers = getAll(User);
// @desc    Get a single User by id
exports.getUser = getOne(User);
// @desc    Create new User
exports.createUser = createOne(User);
// @desc    Update existing User
exports.updateUser = updateOne(User);
// @desc    Delete an existing User
exports.deleteUser = deleteOne(User);
