const express = require('express');

const router = express.Router();
const dbConfig = require('../config/database');

// Func for checking user login
function isLoggedIn(req) {
  if (req.user) {
    return true;
  }
  return false;
}

router.get('/info/:id', (req, res, next) => {
  const sql = 'SELECT * FROM study_group WHERE id=?';
  const id = req.params.id;
  dbConfig.db.query(sql, id, (err, results) => {
    if (err) {
      next(err);
    } else {
      res.render('study-info', {
        isLoggedIn: isLoggedIn(req),
        data: results[0]
      });
    }
  });
});

module.exports = router;
