const express = require('express');

const router = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const views_options = {
  root: path.join(__dirname, '../views'),
};
const dotenv = require('dotenv').config();
const dbConfig = require('../config/database');

const { db } = dbConfig;

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
      passwordField: 'pwd',
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
      callbackURL: process.env.GG_CBURL,
    },
    (accessToken, refreshToken, profile, done) => {
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], (err, results) => {
        const user = results[0];
        if (!user) {
          const id = nanoid();
          const sns_profile = profile.photos[0].value;
          const nickname = profile.displayName;
          const sql = 'INSERT INTO user (id, sns_id, sns_type, sns_profile, nickname, create_date) VALUES (?, ?, ?, ?, ?, NOW())';
          db.query(
            sql,
            [id, sns_id, sns_type, sns_profile, nickname],
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
      callbackURL: process.env.FB_CBURL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Profile: ', profile);
      const sns_id = profile.id;
      const sns_type = profile.provider;
      const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
      db.query(sql, [sns_id, sns_type], (err, results) => {
        const user = results[0];
        if (!user) {
          const id = nanoid();
          const sns_profile = '';
          const nickname = profile.displayName;
          const sql = 'INSERT INTO user (id, sns_id, sns_type, sns_profile, nickname, create_date) VALUES (?, ?, ?, ?, ?, NOW())';
          db.query(
            sql,
            [id, sns_id, sns_type, sns_profile, nickname],
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
    scope: ['https://www.googleapis.com/auth/userinfo.profile'],
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
  res.sendFile('sign-up.html', views_options, err => {
    if (err) {
      next(err);
    } else {
      console.log('Sent: sign-up.html');
    }
  });
});

// Sign-up_process Route
// POST request 암호화 필요
router.post('/sign-up_process', (req, res) => {
  const post = req.body;
  const id = nanoid();
  const { email } = post;
  const { pwd } = post;
  const { pwd2 } = post;
  const { nickname } = post;
  const sql = 'INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)';
  if (pwd !== pwd2) {
    console.log('비밀번호가 일치하지 않습니다');
  } else {
    db.query(sql, [id, email, pwd, nickname], (err, result, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log('New User Signed Up!');
      }
    });
    res.redirect('/auth/sign-in');
  }
});

// Sign-in Route
router.get('/sign-in', (req, res, next) => {
  res.sendFile('sign-in.html', views_options, err => {
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
