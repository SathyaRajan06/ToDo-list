# My To-Do List - Backend with MongoDB

A Node.js + Express backend with MongoDB database connection.

## Folder Structure

```
server/
├── .env           # Environment variables (MongoDB URI, PORT)
├── db.js          # Database connection & Task model
├── server.js     # Express server routes
├── package.json  # Dependencies
└── README.md    # This file
```

## Prerequisites

- Node.js installed
- MongoDB installed OR MongoDB Atlas account

## Quick Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB:

```bash
# Windows (in MongoDB bin folder)
mongod

# Or use MongoDB Compass
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create cluster → Database → Connect
3. Copy connection string
4. Paste in `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/mytodolist
```

### 3. Start Server

```bash
npm start
```

Expected output:
```
✓ MongoDB connected successfully
✓ Database ping successful
✓ Found 0 task(s) in database

========================================
  My To-Do List Backend Server
  with MongoDB
========================================

  Server running at: http://localhost:3000
```

## Testing the Connection

### Test Server

```bash
curl http://localhost:3000/api/test
```

Response:
```json
{"status":"success","message":"Server is working!","timestamp":"2026-04-11T17:57:54.000Z"}
```

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Complete my homework",
    "label": "important",
    "finishBy": {
      "date": "12 Apr 2026",
      "time": "6:00 PM",
      "timestamp": 1712931600000
    }
  }'
```

### Get All Tasks

```bash
curl http://localhost:3000/api/tasks
```

### Update Task (Mark Complete)

```bash
curl -X PUT http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"id": "<task-id>", "completed": true}'
```

### Delete Task

```bash
curl -X DELETE http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"id": "<task-id>"}'
```

## Environment Variables

| Variable | Description | Default |
|----------|------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mytodolist` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## Understanding the Code

### db.js - Database Setup

```javascript
const mongoose = require('mongoose');

// Define Task schema
const taskSchema = new mongoose.Schema({
    text: String,
    label: String,
    createdAt: Object,
    completedAt: Object,
    completed: Boolean,
    finishBy: Object
});

// Create model
const Task = mongoose.model('Task', taskSchema);

// Connect to database
await mongoose.connect(process.env.MONGODB_URI);
```

### Mongoose Methods

| Method | Description |
|--------|-------------|
| `Task.find()` | Get all tasks |
| `Task.create(data)` | Create new task |
| `Task.findById(id)` | Find task by ID |
| `Task.findByIdAndUpdate(id, data)` | Update task |
| `Task.findByIdAndDelete(id)` | Delete task |

## Troubleshooting

### MongoDB Connection Error

```
✗ Database connection error: getaddrinfo ENOTFOUND cluster0
```

**Fix**: Check your `.env` file MongoDB URI is correct.

### Port Already in Use

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found

```bash
rm -rf node_modules
npm install
```

## Next Steps

1. **Connect Frontend**: Update your HTML/JS fetch URLs
2. **Add Auth**: Add user registration/login
3. **Deploy Backend**: Push to Render/Railway
4. **Deploy Database**: Use MongoDB Atlas (cloud)

## API Response Format

```json
{
    "status": "success",
    "message": "Task created",
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "text": "Complete my homework",
        "label": "important",
        "createdAt": {...},
        "completedAt": null,
        "completed": false,
        "finishBy": {...},
        "createdAt": "2026-04-11T12:00:00.000Z",
        "updatedAt": "2026-04-11T12:00:00.000Z"
    }
}
```