const userService = require('../services/userService');

// Chuẩn hóa phản hồi lỗi cho các API hồ sơ người dùng.
const handleError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage || fallbackMessage,
  });
};

// Lấy hồ sơ của người dùng đã được xác thực bằng JWT.
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user);

    return res.status(200).json({
      success: true,
      message: 'Get current user successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Get current user failed');
  }
};

// Cập nhật các trường hồ sơ được phép của người dùng hiện tại.
const updateCurrentUser = async (req, res) => {
  try {
    const user = await userService.updateCurrentUser(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Update profile successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    return handleError(res, error, 'Update profile failed');
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
};
