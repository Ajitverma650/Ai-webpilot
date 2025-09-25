const express = require('express');
const router = express.Router();
const { generateWebApp } = require('../controllers/generateController');

router.post('/', generateWebApp);

module.exports = router;