const express = require('express');
const { signUp } = require('../services/authService');
const { signUpValidator } = require('../utils/validators/authValidator');

const router = express.Router();

router.route('/').post(signUpValidator, signUp);

// router
//   .route('/:id')
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
