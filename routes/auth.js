const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const path = require("path");
const dotenv = require('dotenv').config()
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const views_options = {
    root : path.join(__dirname, "../views")
}
const mysql = require('mysql');
const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'wooggooms'
});
db.connect();
db.query('SELECT * FROM USERS', function (error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: 'wooggooms'
    })
}));

const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());

passport.serializeUser(function(user, done) {
    console.log("Serialize User : ",user)
    done(null, user.email);
});

passport.deserializeUser(function(id, done) {
    console.log("Deserialize User : ", id);
    db.query(`SELECT * FROM USERS WHERE id=?`, [id], 
        function (error, results) {
            const user = results[0];
            if(error) {
                done(error);
            } else {
                done(null,user.email);
            }
        });
});

passport.use(new LocalStrategy(
    {
        usernameField:"email",
        passwordField:"pwd",
    },
    function (email, password, done) {
        console.log("LocalStrategy",email,password);
        db.query(`SELECT * FROM USERS WHERE email=?`,[email],
            function(error,results) {
                const user = results[0];
                if (error) {
                    done(error);
                } else {
                    if (email === user.email) {
                        if (password === user.password) {
                            return done(null,user);
                        } else {
                            return done(null, false, {message:"비밀번호를 확인하세요"});
                        }
                    } else {
                        return done(null,false, {message:"email을 확인하세요"});
                    }
                }
            }
        );
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
    const post = req.body;
    db.query(`
        INSERT INTO USERS (id, email, password, nickname, create_date)
        VALUES(?,?,?,?,NOW())`,
        [nanoid(),post.email,post.pwd,post.nickname],
        function(error,result) {
            if(error){
                console.log(error);
            }
            console.log(result);
        });
        res.redirect('/');
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
    {failureRedirect : '/auth/sign-in'}), function(req, res) {
        req.session.save(function() {
            res.redirect('/')
        })
    }
);

module.exports = router;