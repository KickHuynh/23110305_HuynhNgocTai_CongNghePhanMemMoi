const crypto = require('crypto');

const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
};

const compareOtp = (plainOtp, hashedOtp) => {
  if (!plainOtp || !hashedOtp) {
    return false;
  }

  const plainOtpHash = hashOtp(plainOtp);
  const plainOtpBuffer = Buffer.from(plainOtpHash, 'hex');
  const hashedOtpBuffer = Buffer.from(hashedOtp, 'hex');

  if (plainOtpBuffer.length !== hashedOtpBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(plainOtpBuffer, hashedOtpBuffer);
};

module.exports = {
  hashOtp,
  compareOtp,
};
