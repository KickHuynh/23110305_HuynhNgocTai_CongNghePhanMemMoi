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

router.post('/register', registerLimiter, validateRegister, register);
router.post(
  '/verify-register-otp',
  otpLimiter,
  validateVerifyOtp,
  verifyRegisterOtp
);
router.post(
  '/resend-register-otp',
  resendOtpLimiter,
  validateResendOtp,
  resendRegisterOtp
);
router.post('/login', loginLimiter, validateLogin, login);
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, validateUpdateProfile, updateCurrentUser);
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateForgotPassword,
  forgotPassword
);
router.post(
  '/reset-password',
  resetPasswordLimiter,
  validateResetPassword,
  resetPassword
);

module.exports = router;
