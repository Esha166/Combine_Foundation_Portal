import Task from '../models/Task.js';
import { sendTaskReminderEmail } from '../utils/emailService.js';

let reminderInterval = null;

const REMINDER_WINDOW_HOURS = 36;
const DEFAULT_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const processTaskDeadlineReminders = async () => {
  try {
    const now = new Date();
    const reminderWindowEnd = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 60 * 60 * 1000);

    const tasks = await Task.find({
      status: 'pending',
      dueDate: { $ne: null, $gt: now, $lte: reminderWindowEnd },
      reminderEmailSentAt: null
    })
      .populate('userId', 'name email')
      .populate('assignedBy', 'name email role');

    if (!tasks.length) {
      return;
    }

    for (const task of tasks) {
      if (!task.userId?.email) {
        continue;
      }

      const result = await sendTaskReminderEmail({
        volunteer: task.userId,
        task
      });

      if (result?.success) {
        task.reminderEmailSentAt = new Date();
        await task.save();
      }
    }
  } catch (error) {
    console.error('Task reminder worker error:', error);
  }
};

const startTaskReminderWorker = () => {
  if (process.env.DISABLE_TASK_REMINDER_WORKER === 'true') {
    console.log('Task reminder worker is disabled by environment setting');
    return;
  }

  if (reminderInterval) {
    return;
  }

  const configuredInterval = Number(process.env.TASK_REMINDER_INTERVAL_MS);
  const intervalMs = Number.isFinite(configuredInterval) && configuredInterval > 0
    ? configuredInterval
    : DEFAULT_INTERVAL_MS;

  processTaskDeadlineReminders();
  reminderInterval = setInterval(processTaskDeadlineReminders, intervalMs);
  console.log(`Task reminder worker started. Interval: ${intervalMs}ms, window: ${REMINDER_WINDOW_HOURS}h`);
};

export {
  startTaskReminderWorker,
  processTaskDeadlineReminders
};
