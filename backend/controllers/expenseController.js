const DatabaseServices = require('../services/databaseServices.js');

exports.getExpenses = async (request, response, next)=>{
    const existingExpenses = await DatabaseServices.getExpenses( {where:{userId:request.user.id}, raw:true} );
    return response.json(existingExpenses);
}

exports.postExpense = async (request, response, next)=>{
    const createdExpense = await DatabaseServices.addExpense(request)
    return response.json(createdExpense);
}

exports.deleteExpense = async (request, response, next)=>{
    return response.json( await DatabaseServices.deleteExpense(request) );
}