import express from 'express';
const router = express.Router();
import { getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } from '../controllers/taskController.js';
import  {protect}  from '../middleware/auth.js';

// @route    GET /api/tasks
// @desc     Get all tasks for the current user
// @access   Private
router.get('/', protect, getTasks);

// @route    POST /api/tasks
// @desc     Create a new task
// @access   Private
router.post('/', protect, createTask);

// @route    PUT /api/tasks/:taskId
// @desc     Update a task
// @access   Private
router.put('/:taskId', protect, updateTask);

// @route    DELETE /api/tasks/:taskId
// @desc     Delete a task
// @access   Private
router.delete('/:taskId', protect, deleteTask);

// @route    PATCH /api/tasks/:taskId/toggle
// @desc     Toggle task completion status
// @access   Private
router.patch('/:taskId/toggle', protect, toggleTaskCompletion);

export default router;