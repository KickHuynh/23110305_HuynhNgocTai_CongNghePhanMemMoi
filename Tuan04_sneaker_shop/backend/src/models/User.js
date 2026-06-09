const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Lưu thông tin tài khoản và trạng thái xác thực email của người dùng.
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Lưu OTP kích hoạt email ở dạng đã băm để tránh lộ dữ liệu nhạy cảm.
    emailVerificationOtp: {
      type: String,
      select: false,
    },

    // Giới hạn thời gian hiệu lực của OTP xác thực email.
    emailVerificationOtpExpires: {
      type: Date,
      select: false,
    },

    // Lưu OTP đặt lại mật khẩu ở dạng đã băm.
    passwordResetOtp: {
      type: String,
      select: false,
    },

    // Giới hạn thời gian dùng OTP đặt lại mật khẩu.
    passwordResetOtpExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ băm lại mật khẩu khi người dùng vừa thay đổi trường password.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// So sánh mật khẩu đăng nhập với mật khẩu đã băm trong database.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
