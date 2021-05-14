const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

module.exports = function () {
  const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
  };

  const connection = mysql.createConnection(options);

  const sessionStore = new MySQLStore({}, connection);

  return sessionStore;
};
