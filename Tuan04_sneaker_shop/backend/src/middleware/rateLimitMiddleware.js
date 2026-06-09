const rateLimit = require('express-rate-limit');

// Tạo rate limiter dùng chung cho các API nhạy cảm như login và OTP.
const buildRateLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    },
  });
};

// Giới hạn số lần gọi với từng nhóm API để giảm spam và brute force.
const registerLimiter = buildRateLimiter(15 * 60 * 1000, 5);
const loginLimiter = buildRateLimiter(15 * 60 * 1000, 5);
const otpLimiter = buildRateLimiter(10 * 60 * 1000, 5);
const resendOtpLimiter = buildRateLimiter(10 * 60 * 1000, 3);
const forgotPasswordLimiter = buildRateLimiter(15 * 60 * 1000, 3);
const resetPasswordLimiter = buildRateLimiter(15 * 60 * 1000, 5);

module.exports = {
  registerLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
};
