const express = require('express');

const router = express.Router();

// Func for checking user login
function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

// Main Route
router.get('/', (req, res, next) => {
  res.render('index', {
    isLoggedIn: isLoggedIn(req),
  });
});

module.exports = router;
