const express = require('express');

const router = express.Router();

// Mypage Route
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('mypage');
  }
});
module.exports = router;
