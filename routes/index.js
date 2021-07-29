/* eslint-disable camelcase */
const express = require('express');
const dbConfig = require('../config/database');
const { db } = dbConfig;

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
  const sql_maingroups =
    'SELECT * FROM study_group ORDER BY create_date DESC LIMIT 0, 10';
  db.query(sql_maingroups, (err, mainResults) => {
    if (err) {
      next(err);
    }
    if (!req.user) {
      res.render('index', {
        isLoggedIn: false,
        path: req.baseUrl,
        mainGroups: mainResults
      });
    } else {
      const { id } = req.user;
      const sql_mygroups =
        'SELECT study_group_id, study_group_name FROM group_member WHERE user_id=? ORDER BY RAND() LIMIT 2';
      db.query(sql_mygroups, [id], (err, myResults) => {
        if (err) {
          next(err);
        }
        res.render('index', {
          isLoggedIn: true,
          path: req.baseUrl,
          mainGroups: mainResults,
          myGroups: myResults
        });
      });
    }
  });
});

module.exports = router;
