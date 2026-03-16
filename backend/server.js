require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// 1. Get Leaderboard Data
app.get('/api/leaderboard', (req, res) => {
  const { filter } = req.query; // 'All-Time', 'Weekly', 'Monthly'
  
  // For simplicity, we just order by XP. A real app would filter by solved_at timestamp
  db.all('SELECT id, username, xp, streak, badge FROM users ORDER BY xp DESC LIMIT 20', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Add fake trend and growth data for the UI
    const enriched = rows.map((user, index) => ({
      ...user,
      rank: index + 1,
      trend: index % 3 === 0 ? 'up' : index % 2 === 0 ? 'down' : 'same',
      growth: Math.floor(Math.random() * 500),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
    }));
    
    res.json(enriched);
  });
});

// 2. Add XP to a user
app.post('/api/users/:username/xp', (req, res) => {
  const { username } = req.params;
  const { amount } = req.body;
  
  db.run('UPDATE users SET xp = xp + ? WHERE username = ?', [amount, username], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, changes: this.changes });
  });
});

// 3. Increment Streak
app.post('/api/users/:username/streak', (req, res) => {
  const { username } = req.params;
  db.run('UPDATE users SET streak = streak + 1 WHERE username = ?', [username], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, changes: this.changes });
  });
});

// 4. Fetch DSA Question of the Day (Proxy to external API or return a fixed one)
app.get('/api/daily-question', async (req, res) => {
  try {
    // Usually would call LeetCode GraphQL here. Using ALFA LeetCode API if available
    // For reliability in this demo, returning a curated fixed question that rotates
    const dayOfYear = Math.floor((new Date() - new Date('2024-01-01')) / 1000 / 60 / 60 / 24);
    
    const questions = [
      { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], link: 'https://leetcode.com/problems/two-sum/' },
      { id: 'lru-cache', title: 'LRU Cache', difficulty: 'Medium', tags: ['Design', 'Hash Table', 'Linked List'], link: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers'], link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'], link: 'https://leetcode.com/problems/merge-intervals/' }
    ];
    
    const qotd = questions[dayOfYear % questions.length];
    
    res.json(qotd);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question of the day' });
  }
});


// 5. Get User Details
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
