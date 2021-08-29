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
router.get('/group-edit/:id', (req, res, next) => {
  const study_group_id = req.params.id;
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

router.post('/name-check', (req, res, next) => {
  const name = req.body.split(',')[0];
  const id = req.body.split(',')[1];
  const sql_name = 'SELECT COUNT(*) as used FROM study_group WHERE name=?;';
  const sql_number = 'SELECT * FROM study_group WHERE id=?';
  db.query(sql_name + sql_number, [name, id], (err, result) => {
    if (err) {
      next(err);
    }
    if (result[0][0].used && result[1][0].name !== name) {
      res.send('0');
    } else {
      res.send('1');
    }
  });
});

router.post('/edit_process', (req, res, next) => {
  // { id, name, main, sub, gender, location, members }
  const studyInfo = req.body.split(',');
  const sql_number = 'SELECT * FROM study_group WHERE id=?';
  db.query(sql_number, [studyInfo[0]], (err, result) => {
    if (err) {
      next(err);
    } else if (result[0].current_number > parseInt(studyInfo[6])) {
      res.send('0');
    } else {
      const sql_edit =
        'UPDATE study_group SET name=?, main_category=?, sub_category=?, gender=?, location=?, maximum_number=? WHERE id=?';
      db.query(
        sql_edit,
        [
          studyInfo[1],
          studyInfo[2],
          studyInfo[3],
          studyInfo[4],
          studyInfo[5],
          studyInfo[6],
          studyInfo[0]
        ],
        err => {
          if (err) {
            next(err);
          }
          res.send('1');
        }
      );
    }
  });
});

router.post('/kickout', (req, res, next) => {
  const memberId = req.body;
  const sql_member = 'SELECT * FROM group_member WHERE id=?';
  db.query(sql_member, [memberId], (err, result) => {
    if (err) {
      next(err);
    } else {
      if (result[0].is_manager) {
        res.send(['ismanager']);
      } else {
        // Kickout 이후 current_number -1
        const groupId = result[0].study_group_id;
        const sql_current_number = 'SELECT * FROM study_group WHERE id=?';
        db.query(sql_current_number, [groupId], (err, result) => {
          if (err) {
            next(err);
          } else {
            const currentNum = result[0].current_number;
            const sql_update_number =
              'UPDATE study_group SET current_number=? WHERE id=?';
            db.query(
              sql_update_number,
              [currentNum - 1, groupId],
              (err, result) => {
                if (err) next(err);
              }
            );
          }
        });
        const sql_kickout = 'DELETE FROM group_member WHERE id=?';
        db.query(sql_kickout, [memberId], err => {
          if (err) {
            next(err);
          }
          res.send(['kickout']);
        });
      }
    }
  });
});
module.exports = router;
