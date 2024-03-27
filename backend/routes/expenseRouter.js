const express = require('express');
const expenseController = require('../controllers/expenseController.js');
const authorization = require('../middleware/auth.js');

const router = express.Router();

router.get('/', authorization, expenseController.getExpenses);
router.post('/', authorization, expenseController.postExpense);
router.delete('/:expenseId', authorization, expenseController.deleteExpense);

module.exports = router;