const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Get current user successfully',
    data: {
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        studentId: req.user.studentId,
        role: req.user.role,
      },
    },
  });
};

module.exports = {
  getCurrentUser,
};