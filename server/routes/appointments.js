const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Post new appointment
router.post("/", (req, res) => {
  const { first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message } = req.body;
  if (!first_name || !last_name || !email || !service || !appointment_date || !appointment_time)
    return res.status(400).json({ message: "Missing required fields" });

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user_id = results[0].id;
    const sql = `INSERT INTO appointments (first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message, user_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "Appointment booked successfully" });
    });
  });
});

module.exports = router;
