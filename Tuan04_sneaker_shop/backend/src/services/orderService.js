const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const { ORDER_STATUS } = require('../models/Order');

const CANCEL_WINDOW_MINUTES = 30;
const FREE_SHIPPING_THRESHOLD = 1000000;
const STANDARD_SHIPPING_FEE = 30000;

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;

  return error;
};

// Chọn giá thực tế của sản phẩm tại thời điểm tạo đơn.
const getEffectivePrice = (product) => {
  const price = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);

  return salePrice > 0 && salePrice < price ? salePrice : price;
};

const getPrimaryImage = (product) =>
  Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0]
    : '';

const normalizeText = (value) => String(value || '').trim();

const normalizeShippingAddress = (shippingAddress = {}) => ({
  fullName: normalizeText(shippingAddress.fullName),
  phone: normalizeText(shippingAddress.phone),
  addressLine: normalizeText(shippingAddress.addressLine),
  ward: normalizeText(shippingAddress.ward),
  district: normalizeText(shippingAddress.district),
  city: normalizeText(shippingAddress.city),
  note: normalizeText(shippingAddress.note),
});

const normalizeReason = (reason) => normalizeText(reason);

// Kiểm tra đơn hàng còn nằm trong khoảng 30 phút được phép hủy trực tiếp.
const isWithinCancellationWindow = (createdAt) => {
  const cancellationDeadline =
    new Date(createdAt).getTime() + CANCEL_WINDOW_MINUTES * 60 * 1000;

  return Date.now() <= cancellationDeadline;
};

// Lưu lại lịch sử chuyển trạng thái để theo dõi vòng đời đơn hàng.
const appendStatusHistory = (order, status, note, changedBy) => {
  order.statusHistory.push({
    status,
    note,
    changedAt: new Date(),
    changedBy,
  });
};

// Chặn các thao tác với id đơn hàng không hợp lệ.
const validateOrderId = (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId || '')) {
    throw createServiceError('Invalid order ID', 400);
  }
};

// Kiểm tra sản phẩm trong giỏ còn đủ điều kiện để chuyển thành đơn hàng.
const validateProductChoice = (product, item) => {
  if (!product) {
    throw createServiceError(
      `Product "${item.name || 'Unknown product'}" no longer exists`,
      400
    );
  }

  if (product.status !== 'active') {
    throw createServiceError(
      `Product "${product.name}" is no longer available`,
      400
    );
  }

  if (
    item.size &&
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.sizes.includes(item.size)
  ) {
    throw createServiceError(
      `Selected size for "${product.name}" is no longer available`,
      400
    );
  }

  if (
    item.color &&
    Array.isArray(product.colors) &&
    product.colors.length > 0 &&
    !product.colors.includes(item.color)
  ) {
    throw createServiceError(
      `Selected color for "${product.name}" is no longer available`,
      400
    );
  }
};

// Hoàn lại tồn kho đã giữ trước đó nếu checkout thất bại giữa chừng.
const rollbackReservedInventory = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: Number(item.quantity || 0),
          sold: -Number(item.quantity || 0),
        },
      })
    )
  );
};

// Trả lại tồn kho khi đơn hàng bị hủy sau khi đã tạo thành công.
const restoreInventoryForOrderItems = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: Number(item.quantity || 0),
          sold: -Number(item.quantity || 0),
        },
      })
    )
  );
};

// Xóa giỏ hàng sau khi checkout thành công để tránh đặt trùng lại.
const clearUserCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return;
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.subtotal = 0;
  await cart.save();
};

