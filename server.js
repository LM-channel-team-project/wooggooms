const express = require("express");
const app = express();
const helmet = require("helmet");
//const path = require("path");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const PORT = 3000;

app.use(helmet());
app.use(express.urlencoded( { extended: false }));
app.use(session({
    secret: 'session_secret',
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'gnltk341',
        database: 'wooggooms'
    }),
    resave: false,
    saveUninitialized: false
}));

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