const mysql = require('mysql');
const dotenv = require('dotenv').config();

config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PWD,
  database: 'wooggooms'
};
const db = mysql.createConnection(config); //added the line

module.exports = {
  db: mysql.createConnection(config)
};
