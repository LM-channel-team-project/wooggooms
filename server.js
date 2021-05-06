const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");

const PORT = 3000;
// express-session example
const parseurl = require("parseurl")
const session = require("express-session")
const FileStore = require("session-file-store")(session)

// ***body-parser가 없으면 콜백함수가 실행되지 않음!!
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(helmet());
// express-session example
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

// passport example
const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;

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

let views_options = {
    root : path.join(__dirname, "views")
}

// Main Route
app.get("/", function(req, res, next) {
    res.sendFile("main.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: main.html");
        }
    });
    console.log(req.session);
});

// Sign-up Route
app.get("/sign-up", function(req, res, next) {
    res.sendFile("sign-up.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-up.html");
        }
    });
});

app.post("/sign-up_process", function(req, res) {
    // Create DB table
    res.redirect("/");
});


// Sign-in Route
app.get("/sign-in", function(req, res, next) {
    res.sendFile("sign-in.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-in.html");
        }
    });
});

app.post("/sign-in_process", 
    passport.authenticate('local',
        { successRedirect: '/',
        failureRedirect: '/sign-in' 
    })
);

// Mypage Route
app.get("/mypage", function(req, res, next) {
    res.sendFile("mypage.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: mypage.html");
        }
    });
});

// Create Route
app.get("/create", function(req, res, next) {
    res.sendFile("create.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: create.html");
        }
    });
});

app.post("/create_process", function(req, res) {
    // Create DB table
    res.redirect("/mypage");
});

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