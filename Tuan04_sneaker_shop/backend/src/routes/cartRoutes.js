const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateAddToCart,
  validateUpdateCartItem,
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', protect, cartController.getMyCart);
router.post('/items', protect, validateAddToCart, cartController.addToCart);
router.put(
  '/items/:itemId',
  protect,
  validateUpdateCartItem,
  cartController.updateCartItem
);
router.delete('/items/:itemId', protect, cartController.removeCartItem);
router.delete('/', protect, cartController.clearCart);

module.exports = router;
