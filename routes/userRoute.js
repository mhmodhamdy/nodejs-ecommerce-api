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

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route('/changepassword/:id')
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
