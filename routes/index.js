const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

// Mainpage Route
router.get("/", indexController);
module.exports = router;