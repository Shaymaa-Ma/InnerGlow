const dotenv = require("dotenv"); // Load .env variables
dotenv.config(); 


const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./config/database");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) =>
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- TEST DB CONNECTION ENDPOINT ---
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      console.error("DB connection test failed:", err);
      return res.status(500).json({ error: "DB connection failed", details: err.message, code: err.code });
    }
    res.json({ message: "DB connection works!", results });
  });
});


// ROUTES
// Auth & User routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Home & Reviews routes
const homeRoutes = require("./routes/home");
app.use("/api/home", homeRoutes);

// Contact Messages routes
const contactRoutes = require("./routes/contact");
app.use("/api/contact", contactRoutes);

// Services routes
const servicesRoutes = require("./routes/services");
app.use("/api/services", servicesRoutes);

// Education routes
const educationRoutes = require("./routes/education");
app.use("/api/education", educationRoutes);

// Diet routes
const dietRoutes = require("./routes/diet");
app.use("/api/diet", dietRoutes);

// Exercises routes
const exercisesRoutes = require("./routes/exercises");
app.use("/api/exercises", exercisesRoutes);

// Meditation routes
const meditationRoutes = require("./routes/meditation");
app.use("/api/meditation", meditationRoutes);

// Stress History routes
const stressRoutes = require("./routes/stress");
app.use("/api/stress", stressRoutes);

// Appointments routes
const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

// Journal / Mood Entries routes
const journalRoutes = require("./routes/journal");
app.use("/api/journal", journalRoutes);

// Moods routes
const moodsRoutes = require("./routes/moods");
app.use("/api/moods", moodsRoutes);

// Quotes routes
const quotesRoutes = require("./routes/quotes");
app.use("/api/quotes", quotesRoutes);

// START SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));
