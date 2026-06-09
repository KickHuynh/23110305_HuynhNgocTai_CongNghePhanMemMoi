const express = require('express');
const {
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/userController');
const {
  validateRegister,
  validateLogin,
  validateVerifyOtp,
  validateForgotPassword,
  validateResendOtp,
  validateResetPassword,
  validateUpdateProfile,
} = require('../middleware/validationMiddleware');
const {
  registerLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Đăng ký tài khoản mới và gửi OTP xác thực qua email.
router.post('/register', registerLimiter, validateRegister, register);
// Xác thực OTP để kích hoạt tài khoản và cấp JWT phiên đăng nhập.
router.post(
  '/verify-register-otp',
  otpLimiter,
  validateVerifyOtp,
  verifyRegisterOtp
);
// Gửi lại OTP xác thực cho tài khoản chưa kích hoạt.
router.post(
  '/resend-register-otp',
  resendOtpLimiter,
  validateResendOtp,
  resendRegisterOtp
);
// Đăng nhập bằng email và mật khẩu sau khi email đã được xác thực.
router.post('/login', loginLimiter, validateLogin, login);
// Lấy hồ sơ của người dùng đang đăng nhập từ JWT hiện tại.
router.get('/me', protect, getCurrentUser);
// Cập nhật các trường hồ sơ được phép của người dùng hiện tại.
router.put('/me', protect, validateUpdateProfile, updateCurrentUser);
// Gửi OTP đặt lại mật khẩu đến email đã đăng ký.
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateForgotPassword,
  forgotPassword
);
// Đặt lại mật khẩu bằng OTP còn hiệu lực.
router.post(
  '/reset-password',
  resetPasswordLimiter,
  validateResetPassword,
  resetPassword
);

module.exports = router;
