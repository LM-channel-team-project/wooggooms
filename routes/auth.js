/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');

// eslint-disable-next-line camelcase
const views_options = {
  root: path.join(__dirname, '../views')
};

// mysql database
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'wooggooms'
});
db.connect();

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// 2. Save user data in session store
passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log('serializeUser :', user.id);
});

// 3. Check if it's signed in every page
passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM USERS WHERE id=?';
  db.query(sql, [id], (err, results) => {
    const user = results[0];
    done(null, user);
    console.log('deserializeUser :', user);
  });
});

// 1. Compare user ID/PW input and database
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd'
    },
    (email, password, done) => {
      const sql = 'SELECT * FROM USERS WHERE email=?';
      db.query(sql, [email], (err, results) => {
        const user = results[0];
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  )
);

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

router.post(
  '/sign-in_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
  })
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
router.post('/sign-up_process', (req, res, next) => {
  const id = nanoid();
  const email = req.body;
  const password = req.body;
  const nickname = req.body;
  const sql =
    'INSERT INTO USERS (id, email, password, nickname, create_date) VALUES (?, ?, ?, ?, NOW())';
  db.query(sql, [id, email, password, nickname], err => {
    if (err) {
      next(err);
    } else {
      console.log(`[${email}] signed up for a local account.`);
    }
  });
  res.redirect('/auth/sign-in');
});

router.get('/sign-out', (req, res) => {
  req.logout();
  console.log('Signed out.');
  res.redirect('/');
});

module.exports = router;
