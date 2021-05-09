const express = require("express");
const app = express();
const helmet = require("helmet");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const createRouter = require('./routes/create');
const session = require("express-session")
const FileStore = require("session-file-store")(session)

const PORT = 3000;

app.use(helmet());
// Routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/create', createRouter);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

const authData = {
    email: "young961027@gmail.com",
    password: "1234",
    nickname: "loopbackseal"
};

const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;

app.post("auth/sign-in_process",
    passport.authenticate('local',
        { successRedirect: '/',
        failureRedirect: 'auth/sign-in' 
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log("serializeUser", user);
    done(null, user.email);
  });
  
passport.deserializeUser(function(id, done) {
    console.log("deserializeUser", id);
    done(null, authData);
// User.findById(id, function(err, user) {
//   done(err, user);
// });
});

passport.use(new LocalStrategy(
    {
     usernameField:"email",
     passwordField:"pwd"
    },
    function (username, password, done) {
        console.log("LocalStrategy",username,password)
        if (username === authData.email) {
            console.log(1);
            if (password === authData.password) {
                console.log(2);
                return done(null,authData);
            } else {
                console.log(3);
                return done(null,false, {
                    message: "Incorrect password"
                });
            }
        } else {
            console.log(4);
            return done(null,false, {
                message: "Incorrect username"
            });
        }
   }
));

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
