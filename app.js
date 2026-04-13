/**
 * ================================================
 * My To-Do List - JavaScript
 * ================================================
 * Features:
 * - Add tasks with title, label, deadline
 * - Task status (pending/completed)
 * - Created time & finish time tracking
 * - Emoji reactions on completion
 * - Filters & sort
 * - LocalStorage persistence
 */

/* ================================================
   Global Variables & DOM Elements
   ================================================ */

// Input elements
const taskInput = document.getElementById('taskInput');
const finishDate = document.getElementById('finishDate');
const finishTime = document.getElementById('finishTime');
const labelSelect = document.getElementById('labelSelect');
const addBtn = document.getElementById('addBtn');

// List elements
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');

// Splash screen elements
const splashScreen = document.getElementById('splashScreen');
const splashQuote = document.getElementById('splashQuote');
const mainContainer = document.querySelector('.container');

// Filter button elements
const labelFilterBtns = document.querySelectorAll('.label-filter-btn');
const statusFilterBtns = document.querySelectorAll('.status-filter-btn');
const sortFilterBtns = document.querySelectorAll('.sort-filter-btn');

// Toast container
let toastContainer;

/* ================================================
   Toast Notifications
   ================================================ */

// Create toast container
function createToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => toast.remove(), 3000);
}

/* ================================================
   API Configuration
   ================================================ */

// Backend API URL
const API_URL = 'http://localhost:3000/tasks';

/* ================================================
   Data Collections
   ================================================ */

// Label configurations
const LABELS = {
    important: { text: 'Important', class: 'important' },
    personal: { text: 'Personal', class: 'personal' },
    daily: { text: 'Daily', class: 'daily' },
    target: { text: 'Target', class: 'target' }
};

// Celebration emojis (shown when completing)
const CELEBRATION_EMOJIS = ['🎉', '❤️', '😊', '😍', '✨', '⭐', '🔥', '💪', '🙌', '🌟'];

// Pending/waiting emojis
const PENDING_EMOJIS = ['😔', '⏳', '😟'];

// Motivational quotes for splash
const QUOTES = [
    "Every task you complete brings you closer to your goals.",
    "Small steps lead to big achievements. Start today!",
    "Your productivity is your superpower. Use it wisely!",
    "One task at a time. You've got this!",
    "Progress not perfection. Keep moving forward!",
    "Today's effort is tomorrow's success.",
    "Every completed task is a win. Celebrate it!",
    "Stay focused. Stay determined. Keep going!",
    "The secret to success is starting. You did it!",
    "Make it happen. One task at a time."
];

/* ================================================
   State Management
   ================================================ */

let tasks = [];  // All tasks array
let currentLabelFilter = 'all';
let currentStatusFilter = 'all';
let currentSortOrder = 'newest';

/* ================================================
   Initialization
   ================================================ */

// Initialize the app
async function init() {
    await loadTasks();
    setupEventListeners();
    initSplashScreen();
    renderTasks();
    
    // Set default deadline to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    finishDate.valueAsDate = tomorrow;
    finishTime.value = "17:00";
}

// Event Listeners Setup
function setupEventListeners() {
    // Add task button
    addBtn.addEventListener('click', addTask);
    
    // Enter key to add task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Label filter buttons
    labelFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLabelFilter = btn.dataset.filter;
            updateFilterButtons(labelFilterBtns, btn);
            renderTasks();
        });
    });
    
    // Status filter buttons
    statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStatusFilter = btn.dataset.filter;
            updateFilterButtons(statusFilterBtns, btn);
            renderTasks();
        });
    });
    
    // Sort filter buttons
    sortFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSortOrder = btn.dataset.sort;
            updateFilterButtons(sortFilterBtns, btn);
            renderTasks();
        });
    });
    
    // Task list click delegation (checkbox, complete, delete)
    taskList.addEventListener('click', (e) => {
        const checkbox = e.target.closest('.checkbox');
        const completeBtn = e.target.closest('.complete-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (checkbox) {
            const index = parseInt(checkbox.dataset.index);
            toggleTask(index);
        } else if (completeBtn) {
            const index = parseInt(completeBtn.dataset.index);
            toggleTask(index);
        } else if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            deleteTask(index);
        }
    });
}

// Update active filter button
function updateFilterButtons(buttons, activeBtn) {
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/* ================================================
   Splash Screen
   ================================================ */

function initSplashScreen() {
    // Get random motivational quote
    const randomIndex = new Date().getTime() % QUOTES.length;
    splashQuote.textContent = QUOTES[randomIndex];
    
    // Hide splash, show main
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        mainContainer.classList.add('visible');
    }, 2500);
}

/* ================================================
   LocalStorage Functions
   ================================================ */

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Server error');
        
        const result = await response.json();
        
        if (result.status === 'success') {
            tasks = result.data;
        } else {
            tasks = [];
        }
    } catch (error) {
        console.log('Server not running or error:', error.message);
        tasks = [];
    }
}

// Save tasks (not needed with API - kept for compatibility)
function saveTasks() {
    // Tasks are saved via API calls
}

