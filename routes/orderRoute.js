const express = require('express');
const {
  createCashOrder,
  getAllOders,
  getOrderById,
  filterOrderForLoggedUser,
  updatePaidStatusToTrue,
  updateDeliverdStatusToTrue,
  checkoutSession,
} = require('../services/orderService');

const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization);

router.route('/:cartId').post(allowedTo('user'), createCashOrder);
router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  getAllOders
);
router.get('/:id', getOrderById);
router.put(
  '/:orderId/pay',
  allowedTo('manager', 'admin'),
  updatePaidStatusToTrue
);
router.put(
  '/:orderId/delivered',
  allowedTo('manager', 'admin'),
  updateDeliverdStatusToTrue
);
router.get('/checkout-session/:cartId', allowedTo('user'), checkoutSession);

module.exports = router;
