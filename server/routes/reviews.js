const express = require("express");
const db = require("../config/database");
const router = express.Router();

const BASE_URL = process.env.BASEURL || "http://localhost:5000";

// GET all reviews
router.get("/", (req, res) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    const formatted = results.map(r => ({
      id: r.id,
      name: r.name,
      text: r.text,
      rating: parseInt(r.rating),
      created_at: r.created_at,
      verified: r.verified || false,
      img: r.img ? `${BASE_URL}/images/${r.img}` : `${BASE_URL}/images/default_avatar.png`
    }));

    res.json(formatted);
  });
});

// POST new review
router.post("/", (req, res) => {
  const { name, text, rating } = req.body;

  if (!name || !text || !rating)
    return res.status(400).json({ message: "Name, review text, and rating are required" });

  const intRating = parseInt(rating);
  const img = "default_avatar.png";
  const created_at = new Date();

  const query = "INSERT INTO reviews (name, text, rating, img, created_at) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, text, intRating, img, created_at], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to add review" });

    const reviewToDisplay = {
      id: result.insertId,
      name,
      text,
      rating: intRating,
      img: `${BASE_URL}/images/${img}`,
      created_at,
      verified: false
    };

    // Only show good reviews on front-end
    res.status(201).json({ review: reviewToDisplay, displayOnScreen: intRating >= 3 });
  });
});

module.exports = router;
