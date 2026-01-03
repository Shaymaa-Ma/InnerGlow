const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all diet items
router.get("/diet", (req, res) => {
  const heroImage = "http://localhost:5000/images/diet/heroImage.png";
  db.query("SELECT id, name, description, img FROM diet_items ORDER BY id ASC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const items = results.map(item => ({
      ...item,
      img: `http://localhost:5000/images/diet/${item.img}`
    }));
    res.json({ heroImage, items });
  });
});

module.exports = router;
