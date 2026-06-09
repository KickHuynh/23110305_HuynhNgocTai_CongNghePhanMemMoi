const User = require('../models/User');
const {
  createServiceError,
  sanitizeUser,
  syncLegacyVerificationState,
} = require('./authService');

// Đồng bộ trạng thái cũ rồi trả hồ sơ an toàn cho frontend.
const getCurrentUser = async (user) => {
  const normalizedUser = await syncLegacyVerificationState(user);

  return sanitizeUser(normalizedUser);
};

// Cập nhật hồ sơ người dùng và kiểm tra trùng email hoặc mã sinh viên.
const updateCurrentUser = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createServiceError('User not found', 404);
  }

  const updates = {};

  if (typeof payload.fullName === 'string') {
    updates.fullName = payload.fullName.trim();
  }

  if (typeof payload.email === 'string') {
    updates.email = payload.email.trim().toLowerCase();
  }

  if (typeof payload.studentId === 'string') {
    updates.studentId = payload.studentId.trim();
  }

  if (updates.email && updates.email !== user.email) {
    const existingEmail = await User.findOne({
      email: updates.email,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      throw createServiceError('Email already exists', 409);
    }
  }

  if (updates.studentId && updates.studentId !== user.studentId) {
    const existingStudentId = await User.findOne({
      studentId: updates.studentId,
      _id: { $ne: userId },
    });

    if (existingStudentId) {
      throw createServiceError('Student ID already exists', 409);
    }
  }

  Object.assign(user, updates);
  await user.save();

  return sanitizeUser(user);
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
};
