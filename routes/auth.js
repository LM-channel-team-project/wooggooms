const express = require('express');
const router = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const views_options = {
  root: path.join(__dirname, '../views')
};
const dbConfig = require('../config/databaseConfig');
const { db } = dbConfig;
const dotenv = require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user.id);
  console.log('serialized: ', user);
});

passport.deserializeUser(function (id, done) {
  const sql = 'SELECT * FROM user WHERE id=?';
  db.query(sql, [id], function (err, results) {
    const user = results[0];
    if (!user) {
      return done(err, false);
    }
    return done(null, user);
  });
  console.log('deserialized');
});

// Passport Local-Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd'
    },
    function (email, password, done) {
      const sql = 'SELECT * FROM user WHERE email=?';
      db.query(sql, [email], function (err, results) {
        const user = results[0];
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      });
    }
  )
);

// Passport GoogleOAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_ID,
      clientSecret: process.env.GG_SECRET,
      callbackURL: process.env.GG_CBURL
    },
    function (accessToken, refreshToken, profile, done) {
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], function (err, results) {
        const user = results[0];
        // 처음 방문한 유저라면: 회원가입 시키고 로그인 시키기
        if (!user) {
          const id = nanoid();
          const nickname = profile.displayName;
          const sql =
            'INSERT INTO user (id, sns_id, sns_type, nickname) VALUES (?, ?, ?, ?)';
          db.query(
            sql,
            [id, sns_id, sns_type, nickname],
            function (err, result, field) {
              if (err) {
                console.log(err);
              }
              console.log('구글계정으로 처음 방문하셨네요!');
              const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
              db.query(sql, [sns_id, sns_type], function (err, results) {
                if (err) {
                  console.log(err);
                }
                console.log('구글계정으로 가입시켰습니다!');
                return done(null, results[0]);
              });
            }
          );
        }
        // 처음 방문한 유저가 아니라면: 바로 로그인 시키기
        if (user) {
          console.log('재방문 하셨네요!');
          return done(null, user);
        }
      });
    }
  )
);

// Passport Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: process.env.FB_CBURL
    },
    function (accessToken, refreshToken, profile, done) {
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], function (err, results) {
        const user = results[0];
        // 처음 방문한 유저라면: 회원가입 시키고 로그인 시키기
        if (!user) {
          const id = nanoid();
          const nickname = profile.displayName;
          const sql =
            'INSERT INTO user (id, sns_id, sns_type, nickname) VALUES (?, ?, ?, ?)';
          db.query(
            sql,
            [id, sns_id, sns_type, nickname],
            function (err, result, field) {
              if (err) {
                console.log(err);
              }
              console.log('페이스북 계정으로 처음 방문하셨네요!');
              const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
              db.query(sql, [sns_id, sns_type], function (err, results) {
                if (err) {
                  console.log(err);
                }
                console.log('페이스북 계정으로 가입시켰습니다!');
                return done(null, results[0]);
              });
            }
          );
        }
        // 처음 방문한 유저가 아니라면: 바로 로그인 시키기
        if (user) {
          console.log('재방문 하셨네요!');
          return done(null, user);
        }
      });
    }
  )
);

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
  function (req, res) {
    res.redirect('/');
  }
);

// Sign-up Route
router.get('/sign-up', function (req, res, next) {
  res.sendFile('sign-up.html', views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent: sign-up.html');
    }
  });
});

// Sign-up_process Route
// POST request 암호화 필요
router.post('/sign-up_process', function (req, res) {
  console.log(req.body);
  const post = req.body;
  const id = nanoid();
  const email = post.email;
  const pwd = post.pwd;
  const pwd2 = post.pwd2;
  const nickname = post.nickname;
  const sql =
    'INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)';
  // 이메일주소, 패스워드, 닉네임 유효성 검사 기능 필요
  if (pwd !== pwd2) {
    // 비밀번호가 일치하지 않는 경우, 회원가입 불가 기능 추가 필요
    console.log('비밀번호가 일치하지 않습니다');
  } else {
    // MySQL wooggoooms-user에 회원정보 저장
    db.query(sql, [id, email, pwd, nickname], function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log('New User Signed Up!');
      }
    });
    // '회원가입이 완료되었습니다' 팝업. 확인 누르면 로그인 페이지로 리다이렉트
    res.redirect('/auth/sign-in');
  }
});

// Sign-in Route
router.get('/sign-in', function (req, res, next) {
  res.sendFile('sign-in.html', views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent: sign-in.html');
    }
  });
});

// Sign-in_process Route
router.post(
  '/sign-in_process',
  passport.authenticate('local', { failureRedirect: '/auth/sign-in' }),
  function (req, res) {
    req.session.save(function () {
      res.redirect('/');
    });
  }
);

// Sign-out Route
router.get('/sign-out', function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
    console.log('로그아웃 처리되었습니다');
  });
});

module.exports = router;
