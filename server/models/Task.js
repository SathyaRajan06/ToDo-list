/**
 * ========================================
 * Task Model - Mongoose Schema
 * ========================================
 * 
 * A simple Task model for the To-Do app.
 */

const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
    // Task title (required)
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    // Task label category
    label: {
        type: String,
        enum: ['important', 'personal', 'daily', 'target', null],
        default: null
    },
    
    // Creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // Completion status
    completed: {
        type: Boolean,
        default: false
    },
    
    // Completion timestamp
    completedAt: {
        type: Date,
        default: null
    }
}, {
    // Auto-add createdAt and updatedAt timestamps
    timestamps: true
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Export
module.exports = Task;