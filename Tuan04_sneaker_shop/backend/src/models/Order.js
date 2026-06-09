const mongoose = require('mongoose');

// Khai báo các trạng thái chính trong vòng đời xử lý đơn hàng.
const ORDER_STATUS = {
  NEW: 'new',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  CANCEL_REQUESTED: 'cancel_requested',
};

const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);
const PAYMENT_METHOD_VALUES = ['COD'];
const PAYMENT_STATUS_VALUES = ['unpaid', 'paid'];
const STATUS_CHANGED_BY_VALUES = ['system', 'user', 'admin'];

// Lưu snapshot sản phẩm tại thời điểm tạo đơn để tránh lệ thuộc dữ liệu hiện tại.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

// Lưu địa chỉ giao hàng được người dùng nhập khi checkout.
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      default: '',
      trim: true,
    },
    district: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// Lưu timeline thay đổi trạng thái để theo dõi và giải trình đơn hàng.
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: String,
      enum: STATUS_CHANGED_BY_VALUES,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// Lưu toàn bộ thông tin đơn hàng, thanh toán COD và lịch sử xử lý.
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    payment: {
      method: {
        type: String,
        enum: PAYMENT_METHOD_VALUES,
        default: 'COD',
      },
      status: {
        type: String,
        enum: PAYMENT_STATUS_VALUES,
        default: 'unpaid',
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        default: 0,
        min: 0,
      },
      shippingFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: ORDER_STATUS.NEW,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    // Ghi lại thông tin hủy đơn hoặc yêu cầu hủy của người dùng.
    cancelInfo: {
      reason: {
        type: String,
        default: '',
        trim: true,
      },
      requestedAt: {
        type: Date,
      },
      cancelledAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
module.exports.ORDER_STATUS = ORDER_STATUS;
module.exports.ORDER_STATUS_VALUES = ORDER_STATUS_VALUES;
module.exports.PAYMENT_METHOD_VALUES = PAYMENT_METHOD_VALUES;
module.exports.PAYMENT_STATUS_VALUES = PAYMENT_STATUS_VALUES;
module.exports.STATUS_CHANGED_BY_VALUES = STATUS_CHANGED_BY_VALUES;
