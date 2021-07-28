const express = require('express');
const { nanoid } = require('nanoid');
const dbConfig = require('../config/database');
const { db } = dbConfig;

const router = express.Router();

function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

function checkIsMember(userId, members) {
  return members.some(member => {
    return userId === member.user_id;
  });
}

function getManagerName(members) {
  let result = '';
  members.forEach(member => {
    if (member.is_manager) {
      result = member.nickname;
    }
  });
  return result;
}

router.get('/info/test', (req, res, next) => {
  const study_group_id = 'vhdWO65xB7PE5rEl99yDf'; /* test */
  const { id } = req.user ? req.user : '';
  const sql_group = 'SELECT * FROM study_group WHERE id=?;';
  const sql_member = 'SELECT * FROM group_member WHERE study_group_id=?';
  db.query(
    sql_group + sql_member,
    [study_group_id, study_group_id],
    (err, result) => {
      if (err) {
        next(err);
      }
      const study_group = result[0][0];
      const members = result[1];
      const managerName = getManagerName(members);
      const isMember = checkIsMember(id, members);
      res.render('group-info', {
        isLoggedIn: isLoggedIn(req),
        isMember: isMember,
        groupId: study_group_id,
        manager: managerName,
        name: study_group.name,
        main: study_group.main_category,
        sub: study_group.sub_category,
        gender: study_group.gender,
        location: study_group.location,
        description: study_group.description,
        current: study_group.current_number,
        maximum: study_group.maximum_number
      });
    }
  );
});

router.post('/post-group-id', (req, res, next) => {
  const group_member_id = nanoid();
  const study_group_id = req.body;
  const { id: user_id, nickname } = req.user;
  const sql_member =
    'INSERT INTO group_member (id, user_id, study_group_id, is_manager, nickname) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql_member,
    [group_member_id, user_id, study_group_id, 0, nickname],
    err => {
      if (err) {
        next(err);
      }
    }
  );
});

module.exports = router;
