const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;

  return error;
};

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
};

const buildAuthResponse = (user, token) => {
  return {
    token,
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
      },
    },
  };
};

const register = async ({ fullName, email, studentId, password }) => {
  if (!fullName || !email || !studentId || !password) {
    throw createServiceError(
      'Please provide fullName, email, studentId and password',
      400
    );
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { studentId }],
  });

  if (existingUser) {
    throw createServiceError('Email or student ID already exists', 409);
  }

  const user = await User.create({
    fullName,
    email,
    studentId,
    password,
  });

  const token = createToken(user._id);

  return buildAuthResponse(user, token);
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createServiceError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw createServiceError('Invalid email or password', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw createServiceError('Invalid email or password', 401);
  }

  const token = createToken(user._id);

  return buildAuthResponse(user, token);
};

module.exports = {
  register,
  login,
};
