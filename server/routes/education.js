const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all education items
router.get("/", (req, res) => {
    const BASE_URL = process.env.BASEURL || `http://localhost:5000`;
    db.query("SELECT * FROM education_items", (err, data) => {
        if (err) return res.status(500).json(err);
        const items = data.map(item => ({
            ...item,
            img: `${BASE_URL}/images/info/${item.img}`

        }));
        res.json(items);
    });
});

module.exports = router;
