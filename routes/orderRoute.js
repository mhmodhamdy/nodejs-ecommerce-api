const express = require('express');
const {
  createCashOrder,
  getAllOders,
  getOrderById,
  filterOrderForLoggedUser,
  updatePaidStatusToTrue,
  updateDeliverdStatusToTrue,
} = require('../services/orderService');

const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();
router.use(authorization, allowedTo('user', 'admin'));

router.route('/:cartId').post(createCashOrder);
router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  getAllOders
);
router.get('/:id', getOrderById);
router.route('/:orderId/pay', updatePaidStatusToTrue);
router.put('/:orderId/delivered', updateDeliverdStatusToTrue);

module.exports = router;
