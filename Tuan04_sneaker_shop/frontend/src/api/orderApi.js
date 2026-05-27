import axiosClient from './axiosClient';

const orderApi = {
  checkout(data) {
    return axiosClient.post('/orders/checkout', data);
  },

  getMyOrders() {
    return axiosClient.get('/orders/my-orders');
  },

  getOrderById(orderId) {
    return axiosClient.get(`/orders/${orderId}`);
  },

  cancelOrder(orderId, data) {
    return axiosClient.put(`/orders/${orderId}/cancel`, data);
  },
};

export default orderApi;
