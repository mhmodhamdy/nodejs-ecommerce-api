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
} = require('../services/userService');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
} = require('../utils/validators/userValidator');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(authorization, allowedTo('admin'), getUserValidator, getUser)
  .put(
    authorization,
    allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(authorization, allowedTo('admin'), deleteUserValidator, deleteUser);

router
  .route('/changepassword/:id')
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
