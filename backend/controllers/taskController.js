import Task from '../models/Task.js';

// Get all tasks for the current user
// Get tasks (Admins see all or filtered, Volunteers see theirs)
const getTasks = async (req, res) => {
  try {
    let query = {};

    // If not admin/superadmin/developer, restrict to own tasks
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      query.userId = req.user._id;
    } else {
      // Admin might want to filter by userId
      if (req.query.userId) {
        query.userId = req.query.userId;
      }
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email role')
      .populate('assignedBy', 'name role');

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
    // Check permissions
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

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please select a volunteer to assign the task to'
      });
    }

    const task = new Task({
      userId: assignedTo, // The volunteer
      assignedBy: req.user._id, // The admin
      title: title.trim(),
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium'
    });

    await task.save();

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

    let query = { _id: taskId };

    // Volunteers can't update task details, only admins
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update task details'
      });
    }

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
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

    let query = { _id: taskId };

    // Only admins can delete tasks
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete tasks'
      });
    }

    const task = await Task.findOneAndDelete(query);

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

// Toggle task completion status
const toggleTaskCompletion = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    let query = { _id: taskId };

    // If volunteer, can only complete own tasks
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      query.userId = req.user._id;
    }

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.completed = completed === true;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task completion status updated'
    });
  } catch (error) {
    console.error('Error updating task completion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task completion'
    });
  }
};

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};