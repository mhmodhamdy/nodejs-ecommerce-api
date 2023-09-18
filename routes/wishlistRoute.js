const express = require('express');
const {
  addToWishlist,
  removeFromWishlist,
  getWishListItems,
} = require('../services/wishlistService');

const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('user'));

router.route('/').get(getWishListItems).post(addToWishlist);

router
  .route('/:productId')
  // .get()
  // .put(authorization, allowedTo('manager', 'admin'))
  .delete(removeFromWishlist);

module.exports = router;
