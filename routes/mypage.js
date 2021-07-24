const express = require('express');
const dbConfig = require('../config/database');

const { db } = dbConfig;

const router = express.Router();

// Func for checking user login
function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

// Mypage Route
let idx = 0;
let dataArray = [];
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  }
  // 다른 페이지에서 마이페이지로 접속한 경우 (= 쿼리 스트링이 없다)
  if (!req.query.reload) {
    idx = 0;
    dataArray = [];
    const sql = `SELECT * FROM study_group WHERE idx BETWEEN ${idx + 1} AND ${
      idx + 4
    }`;
    console.log('idx: ', idx);
    db.query(sql, (err, results) => {
      if (err) {
        next(err);
      }
      idx += 4;
      dataArray.push(...results);
      res.render('mypage', {
        isLoggedIn: isLoggedIn(req),
        path: req.baseUrl,
        nickname: req.user.nickname,
        dataArray: dataArray
      });
    });
  }
  // 마이페이지에서 리스트 갱신이 실행된 경우 (= /mypage?reload=true)
  if (req.query.reload === 'true') {
    const sql = `SELECT * FROM study_group WHERE idx BETWEEN ${idx + 1} AND ${
      idx + 4
    }`;
    console.log('idx: ', idx);
    db.query(sql, (err, results) => {
      if (err) {
        next(err);
      }
      idx += 4;
      dataArray.push(...results);
      res.render('mypage', {
        isLoggedIn: isLoggedIn(req),
        path: req.baseUrl,
        nickname: req.user.nickname,
        dataArray: dataArray
      });
    });
  }
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
