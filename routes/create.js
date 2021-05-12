const express = require('express');

const router = express.Router();
const path = require('path');

// eslint-disable-next-line camelcase
const views_options = {
  root: path.join(__dirname, '../views')
};

router.get('/', (req, res, next) => {
  res.sendFile('create.html', views_options, err => {
    if (err) {
      next(err);
    } else {
      console.log('Sent: create.html');
    }
  });
});

router.post('/create_process', (req, res) => {
  res.redirect('/mypage');
});
module.exports = router;
