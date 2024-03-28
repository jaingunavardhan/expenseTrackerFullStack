const express = require('express');
const downloadController = require('../controllers/downloadController.js');
const authorization = require('../middleware/auth.js');

const router = express.Router();

router.get('/old', authorization, downloadController.getAllLinks);
router.get('/', authorization, downloadController.getLink);

module.exports = router;