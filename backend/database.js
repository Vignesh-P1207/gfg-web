const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'community.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      badge TEXT
    )`, (err) => {
      if (!err) {
        // Insert dummy users if empty for the leaderboard
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (row.count === 0) {
            const stmt = db.prepare('INSERT INTO users (username, xp, streak, badge) VALUES (?, ?, ?, ?)');
            stmt.run('aryan_t', 12450, 42, 'Knight');
            stmt.run('priya_codes', 11200, 15, 'Master');
            stmt.run('dev_ninja', 9800, 7, 'Pupil');
            stmt.run('script_kiddie', 8500, 3, 'Specialist');
            stmt.run('algo_expert', 7200, 1, 'Newbie');
            stmt.finalize();
          }
        });
      }
    });

    // Create solved problems history table
    db.run(`CREATE TABLE IF NOT EXISTS solved_problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      problem_name TEXT,
      difficulty TEXT,
      solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (!err) {
        db.get('SELECT COUNT(*) as count FROM solved_problems', (err, row) => {
          if (row.count === 0) {
            const stmt = db.prepare('INSERT INTO solved_problems (user_id, problem_name, difficulty, solved_at) VALUES (?, ?, ?, datetime("now", ?))');
            
            // Generate some recent activity for the feed
            stmt.run(1, 'Trapping Rain Water', 'Hard', '-10 minutes');
            stmt.run(3, 'Two Sum', 'Easy', '-1 hour');
            stmt.run(2, 'LRU Cache', 'Medium', '-2 hours');
            stmt.run(4, 'Merge Intervals', 'Medium', '-1 day');
            stmt.finalize();
          }
        });
      }
    });
  }
});

module.exports = db;
