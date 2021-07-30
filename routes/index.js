/* eslint-disable camelcase */
const express = require('express');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();

// Main Route
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  const mainCategory = req.query.main;
  const subCategory = req.query.sub;
  let sql_searchlist;
  // 초기 접속 화면이거나 '전체' 카테고리를 선택한 경우
  if (mainCategory === undefined || mainCategory === '전체') {
    sql_searchlist =
      'SELECT * FROM study_group ORDER BY create_date DESC LIMIT 0, 10';
  }
  // 다른 카테고리를 선택한 경우 해당 카테고리에 맞는 데이터 DB에서 SELECT
  else {
    sql_searchlist = `SELECT * FROM study_group WHERE main_category='${mainCategory}' ORDER BY create_date DESC LIMIT 0, 10`;
    // 소분류를 선택한 경우
    if (subCategory) {
      sql_searchlist = `SELECT * FROM study_group WHERE sub_category='${subCategory}' ORDER BY create_date DESC LIMIT 0, 10`;
    }
  }
  db.query(sql_searchlist, (err, searchlistResults) => {
    if (err) {
      next(err);
    }
    if (!req.user) {
      res.render('index', {
        isLoggedIn: false,
        path: req.baseUrl,
        searchlistGroups: searchlistResults
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
          searchlistGroups: searchlistResults,
          myGroups: mygroupResults
        });
      });
    }
  });
});

module.exports = router;
