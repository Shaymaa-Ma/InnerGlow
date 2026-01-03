const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all services
router.get("/", (req, res) => {
  db.query("SELECT * FROM services ORDER BY id ASC", (err, results) => {
    if (err) {
      console.error("MySQL query error:", err); // This logs the full error
      return res.status(500).json({ 
        error: "Database error",
        details: err.message,      // <-- Add this
        code: err.code             // <-- Add this
      });
    }
    res.json(results);
  });
});



module.exports = router;
