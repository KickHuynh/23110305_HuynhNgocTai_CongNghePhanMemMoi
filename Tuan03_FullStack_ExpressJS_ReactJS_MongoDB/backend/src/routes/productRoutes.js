const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define routes - specific routes must come before parameterized routes
router.get('/new', productController.getNewProducts);
router.get('/best-seller', productController.getBestSellerProducts);
router.get('/promotions', productController.getPromotionProducts);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts);

module.exports = router;
