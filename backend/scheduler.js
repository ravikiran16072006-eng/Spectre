const cron = require('node-cron');
const { runAgent } = require('./server');

// Schedule to run every 24 hours at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('[Scheduler] Triggering daily agent run at', new Date().toISOString());
  await runAgent();
});

console.log('[Scheduler] Chron job scheduled for daily execution.');
