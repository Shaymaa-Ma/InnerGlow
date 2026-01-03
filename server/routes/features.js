const express = require("express");
const db = require("../config/database");
const router = express.Router();
const BASE_URL = process.env.BASEURL || "http://localhost:5000";

router.get("/", (req, res) => {
  db.query("SELECT * FROM features", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
