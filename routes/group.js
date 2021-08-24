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
  let managerName = '';
  members.forEach(member => {
    if (member.is_manager) {
      managerName = member.nickname;
    }
  });
  return managerName;
}

function modifyDateFormat(comments) {
  return comments.map(comment => {
    const Date = comment.update_date;
    const year = String(Date.getFullYear()).slice(-2);
    const month = String(Date.getMonth() + 1).padStart(2, '0');
    const date = String(Date.getDate()).padStart(2, '0');
    const hour = String(Date.getHours()).padStart(2, '0');
    const min = String(Date.getMinutes()).padStart(2, '0');
    comment.update_date = `${year}-${month}-${date} ${hour}:${min}`;
    return comment;
  });
}

router.get('/info/:id', (req, res, next) => {
  const study_group_id = req.params.id;
  const { id } = req.user ? req.user : '';
  const sql_group = 'SELECT * FROM study_group WHERE id=?;';
  const sql_member = 'SELECT * FROM group_member WHERE study_group_id=?;';
  const sql_comment =
    'SELECT * FROM comment WHERE study_group_id=? ORDER BY create_date ASC';
  db.query(
    sql_group + sql_member + sql_comment,
    [study_group_id, study_group_id, study_group_id],
    (err, result) => {
      if (err) {
        next(err);
      }
      const study_group = result[0][0];
      const members = result[1];
      const comments = modifyDateFormat(result[2]);
      const managerName = getManagerName(members);
      const isMember = checkIsMember(id, members);
      res.render('group-info', {
        isLoggedIn: isLoggedIn(req),
        isMember: isMember,
        userId: id,
        groupId: study_group_id,
        manager: managerName,
        name: study_group.name,
        main: study_group.main_category,
        sub: study_group.sub_category,
        gender: study_group.gender,
        location: study_group.location,
        description: study_group.description,
        current: study_group.current_number,
        maximum: study_group.maximum_number,
        comments: comments
      });
    }
  );
});

router.post('/post-group-id', (req, res, next) => {
  const study_group_id = req.body;
  const sql_group = 'SELECT * FROM study_group WHERE id=?';
  db.query(sql_group, [study_group_id], (err, result) => {
    if (err) {
      next(err);
    }
    const study_group = result[0];
    const { current_number } = study_group;
    const { maximum_number } = study_group;
    if (current_number >= maximum_number) {
      console.log('비정상 접근 : 정원 초과');
      next(err);
    } else {
      const group_member_id = nanoid();
      const { id: user_id, nickname } = req.user;
      const { name: study_group_name } = study_group;
      const sql_member =
        'INSERT INTO group_member (id, user_id, study_group_id, is_manager, nickname, study_group_name, create_date) VALUES (?, ?, ?, ?, ?, ?, now());';
      const sql_update_member =
        'UPDATE study_group SET current_number=current_number+1 WHERE id=?';
      db.query(
        sql_member + sql_update_member,
        [
          group_member_id,
          user_id,
          study_group_id,
          0,
          nickname,
          study_group_name,
          study_group_id
        ],
        err => {
          if (err) {
            next(err);
          }
        }
      );
    }
  });
});

router.post('/create-comment', (req, res, next) => {
  const study_group_id = req.body.groupId;
  const message = req.body.message;
  const comment_id = nanoid();
  const { id, nickname } = req.user ? req.user : '';
  const update_date = modifyDateFormat([{ update_date: new Date() }])[0]
    .update_date;
  const sql_comment =
    'INSERT INTO comment (id, study_group_id, user_id, nickname, message, create_date, update_date) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
  db.query(
    sql_comment,
    [comment_id, study_group_id, id, nickname, message],
    err => {
      if (err) {
        next(err);
      }
      res.send([comment_id, nickname, update_date]);
    }
  );
});

router.post('/delete-comment', (req, res, next) => {
  const comment_id = req.body;
  const sql_comment = 'DELETE FROM comment WHERE id=?';
  db.query(sql_comment, [comment_id], err => {
    if (err) {
      next(err);
    }
  });
});

router.post('/check-is-creator', (req, res, next) => {
  const { id } = req.user ? req.user : '';
  const comment_id = req.body;
  if (id === comment_id) {
    res.send(true);
  }
});

module.exports = router;
