# FearZero — AI-Powered Placement Preparation Platform

FearZero is a full-stack web application that helps students and job seekers prepare for campus placements and job interviews using AI-powered tools — resume analysis, mock HR interviews, group discussion simulations, and progress analytics, all in one platform.

## Features

- **Authentication** — secure JWT-based signup/login with persistent sessions and protected routes
- **Dashboard** — centralized overview of preparation activity and quick actions
- **Resume Upload** — drag-and-drop resume upload (PDF/DOC/DOCX) with replace/delete support
- **AI Resume Analysis** — automated resume scoring, ATS compatibility check, strengths/weaknesses, missing skills, and improvement suggestions
- **AI HR Interview** — interactive chat-based mock interview that adapts questions to your answers, with a detailed scored summary at the end
- **Group Discussion Simulator** — practice GDs with 3 AI participants (each with distinct personalities) and an AI moderator, across selectable difficulty levels
- **Progress & Analytics** — placement readiness score, score history charts, skill radar, weekly activity tracking, and personalized recommendations

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts (data visualization)

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- Multer (file uploads)
- Groq API (Llama 3.3) for AI features

**Infrastructure**
- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas

## Architecture Overview
The backend follows a layered architecture: **routes → controllers → services → models**, keeping AI provider logic (Groq) fully isolated in the `services/` layer so it can be swapped without touching controllers.

## Installation Guide

### Prerequisites
- Node.js 22+
- A MongoDB Atlas account (free tier works)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Clone the repository
```bash
git clone https://github.com/kusum-01/fearzero.git
cd fearzero
```

### Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
### Frontend setup
```bash
cd ../client
npm install
```

Create `client/.env`:
## Local Development

Run both servers in separate terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev
```

```bash
# Terminal 2 — frontend
cd client
npm run dev
```

Visit `http://localhost:5173`.

## Deployment Guide

### Backend (Render)
1. Create a new Web Service on Render, connect this repository
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the environment variables listed above (with `NODE_ENV=production` and `CLIENT_URL` set to your deployed frontend URL)

### Frontend (Vercel)
1. Import this repository into Vercel
2. Root directory: `client`
3. Add environment variable `VITE_API_URL` pointing to your deployed backend URL + `/api`
4. Deploy

### Database (MongoDB Atlas)
- Ensure Network Access allows connections from your backend host (this project uses `0.0.0.0/0` for simpler free-tier hosting — acceptable for a demo/portfolio project)
- Use a dedicated database user with least-privilege access where possible

## Future Enhancements

- Voice-based HR interviews (text-to-speech questions, speech-to-text answers)
- Multiplayer Group Discussions (multiple real users in one session)
- Practice test / MCQ module
- Resume builder with AI-generated content suggestions
- Email notifications for progress milestones
- Admin dashboard for usage analytics

## License

This project is for educational/portfolio purposes.
