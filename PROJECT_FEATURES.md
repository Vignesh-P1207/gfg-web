# GFG X RIT - Web Application Overview & Features

This document provides a comprehensive analysis of the GFG X RIT website, detailing its architecture, tech stack, and core features based on the `_vite_scaffold` (frontend) and `backend` directories.

## 🏗 Architecture & Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 & custom vanilla CSS for complex components
- **Animations:** Framer Motion (for page transitions, scroll animations, micro-interactions)
- **Routing:** React Router DOM v7
- **Code Editor:** CodeMirror (for the embedded coding environment)

### Backend
- **Environment:** Node.js + Express
- **Database:** SQLite3 (`community.db`)
- **Execution Engine:** `child_process.exec` used to securely run compiled code scripts.

---

## 🌟 Frontend Features & Pages

### 1. Home Page (`/`)
An interactive landing page designed to impress and engage users.
- Includes a smooth video overlay upon first load.
- Features **Framer Motion scroll animations**, such as a curved scrolling text path ("1 problem a day...") and an image scattering effect.
- An interactive **"Our Mission" modal**.
- A beautifully styled **Club Coordinators gallery** with 3D-tilted hover effects.

### 2. Interactive Code Runner (`/practice/:id`)
A fully-fledged problem-solving environment embedded in the browser.
- Uses **CodeMirror** for syntax highlighting, auto-completion, and bracket matching.
- **Multi-language Support:** JavaScript, Python, C++, and Java.
- **Execution System:** JS runs securely in the browser via `new Function()`, capturing `console.log` statements. Other languages are sent to the backend's `/api/execute` endpoint.
- **Test Case Validation:** Automatically compares code output against multiple problem test cases and shows pass/fail visual badges.

### 3. DSA Racer Game (`/game`)
An innovative, browser-based driving mini-game built for educational purposes.
- Users steer a CSS-animated car left or right using arrow keys or tap controls.
- The player must dodge incorrect answers to DSA questions (e.g., "Time Complexity of Binary Search") drifting down the screen as obstacles.
- Includes collision detection, a score counter, increasing speed mechanics, and a crash audio sound effect generated via the Web Audio API.

### 4. Roadmaps (`/workshops`)
Interactive learning paths for different domains (DSA, Web Dev, AI/ML, Data Science, Cyber Security, etc.).
- Users can switch tabs to view a vertical timeline of topics mapped out step-by-step.
- Each milestone expands with an engaging animation and practical descriptions.

### 5. Courses Center (`/courses`)
A curated directory of recommended learning pathways.
- Categorized by domains (DSA, Web Dev, etc.).
- Displays highly detailed cards containing course curriculums, difficulty, and duration.
- Embedded links to prominent external learning platforms like GeeksforGeeks, LeetCode, HackerRank, freeCodeCamp, and Coursera.

### 6. Authentication & Protected Routes
- Routes like **Community (`/community`), Leaderboard (`/leaderboard`), and Settings (`/settings`)** are protected through an `AuthContext` validation flow, automatically redirecting unauthenticated users to `/auth`.

---

## ⚙️ Backend Features & APIs

The Express.js backend primarily serves data for the community features and acts as a remote code execution engine.

### Database (`database.js`)
Uses an integrated SQLite setup.
- **`users` Table:** Tracks `username`, `xp`, `streak`, and `badge`.
- **`solved_problems` Table:** Logs timestamped problem completions with difficulty tracking.

### API Endpoints (`server.js`)
1. **`GET /api/leaderboard`**: Retrieves the top 20 users ordered by accumulated XP, enriching the response with generated trend indicators, dynamic growth metrics, and DiceBear SVG avatars.
2. **`GET /api/daily-question`**: Rotates through a curated list of DSA problems to present a "Question of the Day".
3. **`POST /api/users/:username/xp` & `/streak`**: Mutation endpoints to reward active users for completing actions.
4. **`GET /api/users/:username`**: Returns specific user profile details.
5. **`POST /api/execute`**: The remote compilation endpoint.
   - Accepts language, version, and source files.
   - Generates a random ID, writes the code to the `/temp` directory, executes it in a spawned child process natively (`node`, `python`, `java`), and returns `stdout` and `stderr`.

---

## 🎯 Summary
The codebase reveals a highly sophisticated student community platform. It seamlessly blends elegant UI design with practical, built-in tools like a functional code execution environment, educational mini-games, and detailed learning roadmaps.
