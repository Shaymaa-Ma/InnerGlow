
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const JWT_SECRET = "MoodTracker-InnerGlow"; 
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.use('/images', express.static(path.join(__dirname, 'images')));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "moodtracker",
  charset: 'utf8mb4'
});

db.connect(err => {
  if (err) console.error("MySQL connection failed:", err);
  else console.log("MySQL connected successfully");
});


// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Email already exists" });
        return res.status(500).json({ message: "Server error" });
      }

      // Generate token
      const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "User registered successfully", user: { name, email }, token });
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const query = "SELECT id, name, email, password FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Wrong email or password" });

    const user = results[0];
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) return res.status(401).json({ message: "Wrong email or password" });

        delete user.password;
        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", user, token });
      })
      .catch(() => res.status(500).json({ message: "Server error" }));
  });
});

// Authenticate middleware for guests
const authenticateOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null; // treat as guest
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // logged-in user
    next();
  } catch {
    req.user = null; // invalid token treated as guest
    next();
  }
};


// Example protected route
app.get("/api/protected", authenticateOptional, (req, res) => {
  res.json({ message: "You are logged in", user: req.user });
});

app.listen(5000, () => console.log("Server running on port 5000"));

// FORGOT PASSWORD
app.post("/forgot-password", (req, res) => {
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
app.post("/reset-password", async (req, res) => {
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


// MAIN APIS 
// Home API
app.get("/api/home", (req, res) => {
  db.query("SELECT * FROM features", (err, features) => {
    if (err) return res.status(500).json(err);
    db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err2, reviews) => {
      if (err2) return res.status(500).json(err2);
      res.json({ heroImg: "mental-hero.png", homeBg: "about-mentalwellness.png", features, reviews });
    });
  });
});

// Reviews API
app.post("/api/reviews", (req, res) => {
  const { name, text, rating, img } = req.body; //till now user can not add image => default avatar for all users
  if (!name || !text || !rating) return res.status(400).json({ error: "Missing fields" });
  db.query("INSERT INTO reviews (name, text, rating, img, verified) VALUES (?, ?, ?, ?, ?)",
    [name, text, rating, img || "default_avatar.png", 0],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    }
  );
});

// About API
app.get("/api/about", (req, res) => {
  res.json({ aboutBg: "about-mentalwellness.png" });
});

// Services
app.get("/api/services", (req, res) => {
  db.query("SELECT * FROM services ORDER BY id ASC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Education
app.get("/api/education", (req, res) => {
  db.query("SELECT * FROM education_items", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data.map(item => ({ ...item, img: `http://localhost:5000/images/info/${item.img}` })));
  });
});


//Diet API
// Get all diet items for Diet page
app.get("/api/diet", (req, res) => {
  const heroImage = "http://localhost:5000/images/diet/heroImage.png";
  const query = "SELECT id, name, description, img FROM diet_items ORDER BY id ASC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching diet items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Add full URL to image
    const items = results.map(item => ({
      ...item,
      img: `http://localhost:5000/images/diet/${item.img}`
    }));

    res.json({ heroImage, items });
  });
});



// Exercises API
app.get("/api/exercises", (req, res) => {
  const query = "SELECT * FROM exercises";
  db.query(query, (err, exercises) => {
    if (err) return res.status(500).json(err);

    // Fetch steps and advantages for each exercise
    const result = [];
    let remaining = exercises.length;

    if (remaining === 0) return res.json([]); // no exercises

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
          if (remaining === 0) {
            res.json(result);
          }
        });
      });
    });
  });
});


//Meditation page
//Get all meditation videos
app.get("/api/meditation-videos", (req, res) => {
  const query = "SELECT * FROM meditation_videos ORDER BY id ASC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

//Save meditation history
app.post("/api/meditation-history", (req, res) => {
  const { duration } = req.body;
  if (!duration) return res.status(400).json({ message: "Duration required" });

  const timestamp = new Date();
  const query = "INSERT INTO meditation_history (duration, timestamp) VALUES (?, ?)";
  db.query(query, [duration, timestamp], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ id: result.insertId, duration, timestamp });
  });
});


