const express = require("express");
const db = require("../config/database");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MoodTracker-InnerGlow";

// Optional auth middleware
const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) { req.user = null; return next(); }
  const token = authHeader.split(" ")[1];
  if (!token) { req.user = null; return next(); }
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } 
  catch { req.user = null; next(); }
};

// Get all journal entries
router.get("/journal-entries", authenticateOptional, (req, res) => {
  const sql = req.user
    ? "SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC"
    : "SELECT * FROM mood_entries WHERE user_id IS NULL ORDER BY datetime ASC";
  const params = req.user ? [req.user.id] : [];
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch entries" });
    res.json(results);
  });
});

// Create new journal entry
router.post("/journal-entries", authenticateOptional, (req, res) => {
  const { mood, text } = req.body;
  if (!mood) return res.status(400).json({ message: "Mood is required" });
  if (!req.user) return res.status(201).json([{ mood, text, id: Date.now(), user_id: null }]);

  const userId = req.user.id;
  db.query("INSERT INTO mood_entries (mood, text, user_id) VALUES (?, ?, ?)", [mood, text || null, userId], (err) => {
    if (err) return res.status(500).json({ message: "Failed to save entry" });
    db.query("SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC", [userId], (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
      res.status(201).json(rows);
    });
  });
});

// Update journal entry
router.put("/journal-entries/:id", authenticateOptional, (req, res) => {
  const { id } = req.params;
  const { mood, text } = req.body;
  const userId = req.user?.id || null;
  const sql = `UPDATE mood_entries SET mood=?, text=? WHERE id=? AND ${userId ? "user_id=?" : "user_id IS NULL"}`;
  const params = userId ? [mood, text || null, id, userId] : [mood, text || null, id];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Failed to update entry" });
    const fetchSql = userId
      ? "SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC"
      : "SELECT * FROM mood_entries WHERE user_id IS NULL ORDER BY datetime ASC";
    const fetchParams = userId ? [userId] : [];
    db.query(fetchSql, fetchParams, (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
      res.json(rows);
    });
  });
});

// Delete journal entry
router.delete("/journal-entries/:id", authenticateOptional, (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const sql = userId
    ? "DELETE FROM mood_entries WHERE id = ? AND user_id = ?"
    : "DELETE FROM mood_entries WHERE id = ? AND user_id IS NULL";
  const params = userId ? [id, userId] : [id];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete entry" });
    const fetchSql = userId
      ? "SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC"
      : "SELECT * FROM mood_entries WHERE user_id IS NULL ORDER BY datetime ASC";
    const fetchParams = userId ? [userId] : [];
    db.query(fetchSql, fetchParams, (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
      res.json(rows);
    });
  });
});

module.exports = router;
