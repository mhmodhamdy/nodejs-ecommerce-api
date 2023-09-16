const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// Registering
exports.signUp = asyncHandler(async (req, res, next) => {
  // create User
  const user = await User.create(
    _.pick(req.body, ['name', 'email', 'password', 'role'])
  );

  //generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });

  next();
});
// Login
exports.login = asyncHandler(async (req, res, next) => {
  // Find the user by their email address and compare passwords
  const user = await User.findOne(_.pick(req.body, 'email'));
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('incorrect email or password', 401));
  }
  // Check if account active or not
  if (!user.active) {
    return next(new ApiError('Account not activated', 403));
  }
  // If they match return a JWT token for them to use in future requests
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
// Authentication
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
  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('No user found', 400));
  }
  // Check if user active or deactive
  if (!currentUser.active) {
    return next(new ApiError('This user is not active', 403));
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
        new ApiError(
          'Password has been changed recently, please login again....',
          403
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

// Authorization
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('you are not allowed to access this route', 403)
      );
    }
    next();
  });
// Forget my password and send reset code to my gmail
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // Check if email exist or not
  const user = await User.findOne(_.pick(req.body, 'email'));
  if (!user) {
    return next(new ApiError('incorrect email', 404));
  }
  // Generate 6 digits reset code and hashed it
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed reset code in db
  user.passwordResetCode = hashedResetCode;
  // Add exp time to password resset code
  user.passResetCodeExp = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  const message = `Hi ${user.name} \n
   according to your request to change your password, this is tour reset code ${resetCode} \n
   thanks for helping us keep your accunt secure \n
   The E-shop Team`;

  // Send the reset code to Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset code valied for 10 min',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passResetCodeExp = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'reset code sent to email',
  });
});
// Check if reset code correct or false
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // Hashing reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');
  // Useing hashed reset code to search about user
  const user = await User.findOne({ passwordResetCode: hashedResetCode });
  // If the user not found then send error message else continue with request
  if (!user) {
    return next(new ApiError('invalid reset Code'));
  }
  // If the reset code is expired then send error message else continue with request
  if (Date.now() > user.passResetCodeExp) {
    return next(new ApiError('expired Reset Code'));
  }
  // All is well, you can change your password now
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: 'Success',
  });
});
// Reset password if the reset code correct
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Find a user by their Email and update it's password field using req body data from frontend
  const user = await User.findOne(_.pick(req.body, 'email'));
  if (!user) {
    return next(new ApiError("User doesn't exist", 404));
  }
  // Check that this token matches what we have stored on record of our users database table
  if (!user.passwordResetVerified) {
    return next(
      new ApiError('Please verify your account first before changing Password'),
      400
    );
  }

  if (user.passwordResetVerified) {
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordResetCode = undefined;
    user.passResetCodeExp = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    const token = generateToken(user._id);
    res.status(200).json(token);
  }
});
