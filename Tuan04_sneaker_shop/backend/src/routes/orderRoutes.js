const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validateCheckout,
  validateCancelOrder,
  validateUpdateOrderStatus,
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/checkout',
  protect,
  validateCheckout,
  orderController.createOrderFromCart
);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:orderId', protect, orderController.getMyOrderById);
router.put(
  '/:orderId/cancel',
  protect,
  validateCancelOrder,
  orderController.cancelMyOrder
);
router.put(
  '/:orderId/status',
  protect,
  authorize('admin'),
  validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

module.exports = router;
