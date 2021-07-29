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

router.get('/get-group', (req, res, next) => {
  const { id } = req.user;
  const sql_manager =
    'SELECT * FROM group_member WHERE user_id = ? AND is_manager = 1;';
  const sql_member =
    'SELECT * FROM group_member WHERE user_id = ? AND is_manager = 0';
  db.query(sql_manager + sql_member, [id, id], (err, result) => {
    if (err) {
      next(err);
    }
    res.json(result);
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
router.post('/group-edit', (req, res, next) => {
  const { study_group_id } = req.body;
  const sql_group = 'SELECT * FROM study_group WHERE id = ?;';
  const sql_member = 'SELECT * FROM group_member WHERE study_group_id = ?';
  db.query(
    sql_group + sql_member,
    [study_group_id, study_group_id],
    (err, result) => {
      if (err) {
        next(err);
      }
      const study_group = result[0][0];
      const member = result[1];
      res.render('group-edit', {
        id: study_group_id,
        name: study_group.name,
        location: study_group.location,
        gender: study_group.gender,
        members: study_group.maximum_number,
        main: study_group.main_category,
        sub: study_group.sub_category,
        member: member
      });
    }
  );
});

router.post('/edit_process', (req, res, next) => {
  const { id, name, main, sub, gender, location, members } = req.body;
  const sql_name = 'SELECT COUNT(*) as used FROM study_group WHERE name=?;';
  const sql_number = 'SELECT * FROM study_group WHERE id=?';
  db.query(sql_name + sql_number, [name, id], (err, result) => {
    if (err) {
      next(err);
    } else if (result[0][0].used && result[1][0].name !== name) {
      res.redirect('/mypage?status=invalidname');
    } else if (result[1][0].current_number > parseInt(members)) {
      res.redirect('/mypage?stauts=invlaidmembers');
    } else {
      const sql_edit =
        'UPDATE study_group SET name=?, main_category=?, sub_category=?, gender=?, location=?, maximum_number=? WHERE id=?';
      db.query(
        sql_edit,
        [name, main, sub, gender, location, members, id],
        err => {
          if (err) {
            next(err);
          }
          res.redirect('/mypage?status=complete');
        }
      );
    }
  });
});

module.exports = router;
