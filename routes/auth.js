const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../controllers/auth');

// Auth Routes
router.get('/sign-up', auth.load_signup);
router.post('/sign-up_process', auth.process_signup); // POST request 암호화 필요
router.get('/sign-in', auth.load_signin);
router.get('/sign-out', auth.process_signout);

// Local
router.post(
  '/sign-in_process',
  passport.authenticate('local', { failureRedirect: '/auth/sign-in' }),
  function (req, res) {
    req.session.save(function () {
      res.redirect('/');
    });
  }
);

// Facebook
router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

// Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = router;
