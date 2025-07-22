// ─── Dependencies ──────────────────────────────────────────
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

// ─── App Config ────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'orderneario.db');

// ─── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── SQLite Setup ──────────────────────────────────────────
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log(`Connected to SQLite DB at ${DB_PATH}`);
  }
});

// ─── Routes ────────────────────────────────────────────────

// Welcome route
app.get('/', (req, res) => {
  res.send('✅ Orderneario API is live');
});

// Get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('[DB] Error fetching users:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// ─── Server Boot ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.put('/users/:id', (req, res) => {
  const { name, role } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE users SET name = ?, role = ? WHERE id = ?',
    [name, role, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Update error');
      } else {
        res.send({ updated: true, changes: this.changes });
      }
    }
  );
});
app.post('/users', (req, res) => {
  const { name, role } = req.body;
  db.run(
    'INSERT INTO users (name, role) VALUES (?, ?)',
    [name, role],
    function (err) {
      if (err) {
        console.error('Insert error:', err.message);
        res.status(500).send('Insert error');
      } else {
        res.status(201).json({ id: this.lastID, name, role });
      }
    }
  );
});
