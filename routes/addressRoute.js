const express = require('express');
const {
  addAddress,
  removeAddress,
  getMyAddresses,
} = require('../services/addressService');

const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('user'));

router.route('/').get(getMyAddresses).post(addAddress);

router
  .route('/:addressId')
  // .get()
  // .put(authorization, allowedTo('manager', 'admin'))
  .delete(removeAddress);

module.exports = router;
