const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Home API
router.get("/home", (req, res) => {
    const BASE_URL = process.env.BASEURL || `http://localhost:5000`;
    db.query("SELECT * FROM features", (err, features) => {
        if (err) return res.status(500).json(err);
        db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err2, reviews) => {
            if (err2) return res.status(500).json(err2);
            res.json({
                heroImg: `${BASE_URL}/images/mental-hero.png`,
                homeBg: `${BASE_URL}/images/about-mentalwellness.png`,
                features,
                reviews
            });
        });
    });
});


module.exports = router;
