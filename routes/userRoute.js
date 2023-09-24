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
  updateLoggedUserData,
  deactiveLoggedUser,
  reactiveUser,
} = require('../services/userService');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');
const checkFieldValidator = require('../utils/validators/checkFieldValidator');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();

router.get('/getme', authorization, getLoggedUserData, getUser);
router.put(
  '/changemypassword',
  checkFieldValidator('password'),
  checkFieldValidator('confirmPassword'),
  authorization,
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  '/updateme',
  authorization,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete('/deactiveme', authorization, deactiveLoggedUser);
router.put(
  '/reactiveme',
  checkFieldValidator('email'),
  checkFieldValidator('password'),
  reactiveUser
);

// users routes
router
  .route('/')
  .get(allowedTo('maneger', 'admin'), authorization, getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

// router.use(allowedTo('admin'));
router
  .route('/changepassword/:id')
  .put(
    allowedTo('admin'),
    authorization,
    changeUserPasswordValidator,
    changeUserPassword
  );
router
  .route('/:id')
  .get(allowedTo('manager', 'admin'), authorization, getUserValidator, getUser)
  .put(
    allowedTo('admin'),
    authorization,
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(allowedTo('admin'), authorization, deleteUserValidator, deleteUser);

module.exports = router;
