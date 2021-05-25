/* eslint-disable no-unused-vars */
const express = require('express');

const app = express();
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const dbConfig = require('./config/database');

const PORT = 3000;

app.set('view engine', 'ejs');

app.use(helmet());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: dbConfig.db,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/create', createRouter);

// 404 responses handler
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Server error handler
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start HTTP server listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
