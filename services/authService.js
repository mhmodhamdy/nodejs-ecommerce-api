const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signUp = asyncHandler(async (req, res, next) => {
  // create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });

  next();
});

exports.login = asyncHandler(async (req, res, next) => {
  //find the user by their email address and compare passwords
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('incorrect email or password', 401));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });

  //if they match return a JWT token for them to use in future requests
});

exports.authorization = asyncHandler(async (req, res, next) => {
  //Get token if it exist
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
  //verify token if changed or expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
});