// Quy định các bước chuyển trạng thái hợp lệ của đơn hàng.
const getAllowedStatusTransitions = (currentStatus) => {
  return {
    [ORDER_STATUS.NEW]: [
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.CANCELLED,
    ],
    [ORDER_STATUS.CONFIRMED]: [
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.CANCELLED,
    ],
    [ORDER_STATUS.PREPARING]: [
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.CANCEL_REQUESTED,
      ORDER_STATUS.CANCELLED,
    ],
    [ORDER_STATUS.CANCEL_REQUESTED]: [
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.CANCELLED,
    ],
    [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  }[currentStatus] || [];
};

// Tạo đơn COD từ giỏ hàng hiện tại và giữ tồn kho tương ứng.
const createOrderFromCart = async (userId, payload = {}) => {
  if (!userId) {
    throw createServiceError('You must be logged in to checkout', 401);
  }

  const paymentMethod = normalizeText(payload.paymentMethod).toUpperCase();

  if (paymentMethod !== 'COD') {
    throw createServiceError('Only COD payment is supported right now', 400);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw createServiceError('Your cart is empty', 400);
  }

  const productIds = [
    ...new Set(cart.items.map((item) => String(item.product || ''))),
  ].filter((productId) => mongoose.Types.ObjectId.isValid(productId));

  const products = await Product.find({
    _id: { $in: productIds },
  });
  const productsById = new Map(
    products.map((product) => [String(product._id), product])
  );

  const orderItems = [];
  let subtotal = 0;

  // Chốt lại giá, biến thể và số lượng hiện có trước khi tạo đơn.
  cart.items.forEach((item) => {
    const product = productsById.get(String(item.product));

    validateProductChoice(product, item);

    if (Number(item.quantity || 0) > Number(product.stock || 0)) {
      throw createServiceError(
        `Not enough stock for "${product.name}". Available stock: ${product.stock || 0}`,
        400
      );
    }

    const price = getEffectivePrice(product);
    subtotal += price * Number(item.quantity || 0);

    orderItems.push({
      product: product._id,
      name: product.name,
      image: getPrimaryImage(product),
      price,
      size: normalizeText(item.size),
      color: normalizeText(item.color),
      quantity: Number(item.quantity || 0),
    });
  });

  const shippingFee =
    subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;
  const reservedItems = [];

  try {
    // Giữ tồn kho từng sản phẩm để tránh bán vượt số lượng còn lại.
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          status: 'active',
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        throw createServiceError(
          `Unable to reserve stock for "${item.name}". Please review your cart and try again.`,
          400
        );
      }

      reservedItems.push(item);
    }

    // Tạo bản ghi đơn hàng sau khi đã giữ được tồn kho cần thiết.
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: normalizeShippingAddress(payload.shippingAddress),
      payment: {
        method: 'COD',
        status: 'unpaid',
      },
      pricing: {
        subtotal,
        shippingFee,
        discount,
        total,
      },
      status: ORDER_STATUS.NEW,
      statusHistory: [
        {
          status: ORDER_STATUS.NEW,
          note: 'Order created successfully',
          changedAt: new Date(),
          changedBy: 'user',
        },
      ],
    });

    try {
      await clearUserCart(userId);
    } catch (clearCartError) {
      console.error(
        'Failed to clear cart after checkout:',
        clearCartError.message
      );
    }

    return {
      message: 'Checkout completed successfully',
      order,
    };
  } catch (error) {
    if (reservedItems.length > 0) {
      // Hoàn tồn kho nếu bất kỳ bước nào sau khi giữ hàng bị lỗi.
      await rollbackReservedInventory(reservedItems);
    }

    throw error.statusCode
      ? error
      : createServiceError('Checkout failed. Please try again.', 500);
  }
};

// Lấy toàn bộ đơn hàng của người dùng theo thứ tự mới nhất.
const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  return {
    message: 'Orders retrieved successfully',
    orders,
  };
};

// Lấy chi tiết một đơn hàng thuộc về người dùng hiện tại.
const getMyOrderById = async (userId, orderId) => {
  validateOrderId(orderId);

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw createServiceError('Order not found', 404);
  }

  return {
    message: 'Order retrieved successfully',
    order,
  };
};

