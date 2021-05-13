/* eslint-disable no-console */
const { nanoid } = require('nanoid');
const path = require('path');
const db = require('../config/database');

// eslint-disable-next-line camelcase
const views_options = {
  root: path.join(__dirname, '../views')
};

module.exports = function (router, passport) {
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

  return router;
};
