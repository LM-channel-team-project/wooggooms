/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const passport = require('passport');

const app = express();

module.exports = app;

const db = require('./config/database')();
require('./config/express')(app, passport, db);
require('./config/passport')(passport);

// router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth')(router, passport);
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/create', createRouter);

// 404 responses handler
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});

// server error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// start HTTP server listening
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
