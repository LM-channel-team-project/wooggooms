/* eslint-disable camelcase */
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
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('index', {
    isLoggedIn: isLoggedIn(req),
    path: req.baseUrl
  });
});

module.exports = router;
