import Task from '../models/Task.js';
import User from '../models/User.js';
import {
  sendTaskAssignmentEmail,
  sendTaskSubmittedAcknowledgementEmail,
  sendTaskSubmittedForReviewEmail,
  sendTaskApprovedEmail,
  sendTaskRejectedEmail
} from '../utils/emailService.js';

const sendEmailsSafely = async (emailJobs = []) => {
  const validJobs = emailJobs.filter((job) => typeof job === 'function');
  if (!validJobs.length) return;

  const results = await Promise.allSettled(validJobs.map((job) => job()));
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Task email job failed:', result.reason);
    }
  });
};

// Get tasks (Admins see all or filtered, Volunteers see theirs)
const getTasks = async (req, res) => {
  try {
    let query = {};

    // If not admin/superadmin/developer, restrict to own tasks
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      query.userId = req.user._id;
    } else if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email role')
      .populate('assignedBy', 'name role email');

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

// Create a new task (Admin/SuperAdmin/Developer only)
const createTask = async (req, res) => {
  try {
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create tasks. Only admins can assign tasks.'
      });
    }

    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task description is required'
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Task due date is required'
      });
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Task due date is invalid'
      });
    }

    const allowedPriorities = ['low', 'medium', 'high'];
    if (!priority || !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Task priority is required and must be low, medium, or high'
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please select a volunteer to assign the task to'
      });
    }

    const volunteer = await User.findById(assignedTo).select('name email role');
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not a valid volunteer'
      });
    }

    const task = new Task({
      userId: assignedTo,
      assignedBy: req.user._id,
      title: title.trim(),
      description: description.trim(),
      dueDate: parsedDueDate,
      priority,
      reminderEmailSentAt: null,
      rejectionReason: ''
    });

    await task.save();

    await sendEmailsSafely([
      () => sendTaskAssignmentEmail({
        volunteer,
        task,
        assignedBy: req.user
      })
    ]);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task assigned successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, priority } = req.body;

    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update task details'
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
      task.reminderEmailSentAt = null;
    }
    if (priority !== undefined) task.priority = priority;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete tasks'
      });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

// Submit a task (Volunteer)
const submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    if (!description || description.trim() === '') {
      return res.status(400).json({ success: false, message: 'Submission description is required' });
    }

    const task = await Task.findOne({ _id: taskId, userId: req.user._id }).populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Task is already completed' });
    }

    task.status = 'submitted';
    task.submissionDetails = description.trim();
    task.rejectionReason = '';
    await task.save();

    const superAdmins = await User.find({ role: 'superadmin', isActive: true }).select('name email role');
    const recipients = [task.assignedBy, ...superAdmins]
      .filter((recipient) => recipient?.email)
      .reduce((acc, recipient) => {
        if (!acc.some((item) => item.email === recipient.email)) {
          acc.push(recipient);
        }
        return acc;
      }, []);

    await sendEmailsSafely([
      () => sendTaskSubmittedAcknowledgementEmail({
        volunteer: req.user,
        task
      }),
      ...recipients.map((recipient) => () => sendTaskSubmittedForReviewEmail({
        recipient,
        volunteer: req.user,
        task,
        assignedBy: task.assignedBy || { name: 'Admin' }
      }))
    ]);

    res.status(200).json({ success: true, data: task, message: 'Task submitted for review' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting task' });
  }
};

// Approve a task (Admin)
const approveTask = async (req, res) => {
  try {
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate('userId', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = 'completed';
    task.completed = true;
    task.rejectionReason = '';
    await task.save();

    await sendEmailsSafely([
      () => sendTaskApprovedEmail({
        volunteer: task.userId,
        task,
        reviewer: req.user
      })
    ]);

    res.status(200).json({ success: true, data: task, message: 'Task approved and completed' });
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).json({ success: false, message: 'Server error while approving task' });
  }
};

// Reject a task (Admin)
const rejectTask = async (req, res) => {
  try {
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { taskId } = req.params;
    const { reason } = req.body || {};
    const rejectionReason = (reason || '').trim();

    const task = await Task.findById(taskId).populate('userId', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = 'pending';
    task.completed = false;
    task.rejectionReason = rejectionReason || 'No reason provided';
    task.reminderEmailSentAt = null;
    await task.save();

    await sendEmailsSafely([
      () => sendTaskRejectedEmail({
        volunteer: task.userId,
        task,
        reviewer: req.user,
        reason: task.rejectionReason
      })
    ]);

    res.status(200).json({ success: true, data: task, message: 'Task rejected and moved to pending' });
  } catch (error) {
    console.error('Error rejecting task:', error);
    res.status(500).json({ success: false, message: 'Server error while rejecting task' });
  }
};

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  submitTask,
  approveTask,
  rejectTask
};

