const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Get all messages
router.get("/", (req, res) => {
  db.query("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Post new message
router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields are required" });

  db.query(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to save message" });
      res.status(201).json({ id: result.insertId, name, email, message });
    }
  );
});

module.exports = router;
