const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validateCheckout,
  validateCancelOrder,
  validateUpdateOrderStatus,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Tạo đơn COD mới từ giỏ hàng hiện tại của người dùng.
router.post(
  '/checkout',
  protect,
  validateCheckout,
  orderController.createOrderFromCart
);
// Lấy lịch sử đơn hàng của chính người dùng đăng nhập.
router.get('/my-orders', protect, orderController.getMyOrders);
// Lấy chi tiết một đơn hàng thuộc về người dùng hiện tại.
router.get('/:orderId', protect, orderController.getMyOrderById);
// Cho phép người dùng hủy đơn hoặc gửi yêu cầu hủy theo trạng thái hiện tại.
router.put(
  '/:orderId/cancel',
  protect,
  validateCancelOrder,
  orderController.cancelMyOrder
);
// Cho phép admin cập nhật trạng thái xử lý của đơn hàng.
router.put(
  '/:orderId/status',
  protect,
  authorize('admin'),
  validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

module.exports = router;
