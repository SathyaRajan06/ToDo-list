package com.todolist.app.ui

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.todolist.app.api.ApiService
import com.todolist.app.databinding.BottomSheetAddTaskBinding
import com.todolist.app.models.Task
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

/**
 * Add Task Bottom Sheet
 * 
 * Bottom sheet for adding or editing tasks.
 * Reuses the same layout for both actions.
 */

class AddTaskBottomSheet : BottomSheetDialogFragment() {
    
    private var _binding: BottomSheetAddTaskBinding? = null
    private val binding get() = _binding!!
    
    private var editTask: Task? = null
    private var onTaskSavedListener: (() -> Unit)? = null
    
    private val calendar = Calendar.getInstance()
    private val dateFormat = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
    private val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
    
    companion object {
        fun newInstance(task: Task): AddTaskBottomSheet {
            return AddTaskBottomSheet().apply {
                arguments = Bundle().apply {
                    putString("task_id", task.id)
                    putString("task_title", task.title)
                    putString("task_label", task.label)
                }
            }
        }
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = BottomSheetAddTaskBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Check if editing
        arguments?.let { args ->
            if (args.containsKey("task_id")) {
                editTask = Task(
                    id = args.getString("task_id", ""),
                    title = args.getString("task_title", ""),
                    label = args.getString("task_label")
                )
                
                binding.textSheetTitle.text = "Edit Task"
                binding.editTaskTitle.setText(editTask?.title)
                
                // Set label chip
                when (editTask?.label) {
                    "important" -> binding.chipImportant.isChecked = true
                    "personal" -> binding.chipPersonal.isChecked = true
                    "daily" -> binding.chipDaily.isChecked = true
                    "target" -> binding.chipTarget.isChecked = true
                    else -> binding.chipNoLabel.isChecked = true
                }
            }
        }
        
        setupDatePicker()
        setupTimePicker()
        setupButtons()
    }
    
    // Setup Date Picker
    private fun setupDatePicker() {
        binding.editFinishDate.setOnClickListener {
            val picker = MaterialDatePicker.Builder.datePicker()
                .setTitleText("Select Finish Date")
                .setSelection(calendar.timeInMillis)
                .build()
            
            picker.addOnPositiveButtonClickListener { selection ->
                calendar.timeInMillis = selection
                binding.editFinishDate.setText(dateFormat.format(calendar.time))
            }
            
            picker.show(childFragmentManager, "datePicker")
        }
    }
    
    // Setup Time Picker
    private fun setupTimePicker() {
        binding.editFinishTime.setOnClickListener {
            val picker = MaterialTimePicker.Builder()
                .setTimeFormat(TimeFormat.h12a)
                .setTitleText("Select Finish Time")
                .setHour(17)
                .setMinute(0)
                .build()
            
            picker.addOnPositiveButtonClickListener {
                calendar.set(Calendar.HOUR_OF_DAY, picker.hour)
                calendar.set(Calendar.MINUTE, picker.minute)
                binding.editFinishTime.setText(timeFormat.format(calendar.time))
            }
            
            picker.show(childFragmentManager, "timePicker")
        }
    }
    
    // Setup Buttons
    private fun setupButtons() {
        binding.btnCancel.setOnClickListener {
            dismiss()
        }
        
        binding.btnSave.setOnClickListener {
            saveTask()
        }
    }
    
    // Save Task
    private fun saveTask() {
        val title = binding.editTaskTitle.text.toString().trim()
        
        if (title.isEmpty()) {
            binding.inputLayoutTitle.error = "Title is required"
            return
        }
        
        binding.inputLayoutTitle.error = null
        
        // Get selected label
        val label = when (binding.chipGroupLabel.checkedChipId) {
            binding.chipImportant.id -> "important"
            binding.chipPersonal.id -> "personal"
            binding.chipDaily.id -> "daily"
            binding.chipTarget.id -> "target"
            else -> null
        }
        
        // Get finish date/time
        val finishDate = binding.editFinishDate.text.toString().takeIf { it.isNotEmpty() }
        val finishTime = binding.editFinishTime.text.toString().takeIf { it.isNotEmpty() }
        
        val finishBy = if (finishDate != null) {
            mapOf(
                "date" to finishDate,
                "time" to (finishTime ?: "5:00 PM"),
                "timestamp" to calendar.timeInMillis
            )
        } else null
        
        binding.btnSave.isEnabled = false
        
        lifecycleScope.launch {
            try {
                if (editTask != null) {
                    // Update existing task
                    ApiService.updateTask(
                        id = editTask!!.id,
                        title = title,
                        label = label,
                        completed = null
                    )
                } else {
                    // Create new task
                    ApiService.createTask(title, label)
                }
                
                dismiss()
                onTaskSavedListener?.invoke()
                
            } catch (e: Exception) {
                binding.btnSave.isEnabled = true
            }
        }
    }
    
    // Set listener for when task is saved
    fun setOnTaskSavedListener(listener: () -> Unit) {
        onTaskSavedListener = listener
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}