const express = require('express');
const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require('../services/authService');
const {
  signUpValidator,
  loginValidator,
  resetPasswordValidator,
} = require('../utils/validators/authValidator');
const checkFieldValidator = require('../utils/validators/checkFieldValidator');

const router = express.Router();

router
  .post('/signup', signUpValidator, signUp)
  .post('/login', loginValidator, login)
  .post('/forgetpassword', checkFieldValidator('email'), forgetPassword)
  .post('/verifyresetcode', checkFieldValidator('resetCode'), verifyResetCode)
  .put(
    '/resetpassword',
    checkFieldValidator('email'),
    checkFieldValidator('newPassword'),
    checkFieldValidator('confirmPassword'),
    resetPasswordValidator,
    resetPassword
  );

module.exports = router;
