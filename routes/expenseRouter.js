const express = require('express');
const expenseController = require('../controllers/expenseController.js');

const router = express.Router();

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.postExpense);
router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;