package com.todolist.app

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

/**
 * Splash Activity
 * 
 * Shows splash screen with app logo for 2 seconds.
 * Then navigates to MainActivity.
 */

@SuppressLint("CustomSplashScreen")
class SplashActivity : AppCompatActivity() {
    
    private val splashDuration = 2000L // 2 seconds
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)
        
        // Navigate to MainActivity after splash duration
        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            
            // Add transition animation
            overridePendingTransition(
                android.R.anim.fade_in,
                android.R.anim.fade_out
            )
        }, splashDuration)
    }
}