const mailTransporter = require('../config/mail');

const OTP_EXPIRES_IN_MINUTES =
  Number.parseInt(process.env.OTP_EXPIRES_IN_MINUTES, 10) || 10;

const buildOtpEmailText = (otp, purpose) => {
  return [
    `Your Sneaker Shop ${purpose} OTP is: ${otp}`,
    `This OTP will expire in ${OTP_EXPIRES_IN_MINUTES} minutes.`,
    'If you did not request this, please ignore this email.',
  ].join('\n');
};

const sendVerificationOtpEmail = async (email, otp) => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Sneaker Shop Email Verification OTP',
    text: buildOtpEmailText(otp, 'email verification'),
  });
};

const sendPasswordResetOtpEmail = async (email, otp) => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Sneaker Shop Password Reset OTP',
    text: buildOtpEmailText(otp, 'password reset'),
  });
};

module.exports = {
  sendVerificationOtpEmail,
  sendPasswordResetOtpEmail,
};
