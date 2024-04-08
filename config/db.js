const mysql = require("mysql");

const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistem_laundry",
  charset: "utf8mb4",
});

conn.getConnection((err) => {
  if (err) throw err;
  console.log("DB Connected");
});

module.exports = conn;
