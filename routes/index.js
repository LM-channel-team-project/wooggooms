const express = require('express');

const router = express.Router();
const dbConfig = require('../config/database');

// Main Route
router.get('/', (req, res, next) => {
  const selectGroupList = 'SELECT * FROM study_group';
  dbConfig.db.query(selectGroupList, (err, results) => {
    if (err) {
      next(err);
    } else {
      res.render('main', { data: results });
    }
  });
});

module.exports = router;
