const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { deleteOne, createOne, getOne, getAll } = require('./handlersFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
// const { generateToken } = require('../utils/generateToken');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

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
// @desc    Delete an existing User
exports.deleteUser = deleteOne(User);
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
// @desc    Change user password
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
// @desc    Get logged user data
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc    Update logged user password
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});
// @desc    Update logged in user data (name, email, phone)
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    _.pick(req.body, ['name', 'slug', 'email', 'phone']),
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

// @desc    Deactive logged in user account and log out all sessions/cookies associated with it
exports.deactiveLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({ status: 'Success', message: 'Account Deactiveted' });
});
exports.reactiveLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(_.pick(req.body, 'email'));
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('incorrect email or password', 401));
  }
  if (!user.active) {
    user.active = true;
  } else {
    res.status(203).json({ message: 'account already activated' });
  }

  user.save();
  res.status(200).json({ status: 'Success', message: 'Account activeted' });
});
