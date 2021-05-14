const express = require('express');
const router = express.Router();
const create = require('../controllers/create');

// Create Page Routes
router.get("/", create.load);
router.post("/create_process", create.create);
module.exports = router;