// Hủy đơn trực tiếp hoặc gửi yêu cầu hủy dựa trên trạng thái xử lý hiện tại.
const cancelMyOrder = async (userId, orderId, reason) => {
  validateOrderId(orderId);

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw createServiceError('Order not found', 404);
  }

  const normalizedReason = normalizeReason(reason);

  if (order.status === ORDER_STATUS.CANCELLED) {
    return {
      message: 'This order is already cancelled',
      order,
    };
  }

  if (order.status === ORDER_STATUS.CANCEL_REQUESTED) {
    return {
      message: 'A cancellation request has already been sent to the shop',
      order,
    };
  }

  if (
    order.status === ORDER_STATUS.SHIPPING ||
    order.status === ORDER_STATUS.DELIVERED
  ) {
    throw createServiceError(
      'This order can no longer be cancelled at its current status',
      400
    );
  }

  if (order.status === ORDER_STATUS.PREPARING) {
    // Chuyển sang trạng thái yêu cầu hủy khi shop đã bắt đầu chuẩn bị hàng.
    order.status = ORDER_STATUS.CANCEL_REQUESTED;
    order.cancelInfo = {
      ...order.cancelInfo,
      reason: normalizedReason,
      requestedAt: new Date(),
      cancelledAt: order.cancelInfo?.cancelledAt,
    };
    appendStatusHistory(
      order,
      ORDER_STATUS.CANCEL_REQUESTED,
      'Cancellation request sent to shop',
      'user'
    );
    await order.save();

    return {
      message: 'Cancellation request sent to shop successfully',
      order,
    };
  }

  if (
    order.status !== ORDER_STATUS.NEW &&
    order.status !== ORDER_STATUS.CONFIRMED
  ) {
    throw createServiceError(
      'This order cannot be cancelled from its current status',
      400
    );
  }

  if (!isWithinCancellationWindow(order.createdAt)) {
    throw createServiceError(
      'Orders can only be cancelled within 30 minutes after placement',
      400
    );
  }

  // Trả lại tồn kho ngay khi người dùng hủy thành công trong thời gian cho phép.
  await restoreInventoryForOrderItems(order.items);

  order.status = ORDER_STATUS.CANCELLED;
  order.cancelInfo = {
    reason: normalizedReason,
    requestedAt: new Date(),
    cancelledAt: new Date(),
  };
  appendStatusHistory(
    order,
    ORDER_STATUS.CANCELLED,
    normalizedReason
      ? `Order cancelled by user. Reason: ${normalizedReason}`
      : 'Order cancelled by user',
    'user'
  );
  await order.save();

  return {
    message: 'Order cancelled successfully',
    order,
  };
};

// Tự động xác nhận các đơn mới khi đã hết thời gian hủy trực tiếp.
const autoConfirmEligibleOrders = async () => {
  const cutoffTime = new Date(
    Date.now() - CANCEL_WINDOW_MINUTES * 60 * 1000
  );
  const eligibleOrders = await Order.find({
    status: ORDER_STATUS.NEW,
    createdAt: { $lte: cutoffTime },
  });

  let updatedCount = 0;

  for (const order of eligibleOrders) {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        status: ORDER_STATUS.NEW,
      },
      {
        $set: {
          status: ORDER_STATUS.CONFIRMED,
        },
        $push: {
          statusHistory: {
            status: ORDER_STATUS.CONFIRMED,
            note: 'Order automatically confirmed after 30 minutes',
            changedAt: new Date(),
            changedBy: 'system',
          },
        },
      },
      {
        new: true,
      }
    );

    if (updatedOrder) {
      updatedCount += 1;
    }
  }

  return {
    checkedCount: eligibleOrders.length,
    updatedCount,
  };
};

// Cho phép admin cập nhật trạng thái theo đúng luồng xử lý đơn hàng.
const updateOrderStatus = async (
  orderId,
  status,
  note = '',
  changedBy = 'admin'
) => {
  validateOrderId(orderId);

  const targetStatus = normalizeText(status);
  const targetNote = normalizeText(note);
  const order = await Order.findById(orderId);

  if (!order) {
    throw createServiceError('Order not found', 404);
  }

  if (order.status === targetStatus) {
    return {
      message: `Order is already in status "${targetStatus}"`,
      order,
    };
  }

  const allowedTransitions = getAllowedStatusTransitions(order.status);

  if (!allowedTransitions.includes(targetStatus)) {
    throw createServiceError(
      `Cannot change order status from "${order.status}" to "${targetStatus}"`,
      400
    );
  }

  if (targetStatus === ORDER_STATUS.CANCELLED) {
    // Trả lại tồn kho khi admin chuyển đơn sang trạng thái hủy.
    await restoreInventoryForOrderItems(order.items);
    order.cancelInfo = {
      ...order.cancelInfo,
      cancelledAt: new Date(),
    };
  }

  if (targetStatus === ORDER_STATUS.CANCEL_REQUESTED) {
    order.cancelInfo = {
      ...order.cancelInfo,
      requestedAt: new Date(),
    };
  }

  order.status = targetStatus;
  appendStatusHistory(
    order,
    targetStatus,
    targetNote || `Order status updated to ${targetStatus}`,
    changedBy
  );
  await order.save();

  return {
    message: 'Order status updated successfully',
    order,
  };
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  autoConfirmEligibleOrders,
  updateOrderStatus,
};
