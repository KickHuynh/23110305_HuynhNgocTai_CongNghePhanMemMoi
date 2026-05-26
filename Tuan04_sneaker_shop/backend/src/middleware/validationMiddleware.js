const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^\d{6}$/;

const sendValidationErrors = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const validateRegister = (req, res, next) => {
  const { fullName, email, studentId, password } = req.body;
  const errors = [];

  if (!isNonEmptyString(fullName) || fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (!isNonEmptyString(studentId)) {
    errors.push('Student ID is required');
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.fullName = fullName.trim();
  req.body.email = normalizeEmail(email);
  req.body.studentId = studentId.trim();

  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.email = normalizeEmail(email);

  return next();
};

const validateVerifyOtp = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (typeof otp !== 'string' || !otpRegex.test(otp.trim())) {
    errors.push('OTP is required and must be 6 digits');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.email = normalizeEmail(email);
  req.body.otp = otp.trim();

  return next();
};

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.email = normalizeEmail(email);

  return next();
};

const validateResendOtp = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.email = normalizeEmail(email);

  return next();
};

const validateResetPassword = (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !emailRegex.test(email.trim())) {
    errors.push('A valid email is required');
  }

  if (typeof otp !== 'string' || !otpRegex.test(otp.trim())) {
    errors.push('OTP is required and must be 6 digits');
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    errors.push('New password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.email = normalizeEmail(email);
  req.body.otp = otp.trim();

  return next();
};

const validateUpdateProfile = (req, res, next) => {
  const errors = [];

  if (Object.prototype.hasOwnProperty.call(req.body, 'role')) {
    errors.push('Role cannot be updated from this API');
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
    errors.push('Password cannot be updated from this API');
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'fullName') &&
    (!isNonEmptyString(req.body.fullName) || req.body.fullName.trim().length < 2)
  ) {
    errors.push('Full name must be at least 2 characters');
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'email') &&
    (!isNonEmptyString(req.body.email) ||
      !emailRegex.test(req.body.email.trim()))
  ) {
    errors.push('Email must be a valid email address');
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'studentId') &&
    !isNonEmptyString(req.body.studentId)
  ) {
    errors.push('Student ID cannot be empty');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  if (typeof req.body.fullName === 'string') {
    req.body.fullName = req.body.fullName.trim();
  }

  if (typeof req.body.email === 'string') {
    req.body.email = normalizeEmail(req.body.email);
  }

  if (typeof req.body.studentId === 'string') {
    req.body.studentId = req.body.studentId.trim();
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateVerifyOtp,
  validateForgotPassword,
  validateResendOtp,
  validateResetPassword,
  validateUpdateProfile,
};
