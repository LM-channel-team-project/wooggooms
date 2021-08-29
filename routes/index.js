/* eslint-disable camelcase */
const express = require('express');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();

// Main Route
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.render('index', {
      isLoggedIn: false,
      path: req.baseUrl
    });
  } else {
    const { id } = req.user;
    const sql_mygroups =
      'SELECT * FROM group_member WHERE user_id=? ORDER BY RAND() LIMIT 2';
    db.query(sql_mygroups, [id], (err, mygroupResults) => {
      if (err) {
        next(err);
      }
      res.render('index', {
        isLoggedIn: true,
        path: req.baseUrl,
        myGroups: mygroupResults
      });
    });
  }
});

module.exports = router;
