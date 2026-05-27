const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^\d{6}$/;
const orderStatusValues = [
  'new',
  'confirmed',
  'preparing',
  'shipping',
  'delivered',
  'cancelled',
  'cancel_requested',
];

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

const normalizeTrimmedText = (value) => {
  return String(value || '').trim();
};

const isPositiveInteger = (value) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 1;
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

const validateAddToCart = (req, res, next) => {
  const { productId, size, color, quantity } = req.body;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(productId || '')) {
    errors.push('A valid productId is required');
  }

  if (!isNonEmptyString(size)) {
    errors.push('Size is required');
  }

  if (!isNonEmptyString(color)) {
    errors.push('Color is required');
  }

  if (!isPositiveInteger(quantity)) {
    errors.push('Quantity is required and must be at least 1');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.productId = String(productId).trim();
  req.body.size = normalizeTrimmedText(size);
  req.body.color = normalizeTrimmedText(color);
  req.body.quantity = Number(quantity);

  return next();
};

const validateUpdateCartItem = (req, res, next) => {
  const { quantity } = req.body;
  const errors = [];

  if (!isPositiveInteger(quantity)) {
    errors.push('Quantity is required and must be at least 1');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.quantity = Number(quantity);

  return next();
};

const validateCheckout = (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;
  const errors = [];

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    errors.push('shippingAddress is required');
  } else {
    if (!isNonEmptyString(shippingAddress.fullName)) {
      errors.push('shippingAddress.fullName is required');
    }

    if (!isNonEmptyString(shippingAddress.phone)) {
      errors.push('shippingAddress.phone is required');
    }

    if (!isNonEmptyString(shippingAddress.addressLine)) {
      errors.push('shippingAddress.addressLine is required');
    }

    if (!isNonEmptyString(shippingAddress.city)) {
      errors.push('shippingAddress.city is required');
    }
  }

  if (normalizeTrimmedText(paymentMethod).toUpperCase() !== 'COD') {
    errors.push('paymentMethod must be COD');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.paymentMethod = 'COD';
  req.body.shippingAddress = {
    fullName: normalizeTrimmedText(shippingAddress.fullName),
    phone: normalizeTrimmedText(shippingAddress.phone),
    addressLine: normalizeTrimmedText(shippingAddress.addressLine),
    ward: normalizeTrimmedText(shippingAddress.ward),
    district: normalizeTrimmedText(shippingAddress.district),
    city: normalizeTrimmedText(shippingAddress.city),
    note: normalizeTrimmedText(shippingAddress.note),
  };

  return next();
};

const validateCancelOrder = (req, res, next) => {
  const { reason } = req.body || {};
  const errors = [];

  if (
    Object.prototype.hasOwnProperty.call(req.body || {}, 'reason') &&
    typeof reason !== 'string'
  ) {
    errors.push('reason must be a string if provided');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body = {
    ...req.body,
    reason: normalizeTrimmedText(reason),
  };

  return next();
};

const validateUpdateOrderStatus = (req, res, next) => {
  const { status, note } = req.body;
  const errors = [];

  if (!isNonEmptyString(status) || !orderStatusValues.includes(status.trim())) {
    errors.push(`status must be one of: ${orderStatusValues.join(', ')}`);
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'note') &&
    typeof note !== 'string'
  ) {
    errors.push('note must be a string if provided');
  }

  if (errors.length > 0) {
    return sendValidationErrors(res, errors);
  }

  req.body.status = status.trim();
  req.body.note = normalizeTrimmedText(note);

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
  validateAddToCart,
  validateUpdateCartItem,
  validateCheckout,
  validateCancelOrder,
  validateUpdateOrderStatus,
};
