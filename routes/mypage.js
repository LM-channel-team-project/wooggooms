const express = require('express');
const { route } = require('./create');

const router = express.Router();

// Func for checking user login
function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

// Mypage Route
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('mypage', {
      isLoggedIn: isLoggedIn(req),
      path: req.baseUrl,
      nickname: req.user.nickname
    });
  }
});

// Edit my-info Route
router.get('/edit-myinfo', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('myinfo');
  }
});

// Group-edit Route
router.get('/group-edit', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('group-edit');
  }
});

module.exports = router;
