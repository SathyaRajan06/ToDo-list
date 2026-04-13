# Deploy to Production

## Quick Deploy: Render.com (Free Tier)

### Option 1: Deploy Full Stack (Frontend + Backend)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Build Command: `npm install`
   - Start Command: `cd server && npm start`
   - Plan: Free

4. **Environment Variables** (optional)
   - `PORT`: 3000
   - `MONGODB_URI`: (optional) - leave empty for in-memory storage

5. **Deploy!**
   Your app will be live at `https://your-app.onrender.com`

### Option 2: Deploy Backend Only (API)

1. Same steps as above, but point to `server/` folder
2. Frontend can be deployed separately to GitHub Pages/Netlify/Vercel

## Local Development

```bash
cd server
npm install
npm start
```

Server runs at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get all tasks |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

## Update Frontend API URL

In `app.js`, update the API_URL to point to your deployed backend:

```javascript
const API_URL = 'https://your-app.onrender.com/tasks';
```