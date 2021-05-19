const express = require('express');

const router = express.Router();

// Mypage Route
router.get('/', (req, res, next) => {
  res.render('mypage');
});
module.exports = router;
