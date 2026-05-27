import axiosClient from './axiosClient';

const cartApi = {
  getCart() {
    return axiosClient.get('/cart');
  },

  addToCart(data) {
    return axiosClient.post('/cart/items', data);
  },

  updateCartItem(itemId, data) {
    return axiosClient.put(`/cart/items/${itemId}`, data);
  },

  removeCartItem(itemId) {
    return axiosClient.delete(`/cart/items/${itemId}`);
  },

  clearCart() {
    return axiosClient.delete('/cart');
  },
};

export default cartApi;
