// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/database"); // Railway or local MySQL
const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWTSECRET;


// Middleware - CORS setU
app.use(cors(
  app.use(cors)({
    origin: ["http://localhost:3000",
      "https://innergloww.netlify.app"],
    credentials: true
  })));

app.use(express.json());

// BASE URL for images (dynamic)
const BASE_URL = process.env.BASEURL || `http://localhost:${port}`;

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images/"),
  filename: (req, file, cb) =>
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname)),

});
const upload = multer({ storage });

// Serve uploaded images
app.use("/images", express.static(path.join(__dirname, "images")));


// Middleware to check JWT (optional for guests)
const jwt = require("jsonwebtoken");
const authenticateOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
};

// --- ROUTES ---
// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Appointments
const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

// Home
const homeRoutes = require("./routes/home");
app.use("/api/home", homeRoutes);

//Features
const featuresRoutes = require("./routes/features");
app.use("/api/features", featuresRoutes);

//Reviews
const reviewsRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewsRoutes);


const aboutRoutes = require("./routes/about");
app.use("/api/about", aboutRoutes);

// Services
const servicesRoutes = require("./routes/services");
app.use("/api/services", servicesRoutes);

// Education
const educationRoutes = require("./routes/education");
app.use("/api/education", educationRoutes);

// Diet
const dietRoutes = require("./routes/diet");
app.use("/api/diet", dietRoutes);

// Exercises
const exercisesRoutes = require("./routes/exercises");
app.use("/api/exercises", exercisesRoutes);

// Meditation
const meditationRoutes = require("./routes/meditation");
app.use("/api/meditation", meditationRoutes);

// Stress History
const stressRoutes = require("./routes/stress");
app.use("/api/stress", stressRoutes);

// Journal / Mood Entries
const journalRoutes = require("./routes/journal");
app.use("/api/journal", journalRoutes);

// Moods
const moodsRoutes = require("./routes/moods");
app.use("/api/moods", moodsRoutes);

// Quotes
const quotesRoutes = require("./routes/quotes");
app.use("/api/quotes", quotesRoutes);

// Contact Messages
const contactRoutes = require("./routes/contact");
app.use("/api/messages", contactRoutes);

// --- TEST DB CONNECTION ---
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) return res.status(500).json({ message: "DB connection failed", error: err });
    res.json({ message: "DB connection works!", results });
  });
});

// --- PROTECTED EXAMPLE ---
app.get("/api/protected", authenticateOptional, (req, res) => {
  res.json({ message: "You are logged in", user: req.user });
});

// START SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));
