/**
 * ========================================
 * My To-Do List - Backend Server
 * ========================================
 * 
 * Express server with MongoDB (optional) and in-memory fallback.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, getAllTasks, createTask, updateTask, deleteTask, findTaskById } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Middleware
// ========================================

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('../'));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ========================================
// Routes
// ========================================

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server is working!'
    });
});

// API info route
app.get('/api', (req, res) => {
    res.json({
        name: 'My To-Do List API',
        version: '1.0.0',
        message: 'Welcome to My To-Do List API!',
        endpoints: {
            GET_tasks: 'http://localhost:3000/tasks',
            POST_tasks: 'http://localhost:3000/tasks'
        }
    });
});

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    try {
        const tasks = getAllTasks();
        res.json({
            status: 'success',
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST /tasks - Create task
app.post('/tasks', (req, res) => {
    try {
        const { title, label } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ status: 'error', message: 'Title is required' });
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
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, label, completed } = req.body;
        
        const task = findTaskById(id);
        
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        
        const updates = {};
        if (title) updates.title = title;
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
        
        res.json({ status: 'success', message: 'Task updated', data: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = deleteTask(id);
        
        if (!deleted) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }
        
        res.json({ status: 'success', message: 'Task deleted', data: deleted });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ========================================
// Start Server
// ========================================

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`
==========================================
  My To-Do List Backend
==========================================
  Server: http://localhost:${PORT}
  
  Storage: In-Memory (or MongoDB if configured)
  
  Routes:
    GET    /tasks        - Get all tasks
    POST   /tasks       - Create task
    PUT    /tasks/:id    - Update task
    DELETE /tasks/:id    - Delete task
==========================================
        `);
    });
}

startServer();
