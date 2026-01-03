const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Home API
router.get("/", (req, res) => {
  res.json({
    heroImg: "mental-hero.png",
    homeBg: "about-mentalwellness.png"
  });
});


module.exports = router;
