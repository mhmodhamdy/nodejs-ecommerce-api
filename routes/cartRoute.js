const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeItemFromCart,
  updateCartItemQuantity,
  applyCoupon,
} = require('../services/cartService');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('admin', 'user'));

router.route('/').get(getLoggedUserCart).post(addProductToCart);
router.put('/applycoupon', applyCoupon);

router
  .route('/:itemId')
  // .get(getCoupon)
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
