const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Home API
router.get("/home", (req, res) => {
  db.query("SELECT * FROM features", (err, features) => {
    if (err) return res.status(500).json(err);
    db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err2, reviews) => {
      if (err2) return res.status(500).json(err2);
      res.json({ heroImg: "mental-hero.png", homeBg: "about-mentalwellness.png", features, reviews });
    });
  });
});

// About API
router.get("/about", (req, res) => {
  res.json({ aboutBg: "about-mentalwellness.png" });
});

module.exports = router;
