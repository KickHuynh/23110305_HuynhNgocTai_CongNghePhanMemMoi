const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Khai báo route tĩnh trước route động để tránh bắt nhầm tham số id.
router.get('/categories', productController.getCategories);
// Lấy danh sách top sản phẩm bán chạy cho trang chủ hoặc carousel.
router.get('/top/best-sellers', productController.getTopBestSellers);
// Lấy danh sách sản phẩm có lượt xem cao nhất.
router.get('/top/most-viewed', productController.getTopMostViewed);
// Lấy nhóm sản phẩm mới ra mắt.
router.get('/new', productController.getNewProducts);
// Lấy nhóm sản phẩm gắn cờ bán chạy.
router.get('/best-seller', productController.getBestSellerProducts);
// Lấy nhóm sản phẩm đang khuyến mãi.
router.get('/promotions', productController.getPromotionProducts);
// Lấy sản phẩm liên quan theo danh mục của sản phẩm đang xem.
router.get('/:id/related', productController.getRelatedProducts);
// Lấy chi tiết một sản phẩm và tăng lượt xem.
router.get('/:id', productController.getProductById);
// Lấy danh sách sản phẩm theo bộ lọc, sắp xếp và phân trang.
router.get('/', productController.getProducts);

module.exports = router;
