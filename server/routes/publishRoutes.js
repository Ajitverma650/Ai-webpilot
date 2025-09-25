const express = require('express');
const router = express.Router();
const { publishToNetlify, publishToGithub } = require('../controllers/publishController');

router.post('/netlify', publishToNetlify);
router.post('/github', publishToGithub);

module.exports = router;