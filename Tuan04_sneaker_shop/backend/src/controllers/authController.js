const authService = require('../services/authService');

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
