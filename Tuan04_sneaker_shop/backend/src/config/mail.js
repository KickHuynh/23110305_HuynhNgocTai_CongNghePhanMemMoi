const nodemailer = require('nodemailer');

// Cấu hình transporter dùng để gửi OTP xác thực và đặt lại mật khẩu.
const mailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = mailTransporter;
