// config/database.js
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

let db;

// Use a pool in production (Render/Railway) for stable connections
if (process.env.MYSQLURL) {
  // Create a pool for auto-reconnect and multiple connections
  db = mysql.createPool(process.env.MYSQLURL).promise();
  console.log("Using MySQL Pool for production");
} else {
  // Local development: single connection
  db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: Number(process.env.MYSQLPORT),
    database: process.env.MYSQLDATABASE,
    charset: "utf8mb4",
    multipleStatements: true,
  });

  db.connect((err) => {
    if (err) {
      console.error("MySQL connection failed. Full error:", err);
    } else {
      console.log("MySQL connected successfully (local)");
    }
  });
}

module.exports = db;
