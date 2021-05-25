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
        mainCategory: [
          '추천',
          '전체',
          '공무원',
          '어학',
          '취업',
          '수능',
          '취미'
        ],
        middleCategory: [
          ['9급', '7급', '5급'],
          ['영어', '중국어', '일본어', '기타'],
          [
            '경영/사무',
            '마케팅',
            '반도체',
            'IT/인터넷',
            '디자인',
            '미디어',
            '기타'
          ],
          ['독서', '토론']
        ],
        data: results
      });
    }
  });
});

module.exports = router;
