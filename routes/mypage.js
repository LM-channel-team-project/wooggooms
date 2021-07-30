const express = require('express');
const dbConfig = require('../config/database');

const { db } = dbConfig;

const router = express.Router();

// Mypage Route
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    const { id } = req.user;
    const sql_leadgroup =
      'SELECT * FROM study_group WHERE id IN (SELECT * FROM (SELECT study_group_id FROM group_member WHERE user_id=? AND is_manager=1 ORDER BY create_date LIMIT 0, 4) as tmp);';
    const sql_joingroup =
      'SELECT * FROM study_group WHERE id IN (SELECT * FROM (SELECT study_group_id FROM group_member WHERE user_id=? AND is_manager=0 ORDER BY create_date LIMIT 0, 4) as tmp)';
    db.query(sql_leadgroup + sql_joingroup, [id, id], (err, results) => {
      if (err) {
        next(err);
      }
      res.render('mypage', {
        isLoggedIn: true,
        path: req.baseUrl,
        nickname: req.user.nickname,
        leadgroups: results[0],
        joingroups: results[1]
      });
    });
  }
});

// get-joingroups Fetch 요청 처리
router.get('/get-joingroups', (req, res, next) => {
  const { id } = req.user;
  const idx = parseInt(req.query.load);
  const sql = `SELECT * FROM study_group WHERE id IN (SELECT * FROM (SELECT study_group_id FROM group_member WHERE user_id=? AND is_manager=0 ORDER BY create_date LIMIT ${idx}, 4) as tmp)`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      next(err);
    }
    res.json(results);
  });
});

// get-leadgroups Fetch 요청 처리
router.get('/get-leadgroups', (req, res, next) => {
  const { id } = req.user;
  const idx = parseInt(req.query.load);
  const sql = `SELECT * FROM study_group WHERE id IN (SELECT * FROM (SELECT study_group_id FROM group_member WHERE user_id=? AND is_manager=1 ORDER BY create_date LIMIT ${idx}, 4) as tmp)`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      next(err);
    }
    res.json(results);
  });
});

// Edit my-info Route
router.get('/edit-myinfo', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('edit-myinfo', {
      nickname: req.user.nickname,
      userEmail: req.user.email,
      isSNSUser: req.user.sns_id
    });
  }
});

// edit-nickname process Route
router.post('/edit-nickname', (req, res, next) => {
  const { id } = req.user;
  const newNickname = req.body.nickname;
  const sql = 'SELECT COUNT(*) as used FROM user WHERE nickname=?';
  db.query(sql, [newNickname], (err, result) => {
    if (err) {
      next(err);
    }
    if (result[0].used) {
      res.redirect('/mypage/edit-myinfo?status=unvalidnick');
    } else {
      const sql = 'UPDATE user SET nickname=? WHERE id=?';
      db.query(sql, [newNickname, id], err => {
        if (err) {
          next(err);
        }
        res.redirect('/mypage/edit-myinfo?status=validnick');
      });
    }
  });
});

// edit-email process Route
router.post('/edit-email', (req, res, next) => {
  const { id } = req.user;
  const { email } = req.body;
  const sql = 'UPDATE user SET email=? WHERE id=?';
  db.query(sql, [email, id], err => {
    if (err) {
      next(err);
    }
    res.redirect('/mypage/edit-myinfo?status=validemail');
  });
});

// edit-pwd process Route
router.post('/edit-pwd', (req, res, next) => {
  const { id } = req.user;
  const { pwd } = req.body;
  const sql = 'UPDATE user SET password=? WHERE id=?';
  db.query(sql, [pwd, id], err => {
    if (err) {
      next(err);
    }
    res.redirect('/mypage/edit-myinfo?status=validpwd');
  });
});

// Group-edit Route
router.get('/group-edit', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('group-edit');
  }
});

module.exports = router;
