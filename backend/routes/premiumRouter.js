const express = require('express');
const premiumController = require('../controllers/premiumController.js');
const authorization = require('../middleware/auth.js');

const router = express.Router();

router.get('/getLeaderboard', authorization, premiumController.getLeaderboard);

module.exports = router;