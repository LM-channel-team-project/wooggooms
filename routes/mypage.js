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
        isLoggedIn: isLoggedIn(req),
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
  console.log(req.body);
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
          res.redirect('/mypage?status=edit');
        }
      );
    }
  });
});

router.post('/kickout', (req, res, next) => {
  console.log(req.body);
  const { memberid } = req.body;
  const sql_member = 'SELECT * FROM group_member WHERE id=?';
  db.query(sql_member, [memberid], (err, result) => {
    if (err) {
      next(err);
    } else if (result[0].is_manager) {
      res.redirect('/mypage?status=ismanager');
    } else {
      const sql_kickout = 'DELETE FROM group_member WHERE id=?';
      db.query(sql_kickout, [memberid], err => {
        if (err) {
          next(err);
        }
        res.redirect('/mypage?status=kickout');
      });
    }
  });
});
module.exports = router;
