const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all education items
router.get("/education", (req, res) => {
  db.query("SELECT * FROM education_items", (err, data) => {
    if (err) return res.status(500).json(err);
    const items = data.map(item => ({
      ...item,
      img: `http://localhost:5000/images/info/${item.img}`
    }));
    res.json(items);
  });
});

module.exports = router;
