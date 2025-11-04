import Task from '../models/Task.js';

// Get all tasks for the current user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
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

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = new Task({
      userId: req.user._id,
      title: title.trim(),
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium'
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
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

    const task = await Task.findOne({ _id: taskId, userId: req.user._id });

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

    const task = await Task.findOneAndDelete({ 
      _id: taskId, 
      userId: req.user._id 
    });

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

    const task = await Task.findOne({ _id: taskId, userId: req.user._id });

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