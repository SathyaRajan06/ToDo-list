/**
 * ========================================
 * Database Layer - MongoDB with In-Memory Fallback
 * ========================================
 * Uses in-memory storage if MongoDB is not available.
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// ========================================
// In-Memory Storage (Fallback)
// ========================================
let inMemoryTasks = [];
let inMemoryIdCounter = 1;

const inMemoryDB = {
    getAll: () => [...inMemoryTasks].reverse(),
    create: (task) => {
        const newTask = {
            _id: String(inMemoryIdCounter++),
            ...task,
            __v: 0
        };
        inMemoryTasks.push(newTask);
        return newTask;
    },
    update: (id, updates) => {
        const index = inMemoryTasks.findIndex(t => t._id === id);
        if (index === -1) return null;
        inMemoryTasks[index] = { ...inMemoryTasks[index], ...updates };
        return inMemoryTasks[index];
    },
    delete: (id) => {
        const index = inMemoryTasks.findIndex(t => t._id === id);
        if (index === -1) return null;
        return inMemoryTasks.splice(index, 1)[0];
    },
    findById: (id) => inMemoryTasks.find(t => t._id === id)
};

// ========================================
// MongoDB Schema
// ========================================
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        enum: ['important', 'personal', 'daily', 'target', null],
        default: null
    },
    createdAt: {
        type: Object,
        required: true
    },
    finishBy: {
        type: Object,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Object,
        default: null
    }
}, {
    versionKey: false,
    timestamps: true
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// ========================================
// Use MongoDB or Fallback to In-Memory
// ========================================
let useInMemory = false;

async function connectDB() {
    if (!MONGODB_URI) {
        console.log('⚠ No MONGODB_URI found! Using in-memory storage.');
        useInMemory = true;
        return false;
    }
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✓ MongoDB connected: ${mongoose.connection.host}`);
        return true;
    } catch (error) {
        console.log('⚠ MongoDB connection failed! Using in-memory storage.');
        useInMemory = true;
        return false;
    }
}

function getAllTasks() {
    if (useInMemory) return inMemoryDB.getAll();
    return Task.find().sort({ _id: -1 }).lean();
}

function createTask(taskData) {
    if (useInMemory) return inMemoryDB.create(taskData);
    return Task.create(taskData).then(t => t.toObject());
}

function updateTask(id, updates) {
    if (useInMemory) return inMemoryDB.update(id, updates);
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findByIdAndUpdate(id, updates, { new: true }).lean();
}

function deleteTask(id) {
    if (useInMemory) return inMemoryDB.delete(id);
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findByIdAndDelete(id).lean();
}

function findTaskById(id) {
    if (useInMemory) return inMemoryDB.findById(id);
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findById(id).lean();
}

module.exports = {
    connectDB,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    findTaskById
};