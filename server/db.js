/**
 * ========================================
 * Simple In-Memory Database
 * ========================================
 * No MongoDB needed - uses JavaScript array
 */

let tasks = [];

// Get all tasks
function getAllTasks() {
    return tasks;
}

// Create task
function createTask(taskData) {
    const newTask = {
        _id: Date.now().toString(),
        ...taskData
    };
    tasks.unshift(newTask);
    return newTask;
}

// Update task
function updateTask(id, updates) {
    const index = tasks.findIndex(t => t._id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        return tasks[index];
    }
    return null;
}

// Delete task
function deleteTask(id) {
    const index = tasks.findIndex(t => t._id === id);
    if (index !== -1) {
        return tasks.splice(index, 1)[0];
    }
    return null;
}

// Find by ID
function findTaskById(id) {
    return tasks.find(t => t._id === id);
}

// Connect (does nothing for in-memory)
function connectDB() {
    console.log('✓ Using in-memory storage');
    return Promise.resolve();
}

module.exports = {
    connectDB,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    findTaskById
};