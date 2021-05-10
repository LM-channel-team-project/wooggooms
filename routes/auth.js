const express = require('express');
const router = express.Router();
const path = require("path");
const session = require("express-session")
const FileStore = require("session-file-store")(session)

const views_options = {
    root : path.join(__dirname, "../views")
}

const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(
    {
        usernameField:"email",
        passwordField:"pwd",
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

// Sign-up Route
router.get("/sign-up", function(req, res, next) {
    res.sendFile("sign-up.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-up.html");
        }
    });
});

router.post("/sign-up_process", function(req, res) {
    // Create DB table
    res.redirect("/");
});

// Sign-in Route
router.get("/sign-in", function(req, res, next) {
    res.sendFile("sign-in.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-in.html");
        }
    });
});

router.post('/sign-in_process', passport.authenticate('local',
    {failureRedirect : '/auth/login'}), function(req, res) {
        req.session.save(function() {
            res.redirect('/')
        })
    }
);

module.exports = router;