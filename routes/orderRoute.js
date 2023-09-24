const express = require('express');
const { createCashOrder } = require('../services/orderService');

const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('user', 'admin'));

router.route('/:cartId').post(createCashOrder);

module.exports = router;
