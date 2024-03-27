const sequelize = require('../util/database.js');
const Expense = require('../models/expense.js');

exports.getExpenses = (request, response, next)=>{
    console.log('getExpenses...');
    //Expense.findAll({where:{userId:request.user.id}}) //You can also fetch like this
    request.user.getExpenses()
        .then(existingExpenses=>{
            return response.json(existingExpenses);
        })
        .catch(error=>console.log(error));
}

exports.postExpense = async (request, response, next)=>{
    console.log("postExpense...", request.body);
    request.user.createExpense({
        amount: Number(request.body.amount).toFixed(2),
        description: request.body.description,
        category: request.body.category
    })
    .then(createdExpense=>{
        if(request.user.total_expenses!=null)
            request.user.total_expenses = Number(request.user.total_expenses) + Number(createdExpense.amount);
        else
            request.user.total_expenses = Number(createdExpense.amount).toFixed(2);
        request.user.save()
            .then(()=>{
                console.log(createdExpense.amount);
                console.log(request.user);
                return response.json(createdExpense);
            })
            .catch()
    })
    .catch(error=>console.log(error));
}

exports.deleteExpense = (request, response, next)=>{
    console.log("deleteExpense...", request.params);
    request.user.getExpenses({where:{id:request.params.expenseId}})
        .then(existingExpense=>{
            console.log('delete- existingExpense...', request.user.total_expenses, existingExpense[0].amount);
            request.user.total_expenses = Number(request.user.total_expenses) - Number(existingExpense[0].amount);
            request.user.save()
                .then(()=>{
                    existingExpense[0].destroy()
                    .then((deletedExpense)=>{
                        return response.json(deletedExpense);
                    })                    
                })            
        })
        .catch(error=>console.log(error));
}