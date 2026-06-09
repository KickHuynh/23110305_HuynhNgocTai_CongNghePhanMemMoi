const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateAddToCart,
  validateUpdateCartItem,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Lấy giỏ hàng hiện tại của người dùng sau khi xác thực JWT.
router.get('/', protect, cartController.getMyCart);
// Thêm sản phẩm đã chọn size và màu vào giỏ hàng.
router.post('/items', protect, validateAddToCart, cartController.addToCart);
// Cập nhật số lượng của một dòng sản phẩm trong giỏ hàng.
router.put(
  '/items/:itemId',
  protect,
  validateUpdateCartItem,
  cartController.updateCartItem
);
// Xóa một sản phẩm khỏi giỏ hàng của người dùng.
router.delete('/items/:itemId', protect, cartController.removeCartItem);
// Xóa toàn bộ sản phẩm trong giỏ hàng hiện tại.
router.delete('/', protect, cartController.clearCart);

module.exports = router;
