const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
};

const register = async (req, res) => {
  try {
    const { fullName, email, studentId, password } = req.body;

    if (!fullName || !email || !studentId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, studentId and password',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or student ID already exists',
      });
    }

    const user = await User.create({
      fullName,
      email,
      studentId,
      password,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Register successfully',
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Register failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};