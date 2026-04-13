# Testing To-Do APIs in Postman

## Postman Setup

1. Download Postman: https://www.postman.com
2. Create new collection: "My To-Do List"
3. Add requests for each endpoint

---

## 1. CREATE Task

### Request
| Setting | Value |
|--------|-------|
| Method | `POST` |
| URL | `http://localhost:3000/tasks` |
| Headers | `Content-Type: application/json` |

### Body
```json
{
    "title": "Complete my homework",
    "label": "important"
}
```

### Expected Response (201)
```json
{
    "status": "success",
    "message": "Task created",
    "data": {
        "title": "Complete my homework",
        "label": "important",
        "createdAt": "2026-04-11T12:30:00.000Z",
        "completed": false,
        "completedAt": null,
        "_id": "507f1f77bcf86cd799439011",
        "createdAt": "2026-04-11T12:30:00.000Z",
        "updatedAt": "2026-04-11T12:30:00.000Z"
    }
}
```

---

## 2. GET All Tasks

### Request
| Setting | Value |
|--------|-------|
| Method | `GET` |
| URL | `http://localhost:3000/tasks` |

### Expected Response (200)
```json
{
    "status": "success",
    "count": 1,
    "data": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "title": "Complete my homework",
            "label": "important",
            "createdAt": "2026-04-11T12:30:00.000Z",
            "completed": false,
            "completedAt": null,
            "updatedAt": "2026-04-11T12:30:00.000Z"
        }
    ]
}
```

---

## 3. UPDATE Task (Mark Complete)

### Request
| Setting | Value |
|--------|-------|
| Method | `PUT` |
| URL | `http://localhost:3000/tasks/<COPY_ID_FROM_ABOVE>` |
| Headers | `Content-Type: application/json` |

### Body
```json
{
    "completed": true
}
```

### Expected Response (200)
```json
{
    "status": "success",
    "message": "Task updated",
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Complete my homework",
        "label": "important",
        "createdAt": "2026-04-11T12:30:00.000Z",
        "completed": true,
        "completedAt": "2026-04-11T13:00:00.000Z",
        "updatedAt": "2026-04-11T13:00:00.000Z"
    }
}
```

**Other updates:**
```json
{
    "title": "Updated title"
}
```
```json
{
    "label": "personal"
}
```

---

## 4. DELETE Task

### Request
| Setting | Value |
|--------|-------|
| Method | `DELETE` |
| URL | `http://localhost:3000/tasks/<COPY_ID_FROM_ABOVE>` |

### Expected Response (200)
```json
{
    "status": "success",
    "message": "Task deleted",
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Complete my homework",
        "label": "important",
        "createdAt": "2026-04-11T12:30:00.000Z",
        "completed": true,
        "completedAt": "2026-04-11T13:00:00.000Z"
    }
}
```

---

## Error Responses

### 400 - Missing Title
```json
{
    "status": "error",
    "message": "Title is required"
}
```

### 404 - Task Not Found
```json
{
    "status": "error",
    "message": "Task not found"
}
```

---

## Quick Test Flow

```
1. POST /tasks (create)
   ↓ copy _id
2. GET /tasks (verify)
3. PUT /tasks/:id (mark complete)
4. GET /tasks (verify change)
5. DELETE /tasks/:id (delete)
6. GET /tasks (verify gone)
```

## Postman Collection (Import)

```json
{
    "info": {
        "name": "My To-Do List",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Create Task",
            "request": {
                "method": "POST",
                "url": "http://localhost:3000/tasks",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"title\": \"Complete homework\",\n    \"label\": \"important\"\n}"
                }
            }
        },
        {
            "name": "Get All Tasks",
            "request": {
                "method": "GET",
                "url": "http://localhost:3000/tasks"
            }
        },
        {
            "name": "Update Task",
            "request": {
                "method": "PUT",
                "url": "http://localhost:3000/tasks/:id",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"completed\": true\n}"
                }
            }
        },
        {
            "name": "Delete Task",
            "request": {
                "method": "DELETE",
                "url": "http://localhost:3000/tasks/:id"
            }
        }
    ]
}
```