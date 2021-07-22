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
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('mypage', {
      isLoggedIn: isLoggedIn(req),
      path: req.baseUrl,
      nickname: req.user.nickname
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

module.exports = router;
