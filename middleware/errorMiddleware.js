const ApiError = require('../utils/apiError');

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvaliedSignature = (message) => new ApiError(message, 401);
const handleJwtExpired = (message) => new ApiError(message, 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    if (err.name === 'JsonWebTokenError')
      err = handleJwtInvaliedSignature('No user logged...!!!');
    sendErrorForDev(err, res);
  } else {
    if (err.name === 'JsonWebTokenError')
      err = handleJwtInvaliedSignature('Invalied token, login again please...');
    if (err.name === 'TokenExpiredError')
      err = handleJwtExpired('Expired token, please login again...');
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
