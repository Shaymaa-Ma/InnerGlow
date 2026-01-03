const express = require("express");
const db = require("../config/database");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWTSECRET || "MoodTracker-InnerGlow";

// Optional auth middleware
const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) { req.user = null; return next(); }
  const token = authHeader.split(" ")[1];
  if (!token) { req.user = null; return next(); }
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { req.user = null; next(); }
};

// GET all meditation videos
router.get("/meditation-videos", (req, res) => {
  db.query("SELECT * FROM meditation_videos ORDER BY id ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // No need to transform if DB already has embed URLs
    res.json(results);
  });
});


// GET meditation history
router.get("/meditation-history", authenticateOptional, (req, res) => {
  const sql = req.user
    ? "SELECT * FROM meditation_history WHERE user_id = ? ORDER BY timestamp DESC"
    : "SELECT * FROM meditation_history WHERE user_id IS NULL ORDER BY timestamp DESC";
  const params = req.user ? [req.user.id] : [];
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
});

// POST new meditation session
router.post("/meditation-history", authenticateOptional, (req, res) => {
  const { duration } = req.body;
  if (!duration) return res.status(400).json({ message: "Duration required" });

  const userId = req.user?.id || null;
  const timestamp = new Date();
  db.query(
    "INSERT INTO meditation_history (duration, timestamp, user_id) VALUES (?, ?, ?)",
    [duration, timestamp, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ id: result.insertId, duration, timestamp, user_id: userId });
    }
  );
});

// DELETE meditation history
router.delete("/meditation-history/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM meditation_history WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;
