const express = require("express");
const app = express();
const helmet = require("helmet");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const passport = require('passport');
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const PORT = 3000;
const authData = {
    email: "young961027@gmail.com",
    password: "1234",
    nickname: "loopbackseal"
};
app.use(helmet());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(express.urlencoded({ 
    extended: false
}));

passport.serializeUser(function(user, done) {
    console.log("Serialize User : ",user)
    done(null, user.email);
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("Deserialize User : ", id);
    done(null, authData);
    // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
    });
    
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
