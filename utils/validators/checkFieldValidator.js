const _ = require('lodash');
const asyncHandler = require('express-async-handler');
const ApiError = require('../apiError');

const checkFieldValidator = (arg) =>
  asyncHandler(async (req, res, next) => {
    if (!_.hasIn(req.body, arg)) {
      return next(new ApiError(`please enter your ${arg}`), 500);
    }
    next();
  });

module.exports = checkFieldValidator;
