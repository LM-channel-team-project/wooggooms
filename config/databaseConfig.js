const mysql = require('mysql');
const dotenv = require('dotenv').config();

config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: 'wooggooms'
};
const db = mysql.createConnection(config); //added the line
db.connect(function (err) {
  if (err) {
    console.log('error connecting:' + err.stack);
  }
  console.log('connected successfully to DB.');
});

module.exports = {
  db: mysql.createConnection(config)
};
