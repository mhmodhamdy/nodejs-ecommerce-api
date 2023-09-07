const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { deleteOne, createOne, getOne, getAll } = require('./handlersFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

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
exports.updateUser = asyncHandler(async (req, res, next) => {
  const doucument = await User.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      'name',
      'slug',
      'email',
      'phone',
      'profileImage',
      'role',
    ]),

    {
      new: true,
    }
  );
  if (!doucument) {
    return next(new ApiError('No doucument Found', 404));
  }
  res.json({ stutes: 'succes', data: doucument });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const doucument = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!doucument) {
    return next(new ApiError('No doucument Found', 404));
  }
  res.status(201).json({ stutes: 'succes', data: doucument });
});
// @desc    Delete an existing User
exports.deleteUser = deleteOne(User);
