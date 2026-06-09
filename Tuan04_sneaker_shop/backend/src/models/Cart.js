const mongoose = require('mongoose');

// Lưu snapshot sản phẩm đã chọn để giữ thông tin giỏ hàng ổn định.
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      default: '',
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
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // Ghi nhớ tồn kho tại lần đồng bộ gần nhất để cảnh báo khi checkout.
    stockSnapshot: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

// Mỗi người dùng chỉ có một giỏ hàng chứa các dòng sản phẩm đã chọn.
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
