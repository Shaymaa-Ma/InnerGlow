const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Get all exercises with steps and advantages
router.get("/exercises", (req, res) => {
  db.query("SELECT * FROM exercises", (err, exercises) => {
    if (err) return res.status(500).json(err);

    const result = [];
    let remaining = exercises.length;

    if (remaining === 0) return res.json([]);

    exercises.forEach(ex => {
      db.query("SELECT step FROM exercise_steps WHERE exercise_id = ?", [ex.id], (err, stepsData) => {
        if (err) return res.status(500).json(err);

        db.query("SELECT advantage FROM exercise_advantages WHERE exercise_id = ?", [ex.id], (err, advData) => {
          if (err) return res.status(500).json(err);

          result.push({
            id: ex.id,
            name: ex.name,
            img: ex.img,
            steps: stepsData.map(s => s.step),
            advantages: advData.map(a => a.advantage)
          });

          remaining--;
          if (remaining === 0) res.json(result);
        });
      });
    });
  });
});

module.exports = router;
