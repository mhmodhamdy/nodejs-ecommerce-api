const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

exports.signUp = asyncHandler(async (req, res, next) => {
  // create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.statusCode(201).json({ data: user, token });

  next();
});