//Get meditation history
app.get("/api/meditation-history", (req, res) => {
  const query = "SELECT * FROM meditation_history ORDER BY timestamp DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});


// Delete a meditation history entry
app.delete("/api/meditation-history/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM meditation_history WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Deleted successfully" });
  });
});


//Stress Detection Page
//get all stress history
app.get("/api/stress-history", (req, res) => {
  const query = "SELECT * FROM stress_history ORDER BY timestamp DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

//post new stress entry
app.post("/api/stress-history", (req, res) => {
  const { sleep, bp, resp, heart, stress_level, advice } = req.body;

  if (!sleep || !bp || !resp || !heart || !stress_level || !advice) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO stress_history (sleep, bp, resp, heart, stress_level, advice) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [sleep, bp, resp, heart, stress_level, advice], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({
      id: result.insertId,
      sleep,
      bp,
      resp,
      heart,
      stress_level,
      advice,
      timestamp: new Date()
    });
  });
});

//delete a stress entry
app.delete("/api/stress-history/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM stress_history WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Deleted successfully" });
  });
});


//Appointment page
app.post("/api/appointments", (req, res) => {
  const { first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message } = req.body;

  if (!first_name || !last_name || !email || !service || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // First, get the user ID from the email
  const getUserSql = `SELECT id FROM users WHERE email = ?`;
  db.query(getUserSql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user_id = results[0].id;

    const sql = `
      INSERT INTO appointments
      (first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [first_name, last_name, email, birthday, appointment_date, appointment_time, service, therapist, message, user_id], (err2) => {
      if (err2) {
        console.error("DB ERROR:", err2);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "Appointment booked successfully" });
    });
  });
});



// Moods
app.get("/api/moods", (req, res) => {
  db.query("SELECT * FROM moods", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Quotes
app.get("/api/quotes", (req, res) => {
  db.query("SELECT * FROM quotes", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get all journal entries for logged-in user (or guests see only their own)
app.get("/api/journal-entries", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    // Logged-in user
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user_id = decoded.id;
      db.query(
        "SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC",
        [user_id],
        (err, results) => {
          if (err) return res.status(500).json({ message: "DB error" });
          res.json(results);
        }
      );
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    // Guest: return only entries with user_id NULL (optional)
    db.query(
      "SELECT * FROM mood_entries WHERE user_id IS NULL ORDER BY datetime ASC",
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json(results);
      }
    );
  }
});


//Add API: create new entry
app.post("/api/journal-entries", (req, res) => {
  const { mood, text } = req.body;

  if (!mood) return res.status(400).json({ message: "Mood is required" });

  // If authenticated, use user_id, else NULL
  const user_id = req.user?.id || null;

  const query = "INSERT INTO mood_entries (mood, text, user_id) VALUES (?, ?, ?)";
  db.query(query, [mood, text || null, user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to save entry", error: err });

    db.query("SELECT * FROM mood_entries ORDER BY datetime ASC", (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
      res.status(201).json(rows); // return full updated list
    });
  });
});




// Update entry
app.put("/api/journal-entries/:id", authenticateOptional, (req, res) => {
  const { id } = req.params;
  const { mood, text } = req.body;

  const user_id = req.user?.id || null;

  const query = "UPDATE mood_entries SET mood=?, text=? WHERE id=? AND (user_id=? OR user_id IS NULL)";
  db.query(query, [mood, text || null, id, user_id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to update entry" });
    db.query("SELECT * FROM mood_entries ORDER BY datetime ASC", (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
      res.json(rows);
    });
  });
});



//Delete API
app.delete("/api/journal-entries/:id", (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Login required" });

  let user_id;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    user_id = decoded.id;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  db.query(
    "DELETE FROM mood_entries WHERE id = ? AND user_id = ?",
    [id, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to delete entry" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Entry not found" });

      // Return updated list
      db.query(
        "SELECT * FROM mood_entries WHERE user_id = ? ORDER BY datetime ASC",
        [user_id],
        (err2, rows) => {
          if (err2) return res.status(500).json({ message: "Failed to fetch entries" });
          res.json(rows);
        }
      );
    }
  );
});



// Get all messages 
app.get("/api/messages", (req, res) => {
  db.query("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Create new message
app.post("/api/messages", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to save message" });
      res.status(201).json({ id: result.insertId, name, email, message });
    }
  );
});





// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
