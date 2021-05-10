const express = require('express');
const router = express.Router();
const path = require("path");
const { nanoid } = require('nanoid');
const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const views_options = {
    root : path.join(__dirname, "../views")
}
const dbCredentials = require('../config/mysql.json');
const db = mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.user,
    password: dbCredentials.password,
    database: dbCredentials.database
});
db.connect();


// Passport Local-Strategy
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.query(`SELECT * FROM user WHERE id=?`,
        [id],
        function(err, results) {
            const user = results[0];
            if(!user) { return done(err, false) }
            return done(null, user);
        }
    );
    console.log('deserialized DONE!');
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function (email, password, done) {
        db.query(`SELECT * FROM user WHERE email=?`,
            [email],
            function(err, results) {
                const user = results[0];
                if(err) { return done(err); }
                if(!user) {
                    return done(null, false, { message: 'Incorrect email' });
                }
                if(password !== user.password) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user);
            }
        )
    }
))

// Passport GoogleOAuth Strategy
const googleCredentials = require('../config/google.json');

passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris[0]
  },
  function(accessToken, refreshToken, profile, done) {
      const email = profile.emails[0].value;
      console.log(email);
    //   이 사용자를 DB에서 어떻게 처리할 건지?
    //   처리가 완료되면 done(null, user)로 serializeUser 시킴.
  }
));

router.get('/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'email'
        ]
    })
);

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
    function(req, res) {
        res.redirect('/');
});


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

// Sign-up_process Route
// POST request 암호화 필요
router.post("/sign-up_process", function(req, res) {
    console.log(req.body);
    const post = req.body;
    const id = nanoid();
    const email = post.email;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const nickname = post.nickname;
    // 이메일주소, 패스워드, 닉네임 유효성 검사 기능 필요
    if(pwd !== pwd2) {
        // 비밀번호가 일치하지 않는 경우, 회원가입 불가 기능 추가 필요
        console.log('비밀번호가 일치하지 않습니다');
    } else {
        // MySQL wooggoooms-user에 회원정보 저장
        db.query(`INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)`,
            [id, email, pwd, nickname],
            function(err, result, fields) {
                if (err) {
                    console.log(err);
                }
                console.log('New User Signed Up!');
            }
        );
        // '회원가입이 완료되었습니다' 팝업. 확인 누르면 로그인 페이지로 리다이렉트
        res.redirect("/auth/sign-in");
    }
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

// Sign-in_process Route
router.post("/sign-in_process",
    passport.authenticate('local', { failureRedirect: '/auth/sign-in' }),
        function(req, res) {
            req.session.save(function() {
                res.redirect('/');
            });
        }
);

// Sign-out Route
router.get("/sign-out", function(req, res) {
    if(!req.user) {
        res.send('로그인이 되어있지 않습니다.');
    } else {
        req.session.destroy(function() {
            res.redirect('/');
            console.log('로그아웃 처리되었습니다');
        });
    }
})

module.exports = router;