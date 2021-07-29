/* eslint-disable camelcase */
const express = require('express');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();

// Func for checking user login
// function isLoggedIn(req) {
//   if (req.user) {
//     return true;
//   }
//   return false;
// }

// Main Route
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  const category = req.query.cat;
  let sql_searchlist;
  // 초기 접속 화면이거나 '전체' 카테고리를 선택한 경우
  if (category === undefined || category === 'all') {
    sql_searchlist =
      'SELECT * FROM study_group ORDER BY create_date DESC LIMIT 0, 10';
  }
  // 다른 카테고리를 선택한 경우
  else {
    // 해당 카테고리에 맞는 데이터 DB에서 SELECT
    // 추후 category-filter value 수정되면 여기 삭제할 것!!!!!!!!!!!!!!!!
    switch (category) {
      case 'officiary':
        sql_searchlist =
          'SELECT * FROM study_group WHERE main_category="공무원" ORDER BY create_date DESC LIMIT 0, 10';
        break;
      case 'language':
        sql_searchlist =
          'SELECT * FROM study_group WHERE main_category="어학" ORDER BY create_date DESC LIMIT 0, 10';
        break;
      case 'employee':
        sql_searchlist =
          'SELECT * FROM study_group WHERE main_category="취업" ORDER BY create_date DESC LIMIT 0, 10';
        break;
      case 'exam':
        sql_searchlist =
          'SELECT * FROM study_group WHERE main_category="수능" ORDER BY create_date DESC LIMIT 0, 10';
        break;
      case 'hobby':
        sql_searchlist =
          'SELECT * FROM study_group WHERE main_category="취미" ORDER BY create_date DESC LIMIT 0, 10';
        break;
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
        'SELECT study_group_id, study_group_name FROM group_member WHERE user_id=? ORDER BY RAND() LIMIT 2';
      db.query(sql_mygroups, [id], (err, myResults) => {
        if (err) {
          next(err);
        }
        res.render('index', {
          isLoggedIn: true,
          path: req.baseUrl,
          searchlistGroups: searchlistResults,
          myGroups: myResults
        });
      });
    }
  });
});

module.exports = router;
