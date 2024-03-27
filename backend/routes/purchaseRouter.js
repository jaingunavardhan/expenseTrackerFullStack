const express = require('express');
const purchaseController = require('../controllers/purchaseController.js');
const authorization = require('../middleware/auth.js');

const router = express.Router();

router.get('/purchaseMembership', authorization, purchaseController.purchaseMembership);
router.post('/updateTransactionStatus', authorization, purchaseController.updateTransactionStatus);

module.exports = router;