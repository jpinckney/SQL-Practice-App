const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database(':memory:');

// Create a sample table
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)");
  db.run("INSERT INTO users (name, age) VALUES ('John Doe', 30)");
  db.run("INSERT INTO users (name, age) VALUES ('Jane Doe', 25)");
});

// API endpoint to run SQL queries
app.post('/query', (req, res) => {
  const query = req.body.query;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
