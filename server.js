const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const db = new sqlite3.Database('./orderneario.db');

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('DB error');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server live at http://localhost:${port}`);
});
