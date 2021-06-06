const express = require('express');

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
      nickname: req.user.nickname
    });
  }
});

module.exports = router;
