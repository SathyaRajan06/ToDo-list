package com.todolist.app

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.chip.Chip
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.timepicker.MaterialTimePicker
import com.google.android.material.timepicker.TimeFormat
import com.todolist.app.adapter.TaskAdapter
import com.todolist.app.api.ApiService
import com.todolist.app.databinding.ActivityMainBinding
import com.todolist.app.models.Task
import com.todolist.app.models.TaskStatus
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Main Activity
 * 
 * Home screen showing the task list with filters.
 * Handles all CRUD operations through the API.
 */

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var taskAdapter: TaskAdapter
    
    private var allTasks = mutableListOf<Task>()
    private var currentFilter = TaskStatus.ALL
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        setupFilterChips()
        setupFab()
        loadTasks()
    }
    
    // Setup RecyclerView
    private fun setupRecyclerView() {
        taskAdapter = TaskAdapter(
            onCompleteClick = { task -> toggleComplete(task) },
            onEditClick = { task -> showEditDialog(task) },
            onDeleteClick = { task -> deleteTask(task) }
        )
        
        binding.recyclerTasks.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = taskAdapter
        }
    }
    
    // Setup Filter Chips
    private fun setupFilterChips() {
        binding.chipGroupFilter.setOnCheckedStateChangeListener { _, checkedIds ->
            when {
                checkedIds.contains(binding.chipAll.id) -> {
                    currentFilter = TaskStatus.ALL
                    filterTasks()
                }
                checkedIds.contains(binding.chipPending.id) -> {
                    currentFilter = TaskStatus.PENDING
                    filterTasks()
                }
                checkedIds.contains(binding.chipCompleted.id) -> {
                    currentFilter = TaskStatus.COMPLETED
                    filterTasks()
                }
            }
        }
    }
    
    // Setup FAB
    private fun setupFab() {
        binding.fabAddTask.setOnClickListener {
            showAddTaskBottomSheet()
        }
    }
    
    // Load Tasks from API
    private fun loadTasks() {
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                allTasks = ApiService.getTasks().toMutableList()
                filterTasks()
            } catch (e: Exception) {
                showMessage("Unable to load tasks")
            } finally {
                showLoading(false)
            }
        }
    }
    
    // Filter tasks based on current selection
    private fun filterTasks() {
        val filtered = when (currentFilter) {
            TaskStatus.ALL -> allTasks
            TaskStatus.PENDING -> allTasks.filter { !it.completed }
            TaskStatus.COMPLETED -> allTasks.filter { it.completed }
        }
        
        taskAdapter.submitList(filtered)
        updateTaskCount(filtered.size)
        
        // Show/hide empty state
        if (filtered.isEmpty()) {
            binding.layoutEmpty.visibility = View.VISIBLE
            binding.recyclerTasks.visibility = View.GONE
            
            if (allTasks.isEmpty()) {
                binding.textEmptyTitle.text = getString(com.todolist.app.R.string.empty_tasks)
                binding.textEmptyMessage.text = getString(com.todolist.app.R.string.empty_tasks_message)
            } else {
                binding.textEmptyTitle.text = getString(com.todolist.app.R.string.empty_no_results)
                binding.textEmptyMessage.text = getString(com.todolist.app.R.string.empty_no_results_message)
            }
        } else {
            binding.layoutEmpty.visibility = View.GONE
            binding.recyclerTasks.visibility = View.VISIBLE
        }
    }
    
    // Update task count
    private fun updateTaskCount(count: Int) {
        val pending = allTasks.count { !it.completed }
        
        when {
            count == 0 -> binding.textTaskCount.text = "0 tasks"
            pending == 0 -> binding.textTaskCount.text = "All done! 🎉"
            else -> binding.textTaskCount.text = "$pending task${if (pending != 1) "s" else ""}"
        }
    }
    
    // Toggle task completion
    private fun toggleComplete(task: Task) {
        lifecycleScope.launch {
            try {
                val updatedTask = ApiService.updateTask(
                    id = task.id,
                    title = null,
                    label = null,
                    completed = !task.completed
                )
                
                if (updatedTask != null) {
                    // Update local list
                    val index = allTasks.indexOfFirst { it.id == task.id }
                    if (index != -1) {
                        allTasks[index] = updatedTask
                    }
                    filterTasks()
                    
                    // Show message
                    if (!task.completed) {
                        showMessage("Task completed! 🎉")
                    } else {
                        showMessage("Task marked as pending")
                    }
                }
            } catch (e: Exception) {
                showMessage("Unable to update task")
            }
        }
    }
    
    // Show add task bottom sheet
    private fun showAddTaskBottomSheet() {
        val bottomSheet = AddTaskBottomSheet()
        bottomSheet.show(supportFragmentManager, "AddTaskBottomSheet")
        
        // Reload tasks after adding
        bottomSheet.setOnTaskSavedListener {
            loadTasks()
        }
    }
    
    // Show edit dialog (reuse bottom sheet)
    private fun showEditDialog(task: Task) {
        val bottomSheet = AddTaskBottomSheet.newInstance(task)
        bottomSheet.show(supportFragmentManager, "EditTaskBottomSheet")
        
        bottomSheet.setOnTaskSavedListener {
            loadTasks()
        }
    }
    
    // Delete task
    private fun deleteTask(task: Task) {
        lifecycleScope.launch {
            try {
                val success = ApiService.deleteTask(task.id)
                
                if (success) {
                    allTasks.removeAll { it.id == task.id }
                    filterTasks()
                    showMessage("Task deleted")
                }
            } catch (e: Exception) {
                showMessage("Unable to delete task")
            }
        }
    }
    
    // Show loading indicator
    private fun showLoading(loading: Boolean) {
        binding.progressBar.visibility = if (loading) View.VISIBLE else View.GONE
    }
    
    // Show toast message
    private fun showMessage(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }
    
    // Refresh tasks (called from bottom sheet)
    fun refreshTasks() {
        loadTasks()
    }
}