/* ================================================
   Date/Time Formatting
   ================================================ */

// Format date: "11 Apr 2026"
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Format time: "10:30 AM"
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

// Get current timestamp with raw value for sorting
function getCurrentTimestamp() {
    const now = new Date();
    return {
        date: formatDate(now),
        time: formatTime(now),
        timestamp: now.getTime()
    };
}

// Format deadline from input
function formatDeadline() {
    if (!finishDate.value) return null;
    
    let date = finishDate.value;
    let time = finishTime.value || '17:00';
    
    // Parse date and time
    const dateObj = new Date(date + 'T' + time);
    
    return {
        date: formatDate(dateObj),
        time: formatTime(dateObj),
        timestamp: dateObj.getTime()
    };
}

/* ================================================
   Task Filtering & Sorting
   ================================================ */

// Get filtered and sorted tasks
function getFilteredTasks() {
    let filtered = [...tasks];
    
    // Filter by label
    if (currentLabelFilter !== 'all') {
        filtered = filtered.filter(t => t.label === currentLabelFilter);
    }
    
    // Filter by status
    if (currentStatusFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentStatusFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }
    
    // Sort by date (handle both object format and Date object)
    filtered.sort((a, b) => {
        let dateA, dateB;
        
        // Handle createdAt - could be object with timestamp or Date
        if (a.createdAt && a.createdAt.timestamp) {
            dateA = a.createdAt.timestamp;
        } else if (a.createdAt instanceof Date) {
            dateA = a.createdAt.getTime();
        }
        
        if (b.createdAt && b.createdAt.timestamp) {
            dateB = b.createdAt.timestamp;
        } else if (b.createdAt instanceof Date) {
            dateB = b.createdAt.getTime();
        }
        
        // Default to current time if no date
        dateA = dateA || Date.now();
        dateB = dateB || Date.now();
        
        return currentSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
}

// Update task count display
function updateTaskCount() {
    const filtered = getFilteredTasks();
    const activeTasks = tasks.filter(t => !t.completed).length;
    const total = tasks.length;
    const filteredTotal = filtered.length;
    
    if (total === 0) {
        taskCount.textContent = '0 tasks';
    } else if (activeTasks === 0 && total > 0) {
        taskCount.textContent = 'All done! 🎉';
    } else if (currentLabelFilter !== 'all' || currentStatusFilter !== 'all') {
        taskCount.textContent = `${filteredTotal} of ${total}`;
    } else {
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''}`;
    }
}

/* ================================================
   Task Rendering
   ================================================ */

function renderTasks() {
    // Remove existing task elements
    const existingTasks = taskList.querySelectorAll('.task-item');
    existingTasks.forEach(task => task.remove());
    
    const filtered = getFilteredTasks();
    
    if (filtered.length === 0) {
        // Show empty state
        emptyState.style.display = 'block';
        emptyState.classList.remove('filtered');
        
        if (tasks.length === 0) {
            emptyState.querySelector('h3').textContent = 'No tasks yet';
            emptyState.querySelector('p').textContent = 'Add your first task above to get started!';
        } else {
            emptyState.classList.add('filtered');
            emptyState.querySelector('h3').textContent = 'No matching tasks';
            emptyState.querySelector('p').textContent = 'Try changing your filters';
        }
        
        taskList.appendChild(emptyState);
    } else {
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Render tasks with staggered animation
        filtered.forEach((task, index) => {
            const taskEl = createTaskElement(task, index);
            taskEl.style.animationDelay = `${index * 0.05}s`;
            taskList.appendChild(taskEl);
        });
    }
    
    updateTaskCount();
}

// Create HTML for a single task
function createTaskElement(task, index) {
    const taskEl = document.createElement('div');
    
    // Add status class
    const statusClass = task.completed ? 'completed' : 'pending';
    taskEl.className = `task-item ${statusClass}`;
    
    // Get pending emoji
    const pendingEmoji = task.completed ? '' : 
        `<span class="task-status-emoji">${PENDING_EMOJIS[index % PENDING_EMOJIS.length]}</span>`;
    
    // Label badge
    const labelHtml = task.label && LABELS[task.label] 
        ? `<span class="task-label ${LABELS[task.label].class}">${LABELS[task.label].text}</span>` 
        : '';
    
    // Created time
    const createdHtml = `
        <div class="task-meta-row created">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Created: ${task.createdAt.date}, ${task.createdAt.time}</span>
        </div>`;
    
    // Finish/Deadline time
    const finishHtml = task.finishBy && !task.completed
        ? `<div class="task-meta-row finish-by">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 18 18.12 16.71 23 8.09 18.91 2 14.55 5.64 9.27 2 9.27"></polygon>
            </svg>
            <span>Finish by: ${task.finishBy.date}, ${task.finishBy.time}</span>
        </div>`
        : '';
    
    // Completed time
    const completedHtml = task.completed && task.completedAt
        ? `<div class="task-meta-row completed-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Completed: ${task.completedAt.date}, ${task.completedAt.time}</span>
        </div>`
        : '';
    
    // Checkbox icon
    const checkboxIcon = task.completed 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`
        : '';
    
    // Get title (support both 'title' from API and 'text' from localStorage)
    const taskTitle = task.title || task.text || 'Untitled Task';
    
    // Get formatted date/time (support both object format and Date object)
    function formatTaskDate(dateObj, prefix) {
        if (!dateObj) return '';
        
        let dateStr, timeStr;
        
        if (dateObj && typeof dateObj === 'object') {
            // Object format: { date: "11 Apr 2026", time: "5:30 PM" }
            dateStr = dateObj.date;
            timeStr = dateObj.time;
        } else if (dateObj instanceof Date) {
            // Date object from MongoDB
            dateStr = formatDate(dateObj);
            timeStr = formatTime(dateObj);
        }
        
        if (!dateStr) return '';
        
        return `<div class="task-meta-row ${prefix}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Created: ${dateStr}${timeStr ? ', ' + timeStr : ''}</span>
        </div>`;
    }
    
    taskEl.innerHTML = `
        <div class="task-left">
            <div class="checkbox${task.completed ? ' checked' : ''}" data-index="${index}">
                ${checkboxIcon}
            </div>
            <div class="task-content">
                <div class="task-header-row">
                    <span class="task-text">${escapeHtml(taskTitle)}</span>
                    ${pendingEmoji}
                    ${labelHtml}
                </div>
                <div class="task-meta">
                    ${formatTaskDate(task.createdAt, 'created')}
                    ${formatTaskDate(task.finishBy, 'finish-by')}
                    ${formatTaskDate(task.completedAt, 'completed-time')}
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn${task.completed ? ' completed' : ''}" data-index="${index}">
                ${task.completed ? '✓ Done' : '✓ Complete'}
            </button>
            <button class="delete-btn" data-index="${index}" title="Delete task">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    `;
    
    return taskEl;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ================================================
   Task Actions
   ================================================ */

// Add a new task via API
async function addTask() {
    const text = taskInput.value.trim();
    const label = labelSelect.value;
    
    if (!text) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: text,
                label: label || null
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Reload tasks to get updated list
            await loadTasks();
            renderTasks();
            
            // Reset inputs
            taskInput.value = '';
            labelSelect.value = '';
            
            // Set next deadline to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            finishDate.valueAsDate = tomorrow;
            finishTime.value = '17:00';
            
            taskInput.focus();
            
            // Success feedback
            addBtn.classList.add('success-flash');
            setTimeout(() => addBtn.classList.remove('success-flash'), 500);
            
            // Show toast
            showToast('Task added successfully!');
        } else {
            showToast('Failed to create task', 'error');
            console.error('Failed to create task:', result.message);
        }
    } catch (error) {
        showToast('Cannot connect to server', 'error');
        console.error('Error creating task:', error);
    }
}

// Toggle task completion via API
async function toggleTask(index) {
    const filtered = getFilteredTasks();
    const task = filtered[index];
    
    if (!task) return;
    
    const newCompletedStatus = !task.completed;
    
    try {
        const response = await fetch(`${API_URL}/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: newCompletedStatus
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Reload tasks to get updated list
            await loadTasks();
            renderTasks();
            
            // Show toast
            if (newCompletedStatus) {
                showToast('Task completed! 🎉');
                showCelebrationReaction(task);
            } else {
                showToast('Task marked as pending');
            }
        } else {
            showToast('Failed to update task', 'error');
            console.error('Failed to update task:', result.message);
        }
    } catch (error) {
        showToast('Error updating task', 'error');
        console.error('Error updating task:', error);
    }
}

// Delete a task via API
async function deleteTask(index) {
    const filtered = getFilteredTasks();
    const task = filtered[index];
    
    if (!task) return;
    
    try {
        const response = await fetch(`${API_URL}/${task._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Reload tasks to get updated list
            await loadTasks();
            renderTasks();
            showToast('Task deleted');
        } else {
            showToast('Failed to delete task', 'error');
            console.error('Failed to delete task:', result.message);
        }
    } catch (error) {
        showToast('Error deleting task', 'error');
        console.error('Error deleting task:', error);
    }
}

// Show celebration emoji reaction
function showCelebrationReaction(task) {
    const filtered = getFilteredTasks();
    const taskIndex = filtered.findIndex(t => t._id === task._id);
    
    if (taskIndex === -1) return;
    
    // Get all task elements
    const taskItems = taskList.querySelectorAll('.task-item');
    const taskEl = taskItems[taskIndex];
    
    if (taskEl) {
        // Get random celebration emoji
        const randomEmoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
        
        // Create celebration emoji element
        const emojiEl = document.createElement('span');
        emojiEl.className = 'task-celebration-emoji';
        emojiEl.textContent = randomEmoji;
        
        // Add to task
        taskEl.appendChild(emojiEl);
        
        // Remove after animation
        setTimeout(() => emojiEl.remove(), 600);
    }
}

/* ================================================
   App Start
   ================================================ */

// Initialize when page loads
init();