const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Add review
router.post("/reviews", (req, res) => {
  const { name, text, rating, img } = req.body;
  if (!name || !text || !rating) return res.status(400).json({ error: "Missing fields" });

  db.query("INSERT INTO reviews (name, text, rating, img, verified) VALUES (?, ?, ?, ?, ?)",
    [name, text, rating, img || "default_avatar.png", 0],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    });
});

module.exports = router;
