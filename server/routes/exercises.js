const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all exercises with steps and advantages in one query
router.get("/", (req, res) => {
  const sql = `
    SELECT e.id, e.name, e.img,
           GROUP_CONCAT(DISTINCT s.step ORDER BY s.id SEPARATOR '||') AS steps,
           GROUP_CONCAT(DISTINCT a.advantage ORDER BY a.id SEPARATOR '||') AS advantages
    FROM exercises e
    LEFT JOIN exercise_steps s ON s.exercise_id = e.id
    LEFT JOIN exercise_advantages a ON a.exercise_id = e.id
    GROUP BY e.id
    ORDER BY e.id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Convert concatenated strings back to arrays
    const exercises = results.map(row => ({
      id: row.id,
      name: row.name,
      img: row.img,
      steps: row.steps ? row.steps.split("||") : [],
      advantages: row.advantages ? row.advantages.split("||") : []
    }));

    res.json(exercises);
  });
});

module.exports = router;
