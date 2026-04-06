# Real-Time Live Polling Web Application

Production-ready full-stack polling app with React, Express, PostgreSQL, Socket.IO, TailwindCSS, and Recharts.

## Tech Stack

- Frontend: React + Vite + TailwindCSS + Axios + Recharts + Socket.IO client
- Backend: Node.js + Express + PostgreSQL + Socket.IO
- Security: Helmet, CORS, endpoint rate limiting, validated payloads

## Project Structure

```text
.
├── backend
│   ├── db
│   │   └── schema.sql
│   ├── src
│   │   ├── config
│   │   ├── middlewares
│   │   ├── modules
│   │   │   ├── polls
│   │   │   ├── results
│   │   │   └── votes
│   │   ├── utils
│   │   ├── app.js
│   │   ├── server.js
│   │   └── socket.js
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Core Features Implemented

- Admin poll management (create, update, delete, activate/deactivate)
- Voting with duplicate prevention (poll + IP unique, poll + session token unique)
- Real-time results broadcast with Socket.IO
- Automatic 5-second polling fallback when websocket is unavailable
- Live bar and pie charts for results
- REST APIs for polls, voting, and results
- Backend centralized error handling and frontend user-friendly error messages
- Poll window validation (only active + within start/end time can be voted)
- Pagination support on polls listing

## API Endpoints

### Polls

- `GET /api/polls?page=1&pageSize=20`
- `GET /api/polls/:id`
- `POST /api/polls`
- `PUT /api/polls/:id`
- `DELETE /api/polls/:id`

### Voting

- `POST /api/vote`

### Results

- `GET /api/polls/:id/results`

## Database Setup

1. Create PostgreSQL database:
   - `live_polling`
2. Run schema:
   - Execute `backend/db/schema.sql` in your database tool.
3. Set **`DATABASE_URL`** in `backend/.env` to match your real PostgreSQL user and password. The default in `.env.example` (`postgres` / `postgres`) only works if your server is configured that way. Example:

   `postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/live_polling`

   If you see **“password authentication failed for user postgres”**, your password in `DATABASE_URL` does not match the database—edit `backend/.env` and restart the backend.

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and fill:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `FRONTEND_URL`

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` and fill:

- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`

## Run Locally

From project root:

1. Install dependencies:
   - `npm run install:all`
2. Start backend:
   - `npm run dev:backend`
3. Start frontend:
   - `npm run dev:frontend`
4. Open:
   - `http://localhost:5173`

## Security Notes

- SQL injection prevented by parameterized queries.
- `helmet` enabled globally.
- CORS restricted to configured frontend URL.
- Vote endpoint rate limited.
- Request body validated with Zod.

## Deployment Notes

- Configure production environment variables.
- Use managed PostgreSQL.
- Put backend behind reverse proxy and set trusted proxy for accurate IP handling.
- Build frontend with `npm --prefix frontend run build` and serve static assets through CDN/server.
