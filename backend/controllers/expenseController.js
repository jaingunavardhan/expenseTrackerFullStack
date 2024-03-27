const sequelize = require('../util/database.js');
const Expense = require('../models/expense.js');

exports.getExpenses = (request, response, next)=>{
    console.log('getExpenses...');
    //Expense.findAll({where:{userId:request.user.id}}) //You can also fetch like this
    request.user.getExpenses({
        attributes:['id', 'amount', 'description', 'category']
    })
    .then(existingExpenses=>{
        console.log(existingExpenses);
        return response.json(existingExpenses);
    })
    .catch(error=>console.log(error));        
}

exports.postExpense = async (request, response, next)=>{
    console.log("postExpense...", request.body);
    const trans = await sequelize.transaction();
    try{
        const createdExpense = await request.user.createExpense({
            amount: Number(request.body.amount).toFixed(2),
            description: request.body.description,
            category: request.body.category
        }, {transaction:trans})

        if(request.user.total_expenses!=null)
        {
            const spam = Number(request.user.total_expenses) + Number(createdExpense.amount)
            request.user.total_expenses = Number(spam).toFixed(2);
        }
        else
            request.user.total_expenses = Number(createdExpense.amount).toFixed(2);   
        await request.user.save({transaction:trans});

        await trans.commit();

        return response.json(createdExpense);
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
    }
}

exports.deleteExpense = async (request, response, next)=>{
    console.log("deleteExpense...", request.params);
    const trans = await sequelize.transaction();
    try{
        const existingExpenses = await request.user.getExpenses({where:{id:request.params.expenseId}})
        const spam = Number(request.user.total_expenses) - Number(existingExpenses[0].amount);
        request.user.total_expenses = Number(spam).toFixed(2);        
        
        await request.user.save({transaction:trans});

        await existingExpenses[0].destroy({transaction:trans});

        await trans.commit();
        return response.json();    
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
    }
}