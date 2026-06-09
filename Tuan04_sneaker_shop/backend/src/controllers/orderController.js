const orderService = require('../services/orderService');

// Chuẩn hóa lỗi từ service đơn hàng trước khi trả về frontend.
const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
  });
};

// Tạo đơn hàng mới từ giỏ hàng hiện tại của người dùng.
const createOrderFromCart = async (req, res) => {
  try {
    const result = await orderService.createOrderFromCart(req.user._id, req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        order: result.order,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to create order');
  }
};

// Trả về toàn bộ lịch sử đơn hàng của người dùng hiện tại.
const getMyOrders = async (req, res) => {
  try {
    const result = await orderService.getMyOrders(req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        orders: result.orders,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve orders');
  }
};

// Lấy chi tiết một đơn hàng thuộc quyền sở hữu của người dùng.
const getMyOrderById = async (req, res) => {
  try {
    const result = await orderService.getMyOrderById(
      req.user._id,
      req.params.orderId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        order: result.order,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to retrieve order');
  }
};

// Xử lý hủy đơn trực tiếp hoặc gửi yêu cầu hủy đến shop.
const cancelMyOrder = async (req, res) => {
  try {
    const result = await orderService.cancelMyOrder(
      req.user._id,
      req.params.orderId,
      req.body?.reason
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        order: result.order,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to cancel order');
  }
};

// Cho phép admin đổi trạng thái xử lý của đơn hàng.
const updateOrderStatus = async (req, res) => {
  try {
    const result = await orderService.updateOrderStatus(
      req.params.orderId,
      req.body.status,
      req.body.note,
      'admin'
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        order: result.order,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update order status');
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  updateOrderStatus,
};
