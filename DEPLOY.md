# Deploy to GitHub Pages (Free)

## Option 1: GitHub Pages

1. Go to your GitHub repo: https://github.com/SathyaRajan06/ToDo-list
2. Settings → Pages
3. Source: Select "Deploy from a branch"
4. Branch: "main" → "/ (root)"
5. Save

Your site will be at: https://SathyaRajan06.github.io/ToDo-list

## Option 2: Netlify (Easier)

1. Go to https://netlify.com
2. Drag and drop your `index.html` folder
3. Done!

Your site will be live instantly!

## Option 3: Vercel

1. Go to https://vercel.com
2. Import your GitHub repo
3. Deploy!

## Update API URL

Before deploying, update `app.js` to use the backend:

```javascript
// For local: http://localhost:3001/tasks
// For deployed: Point to a deployed backend
```

**Note:** The frontend needs a backend API to work. The backend must also be deployed (Render.com offers free tier).