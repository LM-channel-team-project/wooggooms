/* eslint-disable camelcase */
/* eslint-disable no-console */
const { nanoid } = require('nanoid');
const path = require('path');

// eslint-disable-next-line camelcase
const views_options = {
  root: path.join(__dirname, '../views')
};

module.exports = function (router, passport, db) {
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
      failureRedirect: '/auth/sign-in'
    })
  );

  // Google Route
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
    console.log(req.body);
    const { email } = req.body;
    const password = req.body.pwd;
    const { nickname } = req.body;
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
