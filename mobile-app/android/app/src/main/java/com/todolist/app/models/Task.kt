package com.todolist.app.models

/**
 * Task Model
 * 
 * Represents a single task in the to-do list.
 * 
 * Properties:
 * - id: Unique identifier (from MongoDB _id)
 * - title: Task description/title
 * - label: Category label (important, personal, daily, target)
 * - createdAt: Task creation timestamp
 * - finishBy: Optional deadline timestamp
 * - completed: Boolean status
 * - completedAt: Completion timestamp
 */

data class Task(
    val id: String = "",
    val title: String = "",
    val label: String? = null,
    val createdAt: TaskTimestamp? = null,
    val finishBy: TaskTimestamp? = null,
    val completed: Boolean = false,
    val completedAt: TaskTimestamp? = null
)

/**
 * TaskTimestamp - Stores date and time information
 */
data class TaskTimestamp(
    val date: String = "",      // e.g., "13 Apr 2026"
    val time: String = "",      // e.g., "10:30 AM"
    val timestamp: Long = 0   // Unix timestamp for sorting
)

/**
 * Task Status Enum
 */
enum class TaskStatus {
    ALL,
    PENDING,
    COMPLETED
}

/**
 * Label Enum for task categories
 */
enum class TaskLabel(val value: String, val displayName: String) {
    IMPORTANT("important", "Important"),
    PERSONAL("personal", "Personal"),
    DAILY("daily", "Daily"),
    TARGET("target", "Target");
    
    companion object {
        fun fromValue(value: String?): TaskLabel? {
            return entries.find { it.value == value }
        }
    }
}