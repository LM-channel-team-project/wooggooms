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
  const study_group_id = nanoid();
  const group_member_id = nanoid();
  const { id: manager, nickname } = req.user;
  const {
    name,
    location,
    gender,
    members,
    main_category,
    sub_category,
    description
  } = req.body;
  const maximum_number = parseInt(members);
  const sql_group =
    'INSERT INTO study_group (id, manager, name, main_category, sub_category, gender, location, description, current_number, maximum_number, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());';
  const sql_member =
    'INSERT INTO group_member (id, user_id, study_group_id, is_manager, nickname, study_group_name, create_date) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  db.query(
    sql_group + sql_member,
    [
      study_group_id,
      manager,
      name,
      main_category,
      sub_category,
      gender,
      location,
      description,
      1,
      maximum_number,
      group_member_id,
      manager,
      study_group_id,
      1,
      nickname,
      name
    ],
    err => {
      if (err) {
        next(err);
      }
      res.redirect('/mypage');
    }
  );
});

module.exports = router;
