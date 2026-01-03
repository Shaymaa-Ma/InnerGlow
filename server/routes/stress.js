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

// Get stress history
router.get("/stress-history", authenticateOptional, (req, res) => {
  const sql = req.user
    ? "SELECT * FROM stress_history WHERE user_id = ? ORDER BY timestamp DESC"
    : "SELECT * FROM stress_history WHERE user_id IS NULL ORDER BY timestamp DESC";
  const params = req.user ? [req.user.id] : [];
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch entries", error: err });
    res.json(results);
  });
});

// Post new stress entry
router.post("/stress-history", authenticateOptional, (req, res) => {
  const { sleep, bp, resp, heart, stress_level, advice } = req.body;
  if (!sleep || !bp || !resp || !heart || !stress_level || !advice)
    return res.status(400).json({ message: "All fields are required" });

  const userId = req.user?.id || null;
  if (!userId) return res.status(201).json([{ id: Date.now(), sleep, bp, resp, heart, stress_level, advice, user_id: null, timestamp: new Date() }]);

  const sql = `INSERT INTO stress_history (sleep, bp, resp, heart, stress_level, advice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [sleep, bp, resp, heart, stress_level, advice, userId], (err) => {
    if (err) return res.status(500).json({ message: "Failed to save entry", error: err });
    db.query("SELECT * FROM stress_history WHERE user_id = ? ORDER BY timestamp DESC", [userId], (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries", error: err2 });
      res.status(201).json(rows);
    });
  });
});

// Delete stress entry
router.delete("/stress-history/:id", authenticateOptional, (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const sql = userId
    ? "DELETE FROM stress_history WHERE id = ? AND user_id = ?"
    : "DELETE FROM stress_history WHERE id = ? AND user_id IS NULL";
  const params = userId ? [id, userId] : [id];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete entry", error: err });
    const fetchSql = userId
      ? "SELECT * FROM stress_history WHERE user_id = ? ORDER BY timestamp DESC"
      : "SELECT * FROM stress_history WHERE user_id IS NULL ORDER BY timestamp DESC";
    const fetchParams = userId ? [userId] : [];
    db.query(fetchSql, fetchParams, (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries", error: err2 });
      res.json(rows);
    });
  });
});

module.exports = router;
