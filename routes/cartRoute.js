const express = require('express');

const { addProductToCart } = require('../services/cartService');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('admin', 'user'));

router.route('/').post(addProductToCart);
// router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
