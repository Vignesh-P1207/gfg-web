<div align="center">

<img src="_vite_scaffold/public/images/gfg-logo.png" alt="GFG X RIT Logo" width="120" />

# GFG Student Chapter — RIT

### Official Web Platform of the GeeksforGeeks Student Chapter at RIT

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gfg--web--rho.vercel.app-brightgreen?style=for-the-badge&logo=vercel&logoColor=white)](https://gfg-web-rho.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

> Best experienced on **desktop / PC** for full visual fidelity.

</div>

---

## Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| Frontend Framework | ![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB) |
| Build Tool | ![Vite](https://img.shields.io/badge/Vite%207-646CFF?style=flat-square&logo=vite&logoColor=white) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| Animations | ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) |
| Routing | ![React Router](https://img.shields.io/badge/React%20Router%20v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| Code Editor | ![CodeMirror](https://img.shields.io/badge/CodeMirror%206-D30707?style=flat-square&logo=codemirror&logoColor=white) |
| Backend Runtime | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) |
| Backend Framework | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |
| Database | ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) |
| Deployment | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |

</div>

---

## Features

- **Home Page** — Animated landing with video overlay, scroll-driven Framer Motion effects, 3D-tilted coordinator gallery, and a mission modal.
- **Interactive Code Runner** — In-browser IDE powered by CodeMirror with support for JavaScript, Python, C++, and Java. JS runs client-side; other languages execute via the backend `/api/execute` endpoint.
- **DSA Racer Game** — A browser-based driving mini-game where players dodge wrong answers to DSA questions. Includes collision detection, score tracking, and Web Audio API sound effects.
- **Roadmaps** — Tabbed, animated learning timelines for DSA, Web Dev, AI/ML, Data Science, Cyber Security, and more.
- **Courses Center** — Curated course cards with curriculum details, difficulty ratings, and links to GFG, LeetCode, HackerRank, freeCodeCamp, and Coursera.
- **Leaderboard** — Top 20 users ranked by XP, enriched with DiceBear avatars and trend indicators.
- **Auth & Protected Routes** — Community, Leaderboard, and Settings pages are gated behind `AuthContext` with automatic redirect to `/auth`.

---

## Project Structure

```
gfg-web/
├── _vite_scaffold/          # React frontend (Vite)
│   ├── public/              # Static assets (images, icons, video)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # AuthContext
│       ├── pages/           # Route-level page components
│       ├── App.jsx
│       └── main.jsx
└── backend/                 # Node.js + Express API
    ├── server.js            # API routes & code execution engine
    ├── database.js          # SQLite setup & schema
    └── community.db         # SQLite database file
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Git

### 1. Clone the repo

```bash
git clone <your-repository-url>
cd gfg-web
```

### 2. Run the Frontend

```bash
cd _vite_scaffold
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run the Backend (optional — needed for Python/C++/Java execution)

```bash
cd backend
npm install
npm run dev
```

The API will be available at [http://localhost:3000](http://localhost:3000).

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leaderboard` | Top 20 users by XP |
| `GET` | `/api/daily-question` | Rotating DSA question of the day |
| `GET` | `/api/users/:username` | Fetch user profile |
| `POST` | `/api/users/:username/xp` | Award XP to a user |
| `POST` | `/api/users/:username/streak` | Update user streak |
| `POST` | `/api/execute` | Remote code execution (Python, C++, Java) |

---

<div align="center">

Made with ❤️ by the GFG Student Chapter — RIT

</div>
