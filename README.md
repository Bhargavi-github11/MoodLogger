# 🧠 Mood Logger App

A complete, polished MERN stack application that allows users to log their daily moods, view history, and keep track of their mood streaks and weekly analytics. Built exactly to your specifications with Vanilla CSS and clean logic.

## 🚀 How to Deploy

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (`mongodb+srv://...`).
3. Replace the `MONGO_URI` in `backend/.env` with your string.

### 2. Backend (Render.com or Railway)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and create a new **Web Service**.
3. Point it to your repo and set the `Root Directory` to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).

### 3. Frontend (Vercel or Netlify)
1. Go to [Vercel](https://vercel.com) and import the repository.
2. Set the **Framework Preset** to Vite.
3. Set the **Root Directory** to `frontend`.
4. Click Deploy. Vercel automatically runs `npm run build`.
5. *(Important: Before deploying, change `http://localhost:5000` in `src/context/AuthContext.jsx` and `src/context/MoodContext.jsx` to your live backend URL!)*

## 🧪 Local Testing
1. Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/moodlogger`) or populate `backend/.env` with Atlas URI.
2. Start backend: `cd backend && node server.js` (Server runs on port 5000)
3. Start frontend: `cd frontend && npm run dev` (Vite runs on port 5173)

### 🎉 Enjoy tracking your moods!
