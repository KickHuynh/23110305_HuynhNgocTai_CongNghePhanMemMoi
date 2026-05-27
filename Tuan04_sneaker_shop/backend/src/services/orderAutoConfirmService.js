const { autoConfirmEligibleOrders } = require('./orderService');

const ORDER_AUTO_CONFIRM_INTERVAL_MS = 5 * 60 * 1000;

let orderAutoConfirmInterval = null;

const runAutoConfirmJob = async () => {
  try {
    const result = await autoConfirmEligibleOrders();

    if (result.updatedCount > 0) {
      console.log(
        `[OrderAutoConfirm] Auto-confirmed ${result.updatedCount} order(s).`
      );
    }
  } catch (error) {
    console.error(
      '[OrderAutoConfirm] Failed to auto-confirm eligible orders:',
      error.message
    );
  }
};

const startOrderAutoConfirmJob = () => {
  if (orderAutoConfirmInterval) {
    return orderAutoConfirmInterval;
  }

  console.log(
    '[OrderAutoConfirm] Job started. Checking eligible orders every 5 minutes.'
  );

  orderAutoConfirmInterval = setInterval(
    runAutoConfirmJob,
    ORDER_AUTO_CONFIRM_INTERVAL_MS
  );

  if (typeof orderAutoConfirmInterval.unref === 'function') {
    orderAutoConfirmInterval.unref();
  }

  runAutoConfirmJob();

  return orderAutoConfirmInterval;
};

module.exports = {
  startOrderAutoConfirmJob,
};
