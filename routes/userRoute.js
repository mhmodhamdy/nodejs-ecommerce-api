const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
} = require('../services/userService');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
} = require('../utils/validators/userValidator');
const { auth, allowedTo, checking } = require('../services/authService');

const router = express.Router();

router.get('/getme', auth, getLoggedUserData, getUser);
router.put(
  '/changemypassword',
  auth,
  checking('password'),
  checking('confirmPassword'),
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

router
  .route('/')
  .get(auth, allowedTo('maneger', 'admin'), getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(auth, allowedTo('admin'), getUserValidator, getUser)
  .put(
    auth,
    allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(auth, allowedTo('admin'), deleteUserValidator, deleteUser);

router
  .route('/changepassword/:id')
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
