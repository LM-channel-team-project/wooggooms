const express = require('express');
const { nanoid } = require('nanoid');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();


// Create Route
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('create', {
      path: req.baseUrl // 'create'
    });
  }
});

router.post('/create_process', (req, res, next) => {
  const id = nanoid();
  const manager = req.user.id;
  const { name, location, gender, members, main_category, sub_category, description } = req.body;
  const maximum_number = parseInt(members);
  const sql =
    'INSERT INTO study_group (id, manager, name, main_category, sub_category, gender, location, description, current_number, maximum_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, manager, name, main_category, sub_category, gender, location, description, 1, maximum_number], err => {
    if(err) {
      next(err);
    }
    res.redirect('/mypage');
  });
});

module.exports = router;
