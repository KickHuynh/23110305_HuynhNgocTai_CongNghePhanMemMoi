const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');
const { hashOtp, compareOtp } = require('../utils/hashOtp');
const {
  sendVerificationOtpEmail,
  sendPasswordResetOtpEmail,
} = require('./emailService');

const OTP_EXPIRES_IN_MINUTES =
  Number.parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10;

const createServiceError = (message, statusCode = 500, options = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = message;
  error.errorCode = options.code || null;
  error.errorData = options.data;

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

const getRedirectUrlByRole = (role) => {
  return role === 'admin' ? '/admin/profile' : '/user/profile';
};

const sanitizeUser = (user) => {
  const source = user.toObject ? user.toObject() : user;

  return {
    id: source._id ? source._id.toString() : source.id,
    fullName: source.fullName,
    email: source.email,
    studentId: source.studentId,
    role: source.role,
    isEmailVerified: Boolean(source.isEmailVerified),
  };
};

const buildAuthResponse = (user, token) => {
  return {
    token,
    redirectUrl: getRedirectUrlByRole(user.role),
    user: sanitizeUser(user),
  };
};

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const getOtpExpiryDate = () => {
  return new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);
};

const syncLegacyVerificationState = async (user) => {
  if (!user || typeof user.isEmailVerified === 'boolean') {
    return user;
  }

  const hasPendingVerificationOtp = Boolean(
    user.emailVerificationOtp || user.emailVerificationOtpExpires
  );

  user.isEmailVerified = !hasPendingVerificationOtp;

  if (!hasPendingVerificationOtp) {
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpires = undefined;
  }

  await user.save();

  return user;
};

const createEmailVerificationRequiredError = (email) => {
  return createServiceError('Please verify your email before login', 403, {
    code: 'EMAIL_NOT_VERIFIED',
    data: {
      email,
      requiresEmailVerification: true,
    },
  });
};

const register = async ({ fullName, email, studentId, password }) => {
  if (!fullName || !email || !studentId || !password) {
    throw createServiceError(
      'Please provide fullName, email, studentId and password',
      400
    );
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedStudentId = studentId.trim();

  const [existingEmail, existingStudentId] = await Promise.all([
    User.findOne({ email: normalizedEmail }),
    User.findOne({ studentId: normalizedStudentId }),
  ]);

  if (existingEmail) {
    throw createServiceError('Email already exists', 409);
  }

  if (existingStudentId) {
    throw createServiceError('Student ID already exists', 409);
  }

  const otp = generateOtp();
  const user = new User({
    fullName: fullName.trim(),
    email: normalizedEmail,
    studentId: normalizedStudentId,
    password,
    isEmailVerified: false,
    emailVerificationOtp: hashOtp(otp),
    emailVerificationOtpExpires: getOtpExpiryDate(),
  });

  await user.save();

  try {
    await sendVerificationOtpEmail(user.email, otp);
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw createServiceError('Failed to send verification OTP email', 500);
  }

  return {
    user: sanitizeUser(user),
  };
};

const verifyRegisterOtp = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+emailVerificationOtp +emailVerificationOtpExpires'
  );

  if (!user) {
    throw createServiceError('User not found', 404);
  }

  await syncLegacyVerificationState(user);

  if (user.isEmailVerified) {
    const token = createToken(user._id);

    return buildAuthResponse(user, token);
  }

  if (!user.emailVerificationOtp || !user.emailVerificationOtpExpires) {
    throw createServiceError('OTP is invalid or has expired', 400);
  }

  const isOtpValid = compareOtp(otp, user.emailVerificationOtp);

  if (!isOtpValid) {
    throw createServiceError('Invalid OTP', 400);
  }

  if (user.emailVerificationOtpExpires < new Date()) {
    throw createServiceError('OTP has expired', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;
  await user.save();

  const token = createToken(user._id);

  return buildAuthResponse(user, token);
};

const resendRegisterOtp = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+emailVerificationOtp +emailVerificationOtpExpires'
  );

  if (!user) {
    throw createServiceError('User not found', 404);
  }

  await syncLegacyVerificationState(user);

  if (user.isEmailVerified) {
    throw createServiceError('Email is already verified. Please login.', 409, {
      code: 'EMAIL_ALREADY_VERIFIED',
      data: {
        email: normalizedEmail,
      },
    });
  }

  const previousOtp = user.emailVerificationOtp;
  const previousOtpExpiry = user.emailVerificationOtpExpires;
  const otp = generateOtp();

  user.emailVerificationOtp = hashOtp(otp);
  user.emailVerificationOtpExpires = getOtpExpiryDate();
  await user.save();

  try {
    await sendVerificationOtpEmail(user.email, otp);
  } catch (error) {
    user.emailVerificationOtp = previousOtp;
    user.emailVerificationOtpExpires = previousOtpExpiry;
    await user.save();
    throw createServiceError('Failed to send verification OTP email', 500);
  }

  return {
    message: 'Verification OTP sent successfully',
    user: sanitizeUser(user),
    verification: {
      email: user.email,
      expiresInMinutes: OTP_EXPIRES_IN_MINUTES,
      required: true,
    },
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createServiceError('Please provide email and password', 400);
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+password +emailVerificationOtp +emailVerificationOtpExpires'
  );

  if (!user) {
    throw createServiceError('Invalid email or password', 401);
  }

  await syncLegacyVerificationState(user);

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw createServiceError('Invalid email or password', 401);
  }

  if (!user.isEmailVerified) {
    throw createEmailVerificationRequiredError(normalizedEmail);
  }

  const token = createToken(user._id);

  return buildAuthResponse(user, token);
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw createServiceError('User with this email does not exist', 404);
  }

  const otp = generateOtp();
  user.passwordResetOtp = hashOtp(otp);
  user.passwordResetOtpExpires = getOtpExpiryDate();
  await user.save();

  await sendPasswordResetOtpEmail(user.email, otp);

  return {
    message: 'Password reset OTP sent to your email',
  };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+passwordResetOtp +passwordResetOtpExpires +password'
  );

  if (!user) {
    throw createServiceError('User with this email does not exist', 404);
  }

  if (!user.passwordResetOtp || !user.passwordResetOtpExpires) {
    throw createServiceError('OTP is invalid or has expired', 400);
  }

  const isOtpValid = compareOtp(otp, user.passwordResetOtp);

  if (!isOtpValid) {
    throw createServiceError('Invalid OTP', 400);
  }

  if (user.passwordResetOtpExpires < new Date()) {
    throw createServiceError('OTP has expired', 400);
  }

  user.password = newPassword;
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;
  await user.save();

  return {
    message: 'Reset password successfully',
  };
};

module.exports = {
  createServiceError,
  createToken,
  getRedirectUrlByRole,
  sanitizeUser,
  buildAuthResponse,
  syncLegacyVerificationState,
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
};
