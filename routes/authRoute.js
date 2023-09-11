const express = require('express');
const {
  checking,
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

const router = express.Router();

router
  .post('/signup', signUpValidator, signUp)
  .post('/login', loginValidator, login)
  .post('/forgetpassword', checking('email'), forgetPassword)
  .post('/verifyresetcode', checking('resetCode'), verifyResetCode)
  .put(
    '/resetpassword',
    checking('email'),
    checking('newPassword'),
    checking('confirmPassword'),
    resetPasswordValidator,
    resetPassword
  );

module.exports = router;
