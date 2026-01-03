const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

let db;

if (process.env.MYSQLURL) {
  db = mysql.createConnection(process.env.MYSQLURL); // works if URL is valid
} else {
  db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: Number(process.env.MYSQLPORT), 
    database: process.env.MYSQLDATABASE,
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
