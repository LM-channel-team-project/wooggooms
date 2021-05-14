const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const dbConfig = require('./config/database');
const PORT = 3000;
const dotenv = require('dotenv').config();

app.use(helmet());
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
require('./config/passport')(passport);
// Routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/create', createRouter);

// 404 responses handler
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Server error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start HTTP server listening
app.listen(PORT, function () {
  console.log(`listening on ${PORT}`);
});
