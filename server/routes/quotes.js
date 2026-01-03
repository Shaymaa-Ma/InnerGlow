const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all quotes
router.get("/quotes", (req, res) => {
  db.query("SELECT * FROM quotes", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
