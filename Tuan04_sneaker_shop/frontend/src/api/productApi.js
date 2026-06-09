import axiosClient from './axiosClient';

const productApi = {
  // Lấy danh sách sản phẩm theo bộ lọc, sắp xếp và phân trang.
  getProducts(params) {
    return axiosClient.get('/products', { params });
  },

  // Lấy chi tiết một sản phẩm để hiển thị trang xem nhanh.
  getProductById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  // Lấy nhóm sản phẩm mới cho trang chủ.
  getNewProducts() {
    return axiosClient.get('/products/new');
  },

  // Lấy nhóm sản phẩm bán chạy đã gắn cờ.
  getBestSellerProducts() {
    return axiosClient.get('/products/best-seller');
  },

  // Lấy nhóm sản phẩm đang khuyến mãi.
  getPromotionProducts() {
    return axiosClient.get('/products/promotions');
  },

  // Lấy các sản phẩm liên quan theo sản phẩm đang xem.
  getRelatedProducts(id) {
    return axiosClient.get(`/products/${id}/related`);
  },

  // Lấy danh sách danh mục để dựng bộ lọc và trang category.
  getCategories() {
    return axiosClient.get('/products/categories');
  },

  // Lấy top sản phẩm bán chạy theo giới hạn mong muốn.
  getTopBestSellers(limit = 10) {
    return axiosClient.get('/products/top/best-sellers', { params: { limit } });
  },

  // Lấy top sản phẩm được xem nhiều nhất.
  getTopMostViewed(limit = 10) {
    return axiosClient.get('/products/top/most-viewed', { params: { limit } });
  },
};

export default productApi;
