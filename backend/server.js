require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5005;

// ── CORS: only allow the deployed frontend ────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://gfg-web-nine.vercel.app',
  'http://localhost:5173', // local dev
  'http://localhost:4173', // vite preview
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Render health checks)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '50kb' }));

// ── Health check (Render pings this) ─────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 1. Leaderboard ────────────────────────────────────────────────────────────
app.get('/api/leaderboard', (_req, res) => {
  db.all('SELECT id, username, xp, streak, badge FROM users ORDER BY xp DESC LIMIT 20', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const enriched = rows.map((user, index) => ({
      ...user,
      rank: index + 1,
      trend: index % 3 === 0 ? 'up' : index % 2 === 0 ? 'down' : 'same',
      growth: Math.floor(Math.random() * 500),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    }));
    res.json(enriched);
  });
});

// ── 2. Add XP ─────────────────────────────────────────────────────────────────
app.post('/api/users/:username/xp', (req, res) => {
  const { username } = req.params;
  const { amount } = req.body;
  if (typeof amount !== 'number') return res.status(400).json({ error: 'amount must be a number' });
  db.run('UPDATE users SET xp = xp + ? WHERE username = ?', [amount, username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// ── 3. Increment Streak ───────────────────────────────────────────────────────
app.post('/api/users/:username/streak', (req, res) => {
  const { username } = req.params;
  db.run('UPDATE users SET streak = streak + 1 WHERE username = ?', [username], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// ── 4. Daily Question ─────────────────────────────────────────────────────────
app.get('/api/daily-question', (_req, res) => {
  const questions = [
    { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], link: 'https://leetcode.com/problems/two-sum/' },
    { id: 'lru-cache', title: 'LRU Cache', difficulty: 'Medium', tags: ['Design', 'Hash Table', 'Linked List'], link: 'https://leetcode.com/problems/lru-cache/' },
    { id: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers'], link: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'], link: 'https://leetcode.com/problems/merge-intervals/' },
  ];
  const dayOfYear = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 86400000);
  res.json(questions[dayOfYear % questions.length]);
});

// ── 5. Get User ───────────────────────────────────────────────────────────────
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

// ── 6. Code Execution ─────────────────────────────────────────────────────────
// Allowed languages and their safe runtime commands
const LANG_CONFIG = {
  python:     { cmd: (f) => `python3 "${f}"`,  ext: 'py'   },
  javascript: { cmd: (f) => `node "${f}"`,     ext: 'js'   },
  node:       { cmd: (f) => `node "${f}"`,     ext: 'js'   },
};

// Basic code sanitization — block obvious shell injection chars
function isSafeCode(code) {
  // Reject if code tries to import os/subprocess in dangerous ways or uses shell metacharacters
  const dangerous = [/import\s+os\s*;?\s*os\s*\.\s*system/i, /subprocess\s*\.\s*call/i, /exec\s*\(/i];
  return !dangerous.some(r => r.test(code));
}

app.post('/api/execute', (req, res) => {
  const { language, files } = req.body;
  if (!language || !files || !files[0]?.content) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const lang = language.toLowerCase();
  const config = LANG_CONFIG[lang];

  // C++ / Java — not supported on Render free tier (no compiler installed), return friendly message
  if (!config) {
    return res.json({
      run: {
        stdout: '',
        stderr: `${language} execution is not supported on the server. Use JavaScript or Python.`,
      },
    });
  }

  const code = files[0].content;

  if (!isSafeCode(code)) {
    return res.status(400).json({ error: 'Code contains disallowed patterns.' });
  }

  const reqId = crypto.randomBytes(4).toString('hex');
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filename = path.join(tempDir, `script_${reqId}.${config.ext}`);

  try {
    fs.writeFileSync(filename, code, { encoding: 'utf8' });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to write temp file' });
  }

  const command = config.cmd(filename);

  exec(command, { timeout: 8000, maxBuffer: 1024 * 256 }, (error, stdout, stderr) => {
    // Always clean up temp file
    try { if (fs.existsSync(filename)) fs.unlinkSync(filename); } catch (_) {}

    res.json({
      run: {
        stdout: stdout || '',
        stderr: stderr || (error && !stderr ? error.message : ''),
      },
    });
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
