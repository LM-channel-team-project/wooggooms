// express
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

// helmet
const helmet = require('helmet');
app.use(helmet());

// session
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config/databaseConfig');
const db = config.db;
const sessionStore = new MySQLStore({ port: 3306 }, db);
app.use(
  session({
    secret: 'keyboard cat',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);

// passport
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

// router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
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

// module.exports = {
//   connection: new MySQLStore({ port: 3306 }, db)
// };
