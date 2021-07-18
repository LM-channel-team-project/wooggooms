const express = require('express');

const router = express.Router();
const path = require('path');

const views_options = {
  root: path.join(__dirname, '../views')
};

// Create Route
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/sign-in');
  } else {
    res.render('create', {
      path: req.baseUrl // 'create'
    });
  }
});

router.post('/create_process', (req, res) => {
  // Create DB table
  res.redirect('/mypage');
});
module.exports = router;
