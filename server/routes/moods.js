const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all moods
router.get("/moods", (req, res) => {
  db.query("SELECT * FROM moods", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
