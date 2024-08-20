const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.HOST_MYSQL,
  user: process.env.USER_MYSQL,
  password: process.env.PASSWORD_MYSQL,
  database: process.env.DB_MYSQL,
});

module.exports = connection;
