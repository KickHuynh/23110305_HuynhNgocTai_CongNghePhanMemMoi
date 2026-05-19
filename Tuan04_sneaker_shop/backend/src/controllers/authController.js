const authService = require('../services/authService');

const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
    error: error.message,
  });
};

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: 'Register successfully',
      ...result,
    });
  } catch (error) {
    return handleError(res, error, 'Register failed');
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      ...result,
    });
  } catch (error) {
    return handleError(res, error, 'Login failed');
  }
};

module.exports = {
  register,
  login,
};
