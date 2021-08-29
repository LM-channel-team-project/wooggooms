const express = require('express');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();

router.get('/:category', (req, res, next) => {
  const category = req.params.category;
  const isMainCategory = [
    '전체',
    '공무원',
    '어학',
    '취업',
    '수능',
    '취미'
  ].includes(category);

  let sql_searchlist;
  if (isMainCategory) {
    if (category === '전체') {
      sql_searchlist =
        'SELECT * FROM study_group ORDER BY create_date DESC LIMIT 0, 10';
    } else {
      sql_searchlist = `SELECT * FROM study_group WHERE main_category='${category}' ORDER BY create_date DESC LIMIT 0, 10`;
    }
  } else {
    sql_searchlist = `SELECT * FROM study_group WHERE sub_category='${category}' ORDER BY create_date DESC LIMIT 0, 10`;
  }
  db.query(sql_searchlist, (err, results) => {
    if (err) {
      next(err);
    }
    res.json(results);
  });
});

module.exports = router;
