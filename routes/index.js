/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const dbConfig = require('../config/database');

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
  const sql = 'SELECT * FROM study_group';
  dbConfig.db.query(sql, (err, results) => {
    if (err) {
      next(err);
    } else {
      res.render('index', {
        isLoggedIn: isLoggedIn(req),
        data: results
      });
    }
  });
});

module.exports = router;
