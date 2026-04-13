/**
 * ========================================
 * Task Controller - CRUD Operations
 * ========================================
 * 
 * Uses in-memory storage (no MongoDB required).
 */

const { getAllTasks, createTask, updateTask, deleteTask, findTaskById } = require('../db');

// Get all tasks
async function getAllTasks(req, res) {
    try {
        const tasks = getAllTasks();
        
        res.json({
            status: 'success',
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// Create new task
async function createTask(req, res) {
    try {
        const { title, label } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        }
        
        const now = new Date();
        
        const newTask = createTask({
            title: title.trim(),
            label: label || null,
            createdAt: {
                date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                timestamp: now.getTime()
            },
            completed: false,
            completedAt: null
        });
        
        res.status(201).json({
            status: 'success',
            message: 'Task created',
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// Update task
async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, label, completed } = req.body;
        
        const task = findTaskById(id);
        
        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }
        
        const updates = {};
        if (title) updates.title = title.trim();
        if (label !== undefined) updates.label = label;
        
        if (completed !== undefined) {
            updates.completed = completed;
            if (completed) {
                const now = new Date();
                updates.completedAt = {
                    date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    timestamp: now.getTime()
                };
            } else {
                updates.completedAt = null;
            }
        }
        
        const updated = updateTask(id, updates);
        
        res.json({
            status: 'success',
            message: 'Task updated',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// Delete task
async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        
        const deleted = deleteTask(id);
        
        if (!deleted) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }
        
        res.json({
            status: 'success',
            message: 'Task deleted',
            data: deleted
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// Export all functions
module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
};