/* eslint-disable no-console */
const express = require('express');

const app = express();
const router = express.Router();
const passport = require('passport');
const db = require('./config/database')();

const PORT = 3000;

require('./config/express')(app, passport, db);
require('./config/routes')(app, router, passport, db);
require('./config/passport')(passport);

module.exports = { app, express, passport };

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
