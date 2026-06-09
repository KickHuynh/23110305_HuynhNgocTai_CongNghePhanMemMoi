import axiosClient from './axiosClient';

const cartApi = {
  // Lấy giỏ hàng hiện tại của người dùng đăng nhập.
  getCart() {
    return axiosClient.get('/cart');
  },

  // Thêm một biến thể sản phẩm vào giỏ hàng.
  addToCart(data) {
    return axiosClient.post('/cart/items', data);
  },

  // Cập nhật số lượng của một dòng sản phẩm trong giỏ hàng.
  updateCartItem(itemId, data) {
    return axiosClient.put(`/cart/items/${itemId}`, data);
  },

  // Xóa một sản phẩm khỏi giỏ hàng hiện tại.
  removeCartItem(itemId) {
    return axiosClient.delete(`/cart/items/${itemId}`);
  },

  // Xóa toàn bộ sản phẩm trong giỏ hàng.
  clearCart() {
    return axiosClient.delete('/cart');
  },
};

export default cartApi;
