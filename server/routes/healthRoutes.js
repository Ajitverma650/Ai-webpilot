const express = require('express');
const router = express.Router();
const { getHealth, getApiHealth } = require('../controllers/healthController');

router.get('/', getHealth);
router.get('/api', getApiHealth);


module.exports = router;