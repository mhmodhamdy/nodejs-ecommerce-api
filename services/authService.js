const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signUp = asyncHandler(async (req, res, next) => {
  // create User
  const user = await User.create(
    _.pick(req.body, ['name', 'email', 'password'])
  );

  //generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });

  next();
});

exports.login = asyncHandler(async (req, res, next) => {
  // Find the user by their email address and compare passwords
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('incorrect email or password', 401));
  }

  // If they match return a JWT token for them to use in future requests
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.authorization = asyncHandler(async (req, res, next) => {
  // Get token if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ApiError('Unauthorized, frist login and come back', 401));
  }
  // Verify token if changed or expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('No user found', 400));
  }
  // Check if user cheanged his password after generating token
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token generated (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError('Password has been changed, login again please', 403)
      );
    }
  }
  req.user = currentUser;
  next();
});
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      return next(
        new ApiError('you are not allowed to access this route', 403)
      );
    }
    next();
  });
