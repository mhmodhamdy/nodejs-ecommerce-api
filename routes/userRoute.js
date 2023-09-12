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
  reactiveLoggedUser,
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
const checkField = require('../utils/checkField');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();

// router.use(authorization);

router.get('/getme', authorization, getLoggedUserData, getUser);
router.put(
  '/changemypassword',
  checkField('password'),
  checkField('confirmPassword'),
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
  checkField('email'),
  checkField('password'),
  reactiveLoggedUser
);

// users routes
router
  .route('/')
  .get(allowedTo('maneger', 'admin'), authorization, getUsers)
  .post(
    uploadUserImage,
    resizeImage,
    authorization,
    createUserValidator,
    createUser
  );

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
  .get(allowedTo('maneger', 'admin'), authorization, getUserValidator, getUser)
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
