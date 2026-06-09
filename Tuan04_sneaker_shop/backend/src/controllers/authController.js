const authService = require('../services/authService');

// Chuẩn hóa phản hồi lỗi từ service trước khi trả về client.
const handleError = (res, error, fallbackMessage) => {
  const response = {
    success: false,
    message: error.publicMessage || fallbackMessage,
  };

  if (error.errorCode) {
    response.code = error.errorCode;
  }

  if (error.errorData !== undefined) {
    response.data = error.errorData;
  }

  return res.status(error.statusCode || 500).json(response);
};

// Nhận dữ liệu đăng ký và trả kết quả tạo tài khoản chờ xác thực email.
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: 'Register successfully. Please verify OTP sent to your email.',
      data: result,
    });
  } catch (error) {
    return handleError(res, error, 'Register failed');
  }
};

// Xử lý xác thực OTP đăng ký và trả JWT nếu hợp lệ.
const verifyRegisterOtp = async (req, res) => {
  try {
    const result = await authService.verifyRegisterOtp(req.body);

    return res.status(200).json({
      success: true,
      message: 'Verify register OTP successfully',
      token: result.token,
      redirectUrl: result.redirectUrl,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, 'Verify register OTP failed');
  }
};

// Gửi lại OTP xác thực cho tài khoản chưa kích hoạt.
const resendRegisterOtp = async (req, res) => {
  try {
    const result = await authService.resendRegisterOtp(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, 'Resend register OTP failed');
  }
};

// Xử lý đăng nhập và trả về phiên làm việc cho frontend.
const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      token: result.token,
      redirectUrl: result.redirectUrl,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, 'Login failed');
  }
};

// Tiếp nhận yêu cầu gửi OTP đặt lại mật khẩu qua email.
const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    return handleError(res, error, 'Forgot password failed');
  }
};

// Đặt lại mật khẩu khi email và OTP đều hợp lệ.
const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    return handleError(res, error, 'Reset password failed');
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
};
