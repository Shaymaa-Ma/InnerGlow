const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const router = express.Router();
const JWT_SECRET = "MoodTracker-InnerGlow";

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          return res.status(400).json({ message: "Email already exists" });
        return res.status(500).json({ message: "Server error" });
      }
      const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "User registered successfully", user: { name, email }, token });
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const query = "SELECT id, name, email, password FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Wrong email or password" });

    const user = results[0];
    bcrypt.compare(password, user.password)
      .then((isMatch) => {
        if (!isMatch) return res.status(401).json({ message: "Wrong email or password" });
        delete user.password;
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", user, token });
      })
      .catch(() => res.status(500).json({ message: "Server error" }));
  });
});

// FORGOT PASSWORD
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const query = "SELECT id FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(404).json({ message: "Email not found" });
    res.json({ message: "Email verified. You can reset your password." });
  });
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "All fields required" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE users SET password = ? WHERE email = ?";
    db.query(query, [hashedPassword, email], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Email not found" });
      res.json({ message: "Password updated successfully" });
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
