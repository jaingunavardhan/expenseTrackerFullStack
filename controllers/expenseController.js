const sequelize = require('../util/database.js');
const Expense = require('../models/expense.js');

exports.getExpenses = (request, response, next)=>{
    console.log('getExpenses...');
    Expense.findAll()
        .then(existingExpenses=>{
            console.log("existingExpenses...", existingExpenses);
            return response.json(existingExpenses);
        })
        .catch(error=>console.log(error));
}

exports.postExpense = (request, response, next)=>{
    console.log("postExpense...", request.body);
    Expense.create({
        amount: request.body.amount,
        description: request.body.description,
        category: request.body.category
    })
    .then(createdExpense=>{
        return response.json(createdExpense);
    })
    .catch(error=>console.log(error));
}

exports.deleteExpense = (request, response, next)=>{
    console.log("deleteExpense...", request.params.expenseId);
    Expense.findByPk(request.params.expenseId)
        .then(existingExpense=>{
            existingExpense.destroy()
                .then((deletedExpense)=>{
                    return response.json(deletedExpense);
                })
        })
        .catch(error=>console.log(error));
}