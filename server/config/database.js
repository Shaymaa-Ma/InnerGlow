const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// Use Railway URL if available
let db;

if (process.env.MYSQL_URL) {
  // If MYSQL_URL exists, parse it with mysql2
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  // fallback
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT), // important
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    multipleStatements: true,
  });
}

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed. Full error:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

module.exports = db;
