/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const { nanoid } = require('nanoid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const dotenv = require('dotenv').config();
const dbConfig = require('../config/database');

const { db } = dbConfig;

const { randomBytes } = require('crypto');
const { pbkdf2Sync } = require('crypto');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM user WHERE id=?';
  db.query(sql, [id], (err, results) => {
    const user = results[0];
    if (!user) {
      return done(err, false);
    }
    return done(null, user);
  });
});

// Passport Local-Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd'
    },
    (email, password, done) => {
      const sql = 'SELECT * FROM user WHERE email=?';
      db.query(sql, [email], (err, results) => {
        const user = results[0];
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }
        const salt = user.salt;
        const secret = pbkdf2Sync(
          password,
          salt,
          100000,
          64,
          'sha512'
        ).toString('base64');
        if (secret !== user.secret) {
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
    (accessToken, refreshToken, profile, done) => {
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], (err, results) => {
        const user = results[0];
        if (!user) {
          const id = nanoid();
          const profile_image = profile.photos[0].value;
          const nickname = profile.displayName;
          const sql =
            'INSERT INTO user (id, sns_id, sns_type, profile_image, nickname, create_date) VALUES (?, ?, ?, ?, ?, NOW())';
          db.query(
            sql,
            [id, sns_id, sns_type, profile_image, nickname],
            err => {
              if (err) {
                return done(err);
              }
              const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
              db.query(sql, [sns_id, sns_type], (err, results) => {
                if (err) {
                  return done(err);
                }
                return done(null, results[0]);
              });
            }
          );
        }
        if (user) {
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
    (accessToken, refreshToken, profile, done) => {
      console.log('Profile: ', profile);
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], (err, results) => {
        const user = results[0];
        console.log(results);
        if (!user) {
          const id = nanoid();
          const profile_image = '';
          const nickname = profile.displayName;
          const sql =
            'INSERT INTO user (id, sns_id, sns_type, profile_image, nickname, create_date) VALUES (?, ?, ?, ?, ?, NOW())';
          db.query(
            sql,
            [id, sns_id, sns_type, profile_image, nickname],
            err => {
              if (err) {
                return done(err);
              }
              const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
              db.query(sql, [sns_id, sns_type], (err, results) => {
                if (err) {
                  return done(err);
                }
                return done(null, results[0]);
              });
            }
          );
        }
        if (user) {
          return done(null, user);
        }
      });
    }
  )
);

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/sign-in' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Sign-up Route
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

// 회원가입 유효성 검증
function checkValidEmail(userInput) {
  const regExp =
    /^[\w!#$%&'*+/=?^_{|}~-]+(?:\.[\w!#$%&'*+/=?^_{|}~-]+)*@(?:\w+\.)+\w+$/;

  return regExp.test(userInput) ? true : false;
}

function checkStrongPwd(userInput) {
  const regExp =
    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]).{8,16}$/;

  return regExp.test(userInput) ? true : false;
}

function checkEqualPwd(pwd1, pwd2) {
  return pwd1 === pwd2 ? true : false;
}

function checkValidName(userInput) {
  return userInput.length <= 10 ? true : false;
}

// Sign-up_process Route
// POST request 암호화 필요
router.post('/sign-up_process', (req, res, next) => {
  const id = nanoid();
  const { email, pwd1, pwd2, nickname } = req.body;

  if (
    !checkValidEmail(email) ||
    !checkEqualPwd(pwd1, pwd2) ||
    !checkStrongPwd(pwd1) ||
    !checkValidName(nickname)
  ) {
    console.log('Invalid User Input');
    return;
  }

  const salt = randomBytes(64).toString('base64');
  const secret = pbkdf2Sync(pwd1, salt, 100000, 64, 'sha512').toString(
    'base64'
  );
  const sql =
    'INSERT INTO user (id, email, secret, salt, nickname, create_date) VALUES (?, ?, ?, ?, ?, NOW())';

  db.query(sql, [id, email, secret, salt, nickname], err => {
    if (err) {
      next(err);
    }
    res.redirect('/auth/sign-in');
  });
});

// Sign-in Route
router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

// Sign-in_process Route
router.post(
  '/sign-in_process',
  passport.authenticate('local', { failureRedirect: '/auth/sign-in' }),
  (req, res) => {
    req.session.save(() => {
      res.redirect('/');
    });
  }
);

// Sign-out Route
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
    console.log('로그아웃 처리되었습니다');
  });
});

module.exports = router;
