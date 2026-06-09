const mongoose = require('mongoose');

// Kết nối MongoDB khi server khởi động và dừng tiến trình nếu thất bại.
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
