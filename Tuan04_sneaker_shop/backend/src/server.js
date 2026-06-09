require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const {
  startOrderAutoConfirmJob,
} = require('./services/orderAutoConfirmService');

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trả về trạng thái hoạt động cơ bản của server khi truy cập root.
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Sneaker Shop API is running',
  });
});

// Cung cấp endpoint health check để kiểm tra nhanh backend còn sống.
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Sneaker Shop API is running',
  });
});

// Gắn các nhóm API xác thực, sản phẩm, giỏ hàng và đơn hàng vào ứng dụng.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Khởi động tác vụ tự động xác nhận đơn quá thời gian chờ hủy.
startOrderAutoConfirmJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
