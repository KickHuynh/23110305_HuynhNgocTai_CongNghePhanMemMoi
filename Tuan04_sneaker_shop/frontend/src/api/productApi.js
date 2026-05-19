import axiosClient from './axiosClient';

const productApi = {
  getProducts(params) {
    return axiosClient.get('/products', { params });
  },

  getProductById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  getNewProducts() {
    return axiosClient.get('/products/new');
  },

  getBestSellerProducts() {
    return axiosClient.get('/products/best-seller');
  },

  getPromotionProducts() {
    return axiosClient.get('/products/promotions');
  },

  getRelatedProducts(id) {
    return axiosClient.get(`/products/${id}/related`);
  },

  getCategories() {
    return axiosClient.get('/products/categories');
  },

  getTopBestSellers(limit = 10) {
    return axiosClient.get('/products/top/best-sellers', { params: { limit } });
  },

  getTopMostViewed(limit = 10) {
    return axiosClient.get('/products/top/most-viewed', { params: { limit } });
  },
};

export default productApi;
