const express = require("express");
const app = express();
const helmet = require("helmet");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const PORT = 3000;

app.use(helmet());
app.use(express.urlencoded( { extended: false }));
const dbCredentials = require('./config/mysql.json');
app.use(session({
    secret: dbCredentials.secret,
    store: new MySQLStore({
        host: dbCredentials.host,
        port: dbCredentials.port,
        user: dbCredentials.user,
        password: dbCredentials.password,
        database: dbCredentials.database
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
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
    res.status(500).send("Something broke!");
});

// Start HTTP server listening
app.listen(PORT, function() {
    console.log(`listening on ${PORT}`);
});