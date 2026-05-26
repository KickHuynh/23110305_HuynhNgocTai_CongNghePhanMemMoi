require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const legacyVerifiedUsers = await User.updateMany(
    {
      isEmailVerified: { $exists: false },
      emailVerificationOtp: { $exists: false },
      emailVerificationOtpExpires: { $exists: false },
    },
    {
      $set: { isEmailVerified: true },
    }
  );

  const legacyPendingUsers = await User.updateMany(
    {
      isEmailVerified: { $exists: false },
      $or: [
        { emailVerificationOtp: { $exists: true } },
        { emailVerificationOtpExpires: { $exists: true } },
      ],
    },
    {
      $set: { isEmailVerified: false },
    }
  );

  console.log(
    JSON.stringify(
      {
        success: true,
        verifiedUsersBackfilled: legacyVerifiedUsers.modifiedCount || 0,
        pendingUsersBackfilled: legacyPendingUsers.modifiedCount || 0,
      },
      null,
      2
    )
  );
};

run()
  .catch((error) => {
    console.error('Backfill email verification failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
