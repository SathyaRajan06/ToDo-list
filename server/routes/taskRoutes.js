/**
 * ========================================
 * Task Routes - API Endpoints
 * ========================================
 * 
 * Defines all task-related routes.
 */

const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// GET /tasks - Get all tasks
router.get('/', getAllTasks);

// POST /tasks - Create new task
router.post('/', createTask);

// PUT /tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /tasks/:id - Delete task
router.delete('/:id', deleteTask);

module.exports = router;