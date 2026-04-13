package com.todolist.app.api

import com.todolist.app.models.Task
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * API Service
 * 
 * Handles all communication with the Express backend API.
 * 
 * API Endpoints:
 * - GET    /tasks     - Get all tasks
 * - POST   /tasks    - Create new task
 * - PUT    /tasks/:id - Update task
 * - DELETE /tasks/:id - Delete task
 * 
 * Base URL: Change this to your deployed backend URL when deploying
 */

object ApiService {
    
    // TODO: Change this to your deployed backend URL
    // For local testing: "http://10.0.2.2:3000" (Android emulator accesses localhost)
    private const val BASE_URL = "http://10.0.2.2:3000"
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val JSON = "application/json; charset=utf-8".toMediaType()
    
    /**
     * GET - Fetch all tasks from backend
     */
    suspend fun getTasks(): List<Task> {
        return try {
            val request = Request.Builder()
                .url("$BASE_URL/tasks")
                .get()
                .build()
            
            val response = client.newCall(request).execute()
            
            if (response.isSuccessful) {
                val json = response.body?.string() ?: return emptyList()
                val jsonObject = JSONObject(json)
                
                if (jsonObject.getString("status") == "success") {
                    val tasksArray = jsonObject.getJSONArray("data")
                    parseTasksArray(tasksArray)
                } else {
                    emptyList()
                }
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }
    
    /**
     * POST - Create new task
     */
    suspend fun createTask(title: String, label: String?): Task? {
        return try {
            val json = JSONObject().apply {
                put("title", title)
                put("label", label)
            }
            
            val requestBody = json.toString().toRequestBody(JSON)
            
            val request = Request.Builder()
                .url("$BASE_URL/tasks")
                .post(requestBody)
                .build()
            
            val response = client.newCall(request).execute()
            
            if (response.isSuccessful) {
                val responseBody = response.body?.string() ?: return null
                val jsonObject = JSONObject(responseBody)
                
                if (jsonObject.getString("status") == "success") {
                    val taskObject = jsonObject.getJSONObject("data")
                    parseTask(taskObject)
                } else null
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    /**
     * PUT - Update existing task
     */
    suspend fun updateTask(id: String, title: String?, label: String?, completed: Boolean?): Task? {
        return try {
            val json = JSONObject().apply {
                title?.let { put("title", it) }
                label?.let { put("label", it) }
                completed?.let { put("completed", it) }
            }
            
            val requestBody = json.toString().toRequestBody(JSON)
            
            val request = Request.Builder()
                .url("$BASE_URL/tasks/$id")
                .put(requestBody)
                .build()
            
            val response = client.newCall(request).execute()
            
            if (response.isSuccessful) {
                val responseBody = response.body?.string() ?: return null
                val jsonObject = JSONObject(responseBody)
                
                if (jsonObject.getString("status") == "success") {
                    val taskObject = jsonObject.getJSONObject("data")
                    parseTask(taskObject)
                } else null
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    /**
     * DELETE - Remove task
     */
    suspend fun deleteTask(id: String): Boolean {
        return try {
            val request = Request.Builder()
                .url("$BASE_URL/tasks/$id")
                .delete()
                .build()
            
            val response = client.newCall(request).execute()
            
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    /**
     * Parse JSON array to List<Task>
     */
    private fun parseTasksArray(array: JSONArray): List<Task> {
        val tasks = mutableListOf<Task>()
        
        for (i in 0 until array.length()) {
            val taskObject = array.getJSONObject(i)
            tasks.add(parseTask(taskObject))
        }
        
        return tasks
    }
    
    /**
     * Parse JSONObject to Task
     */
    private fun parseTask(json: JSONObject): Task {
        return Task(
            id = json.optString("_id", ""),
            title = json.optString("title", ""),
            label = json.optString("label", null).takeIf { it != "null" && it.isNotEmpty() },
            createdAt = parseTimestamp(json.optJSONObject("createdAt")),
            finishBy = parseTimestamp(json.optJSONObject("finishBy")),
            completed = json.optBoolean("completed", false),
            completedAt = parseTimestamp(json.optJSONObject("completedAt"))
        )
    }
    
    /**
     * Parse JSONObject to TaskTimestamp
     */
    private fun parseTimestamp(json: JSONObject?): TaskTimestamp? {
        if (json == null || json.length() == 0) return null
        
        return TaskTimestamp(
            date = json.optString("date", ""),
            time = json.optString("time", ""),
            timestamp = json.optLong("timestamp", 0)
        )
    }
}