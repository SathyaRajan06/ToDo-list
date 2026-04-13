# My To-Do List Mobile App

A native Android mobile application that connects to your existing Express backend API.

## Features

- ✅ Add, edit, delete tasks
- ✅ Mark tasks as complete
- ✅ Filter by status (All, Pending, Completed)
- ✅ Task labels (Important, Personal, Daily, Target)
- ✅ Created and finish date/time tracking
- ✅ Toast notifications
- ✅ Celebration emoji animations
- ✅ Modern Material Design 3 UI

## Project Structure

```
mobile-app/
├── android/
│   └── app/
│       └── src/main/
│           ├── java/com/todolist/app/
│           │   ├── MainActivity.kt
│           │   ├── SplashActivity.kt
│           │   ├── api/
│           │   │   └── ApiService.kt
│           │   ├── adapter/
│           │   │   └── TaskAdapter.kt
│           │   ├── models/
│           │   │   └── Task.kt
│           │   └── ui/
│           │       └── AddTaskBottomSheet.kt
│           └── res/
│               ├── layout/
│               │   ├── activity_main.xml
│               │   ├── activity_splash.xml
│               │   ├── item_task.xml
│               │   └── bottom_sheet_add_task.xml
│               ├── values/
│               │   ├── colors.xml
│               │   ├── strings.xml
│               │   └── themes.xml
│               └── drawable/
└── README.md
```

## API Connection

The mobile app connects to your backend API. Update the API URL in:

**File:** `android/app/src/main/java/com/todolist/app/api/ApiService.kt`

```kotlin
private const val BASE_URL = "http://your-backend-url.com"
```

For Android emulator to access localhost:
```kotlin
private const val BASE_URL = "http://10.0.2.2:3000"
```

## How to Build

### Prerequisites
- Android Studio ( Arctic Fox or newer)
- Java JDK 17
- Android SDK

### Build Steps

1. **Open in Android Studio**
   - Open Android Studio
   - File → Open → Select `mobile-app/android` folder

2. **Sync Project**
   - Gradle will sync automatically
   - Wait for dependencies to download

3. **Run App**
   - Connect your Android device or use emulator
   - Run → Run 'app'

Or build APK:
```
Build → Build Bundle(s) / APK(s) → Build APK
```

## Screen Overview

### Splash Screen
- App logo and name
- 2-second display time

### Home Screen
- Task list with filters
- FAB to add new task
- Pull-to-refresh support

### Task Card
- Title with strikethrough when completed
- Label chip (color-coded)
- Created/Finish/Completed dates
- Action buttons

### Add Task Bottom Sheet
- Task title input
- Label selection chips
- Optional finish date/time pickers

## Connecting to Your Backend

The app is configured to work with your Express backend. Make sure:

1. Your backend is running
2. Update BASE_URL in ApiService.kt
3. CORS is enabled on backend

## Tech Stack

- **Language:** Kotlin
- **UI:** Material Design 3
- **Architecture:** MVVM (simplified)
- **Async:** Kotlin Coroutines
- **Networking:** OkHttp
- **Backend:** Your Express API

## License

ISC License - Feel free to use and modify!