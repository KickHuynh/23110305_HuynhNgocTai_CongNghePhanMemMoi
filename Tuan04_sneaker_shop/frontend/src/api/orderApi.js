import axiosClient from './axiosClient';

const orderApi = {
  // Gửi thông tin giao hàng để tạo đơn COD từ giỏ hàng.
  checkout(data) {
    return axiosClient.post('/orders/checkout', data);
  },

  // Lấy lịch sử đơn hàng của người dùng hiện tại.
  getMyOrders() {
    return axiosClient.get('/orders/my-orders');
  },

  // Lấy chi tiết một đơn hàng theo id.
  getOrderById(orderId) {
    return axiosClient.get(`/orders/${orderId}`);
  },

  // Gửi yêu cầu hủy đơn hoặc lý do hủy đến backend.
  cancelOrder(orderId, data) {
    return axiosClient.put(`/orders/${orderId}/cancel`, data);
  },
};

export default orderApi;
