const express = require('express');

const router = express.Router();

// Func for checking user login
function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

router.get('/info/test', (req, res, next) => {
  res.render('group-info', {
    isLoggedIn: isLoggedIn(req)
  });
});

module.exports = router;
