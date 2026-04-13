# CRUD APIs Created

## Folder Structure

```
server/
├── server.js               # Main entry point
├── models/
│   └── Task.js            # Mongoose model
├── controllers/
│   └── taskController.js  # Business logic
└── routes/
    └── taskRoutes.js     # API endpoints
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## How It Works

```
Request → Routes → Controller → Model → Database
```

## Usage

```bash
# Get all tasks
GET http://localhost:3000/tasks

# Create task
POST http://localhost:3000/tasks
Body: { "title": "My task", "label": "important" }

# Update task
PUT http://localhost:3000/tasks/507f1f77bcf86cd799439011
Body: { "completed": true }

# Delete task
DELETE http://localhost:3000/tasks/507f1f77bcf86cd799439011
```

## Test with cURL

```bash
# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete homework", "label": "important"}'

# Get tasks
curl http://localhost:3000/tasks

# Update task
curl -X PUT http://localhost:3000/tasks/<ID> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete task
curl -X DELETE http://localhost:3000/tasks/<ID>
```