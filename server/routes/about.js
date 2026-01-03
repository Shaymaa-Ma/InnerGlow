// routes/about.js
const express = require("express");
const router = express.Router();

// Return About page data
router.get("/", (req, res) => {
  res.json({ aboutBg: "about-mentalwellness.png" });
});

module.exports = router;
