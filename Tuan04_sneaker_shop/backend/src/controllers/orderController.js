const orderService = require('../services/orderService');

const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
  });
};

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
