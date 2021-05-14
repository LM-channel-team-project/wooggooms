const express = require('express');
const router = express.Router();
const mypageController = require('../controllers/mypage');

// Mypage Route
router.get("/", mypageController.load);
module.exports = router;