const sequelize = require('../util/database.js');
const Expense = require('../models/expense.js');

exports.getExpenses = (request, response, next)=>{
    console.log('getExpenses...');
    //Expense.findAll({where:{userId:request.user.id}}) //You can also fetch like this
    request.user.getExpenses()
        .then(existingExpenses=>{
            console.log("existingExpenses...", existingExpenses);
            return response.json(existingExpenses);
        })
        .catch(error=>console.log(error));
}

exports.postExpense = (request, response, next)=>{
    console.log("postExpense...", request.body);
    request.user.createExpense({
        amount: Number(request.body.amount).toFixed(2),
        description: request.body.description,
        category: request.body.category
    })
    .then(createdExpense=>{
        return response.json(createdExpense);
    })
    .catch(error=>console.log(error));
}

exports.deleteExpense = (request, response, next)=>{
    console.log("deleteExpense...", request.params);
    request.user.getExpenses({where:{id:request.params.expenseId}})
        .then(existingExpense=>{
            console.log('delete- existingExpense...', existingExpense[0]);
            existingExpense[0].destroy()
                .then((deletedExpense)=>{
                    return response.json(deletedExpense);
                })
        })
        .catch(error=>console.log(error));
}