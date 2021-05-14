/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const path = require('path');

// eslint-disable-next-line camelcase
const views_options = {
  root: path.join(__dirname, '../views')
};

router.get('/', (req, res, next) => {
  res.sendFile('main.html', views_options, err => {
    if (err) {
      next(err);
    } else {
      console.log('Sent: main.html');
    }
  });
});
module.exports = router;
