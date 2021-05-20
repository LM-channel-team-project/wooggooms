/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

// Main Route
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('main.ejs', {
    mainCategory: ['추천', '전체', '공무원', '어학', '취업', '수능', '취미'],
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
    ]
  });
});
module.exports = router;
