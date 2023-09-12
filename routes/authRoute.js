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
const checkField = require('../utils/checkField');

const router = express.Router();

router
  .post('/signup', signUpValidator, signUp)
  .post('/login', loginValidator, login)
  .post('/forgetpassword', checkField('email'), forgetPassword)
  .post('/verifyresetcode', checkField('resetCode'), verifyResetCode)
  .put(
    '/resetpassword',
    checkField('email'),
    checkField('newPassword'),
    checkField('confirmPassword'),
    resetPasswordValidator,
    resetPassword
  );

module.exports = router;
