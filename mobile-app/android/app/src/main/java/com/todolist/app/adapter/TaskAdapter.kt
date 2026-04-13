package com.todolist.app.adapter

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.graphics.Paint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.todolist.app.R
import com.todolist.app.databinding.ItemTaskBinding
import com.todolist.app.models.Task

/**
 * Task Adapter
 * 
 * Handles displaying task items in RecyclerView.
 * Provides click listeners for complete, edit, and delete actions.
 */

class TaskAdapter(
    private val onCompleteClick: (Task) -> Unit,
    private val onEditClick: (Task) -> Unit,
    private val onDeleteClick: (Task) -> Unit
) : ListAdapter<Task, TaskAdapter.TaskViewHolder>(TaskDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val binding = ItemTaskBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return TaskViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class TaskViewHolder(
        private val binding: ItemTaskBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(task: Task) {
            // Set task title
            binding.textTaskTitle.text = task.title
            
            // Handle completed state
            if (task.completed) {
                binding.textTaskTitle.paintFlags = 
                    binding.textTaskTitle.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
                binding.textTaskTitle.alpha = 0.6f
                binding.checkboxComplete.isChecked = true
                binding.cardTask.setCardBackgroundColor(
                    binding.root.context.getColor(R.color.task_completed_background)
                )
                binding.emojiStatus.text = "🎉"
            } else {
                binding.textTaskTitle.paintFlags = 
                    binding.textTaskTitle.paintFlags and Paint.STRIKE_THRU_TEXT_FLAG.inv()
                binding.textTaskTitle.alpha = 1.0f
                binding.checkboxComplete.isChecked = false
                binding.cardTask.setCardBackgroundColor(
                    binding.root.context.getColor(R.color.card_background)
                )
                binding.emojiStatus.text = getPendingEmoji(task.id)
            }
            
            // Set label chip
            when (task.label) {
                "important" -> {
                    binding.chipLabel.visibility = View.VISIBLE
                    binding.chipLabel.text = "Important"
                    binding.chipLabel.setChipBackgroundColorResource(R.color.label_important)
                }
                "personal" -> {
                    binding.chipLabel.visibility = View.VISIBLE
                    binding.chipLabel.text = "Personal"
                    binding.chipLabel.setChipBackgroundColorResource(R.color.label_personal)
                }
                "daily" -> {
                    binding.chipLabel.visibility = View.VISIBLE
                    binding.chipLabel.text = "Daily"
                    binding.chipLabel.setChipBackgroundColorResource(R.color.label_daily)
                }
                "target" -> {
                    binding.chipLabel.visibility = View.VISIBLE
                    binding.chipLabel.text = "Target"
                    binding.chipLabel.setChipBackgroundColorResource(R.color.label_target)
                }
                else -> {
                    binding.chipLabel.visibility = View.GONE
                }
            }
            
            // Created time
            binding.textCreatedDate.text = task.createdAt?.let {
                "Created: ${it.date}${if (it.time.isNotEmpty()) " at ${it.time}" else ""}"
            } ?: ""
            
            // Finish by time
            if (task.finishBy != null && !task.completed) {
                binding.textFinishDate.visibility = View.VISIBLE
                binding.textFinishDate.text = "Finish by: ${task.finishBy.date} at ${task.finishBy.time}"
            } else {
                binding.textFinishDate.visibility = View.GONE
            }
            
            // Completed time
            if (task.completed && task.completedAt != null) {
                binding.textCompletedDate.visibility = View.VISIBLE
                binding.textCompletedDate.text = "Completed: ${task.completedAt.date} at ${task.completedAt.time}"
            } else {
                binding.textCompletedDate.visibility = View.GONE
            }
            
            // Click listeners
            binding.checkboxComplete.setOnClickListener {
                onCompleteClick(task)
                if (!task.completed) {
                    playCelebrationAnimation()
                }
            }
            
            binding.btnComplete.setOnClickListener {
                onCompleteClick(task)
                if (!task.completed) {
                    playCelebrationAnimation()
                }
            }
            
            binding.btnEdit.setOnClickListener {
                onEditClick(task)
            }
            
            binding.btnDelete.setOnClickListener {
                onDeleteClick(task)
            }
        }
        
        private fun playCelebrationAnimation() {
            binding.emojiStatus.visibility = View.VISIBLE
            
            val scaleX = ObjectAnimator.ofFloat(binding.emojiStatus, View.SCALE_X, 0f, 1.5f, 1f)
            val scaleY = ObjectAnimator.ofFloat(binding.emojiStatus, View.SCALE_Y, 0f, 1.5f, 1f)
            
            AnimatorSet().apply {
                playTogether(scaleX, scaleY)
                duration = 500
                interpolator = OvershootInterpolator()
                start()
            }
            
            // Hide after animation
            binding.emojiStatus.postDelayed({
                binding.emojiStatus.visibility = View.GONE
            }, 1500)
        }
    }
    
    // Generate consistent emoji based on task ID
    private fun getPendingEmoji(id: String): String {
        val emojis = listOf("😔", "⏳", "😟")
        val index = id.hashCode().let { if (it < 0) -it else it } % emojis.size
        return emojis[index]
    }
    
    class TaskDiffCallback : DiffUtil.ItemCallback<Task>() {
        override fun areItemsTheSame(oldItem: Task, newItem: Task): Boolean {
            return oldItem.id == newItem.id
        }
        
        override fun areContentsTheSame(oldItem: Task, newItem: Task): Boolean {
            return oldItem == newItem
        }
    }
}