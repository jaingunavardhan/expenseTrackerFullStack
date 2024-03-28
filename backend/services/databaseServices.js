const sequelize = require('../util/database.js');
const User = require('../models/user');
const Expense = require('../models/expense');
const Order = require('../models/order.js');
const ForgotPassword = require('../models/forgotpassword.js');
const Fileurl = require('../models/fileurl.js');

exports.getUsers = async (conditions)=>{
    return await User.findAll(conditions);
}

exports.createUser = async (userDetails)=>{
    return await User.create(userDetails);
}



exports.getExpenses = async (conditions)=>{
    return await Expense.findAll(conditions);
}

exports.addExpense = async (request)=>{
    const trans = await sequelize.transaction();
    try{
        const date = new Date();
        const createdExpense = await request.user.createExpense({
            amount: Number(request.body.amount).toFixed(2),
            description: request.body.description,
            category: request.body.category,
            date: date.toDateString(),
            month: date.toLocaleDateString('default', {month:'long'}),
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

        return createdExpense;
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
        return error;
    }
}

exports.deleteExpense = async (request)=>{
    const trans = await sequelize.transaction();
    try{
        const existingExpenses = await request.user.getExpenses({where:{id:request.params.expenseId}})
        const spam = Number(request.user.total_expenses) - Number(existingExpenses[0].amount);
        request.user.total_expenses = Number(spam).toFixed(2);        
        
        await request.user.save({transaction:trans});

        await existingExpenses[0].destroy({transaction:trans});

        await trans.commit();
        return;    
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
        return error;
    }
}



exports.createOrder = async (orderDetails)=>{
    const createdOrder = await Order.create(orderDetails);
    return createdOrder;
}

exports.updateOrderStatus = async (request)=>{
    const trans = await sequelize.transaction();
    try{
        
        const existingOrdersList = await request.user.getOrders({where:{order_id:request.body.order_id}});
        console.log(existingOrdersList);
        const existingOrder = existingOrdersList[0];
        existingOrder.status=request.body.status;
        existingOrder.payment_id=request.body.payment_id;
        await existingOrder.save({transaction:trans});
                
        if(request.body.status == 'SUCCESS')
        {
            request.user.ispremiumuser = true;
            const updatedUser = await request.user.save({transaction:trans});
            
            await trans.commit();
            return updatedUser;
        }

        await trans.commit();
        return;
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
        return error;
    }
}



exports.createForgotPassword = async (forgotDetails)=>{
    const createdForgotPassword = await ForgotPassword.create(forgotDetails);
    return createdForgotPassword;
}

exports.getForgotPasswords = async (conditions)=>{
    const existingForgotPasswords = await ForgotPassword.findAll(conditions);
    return existingForgotPasswords;
}

exports.updateForgotPassword = async (resetID, hashPassword)=>{
    const trans = await sequelize.transaction();
    try
    {
        const resetRow = await ForgotPassword.findByPk(resetID);
        if(resetRow)
        {
            resetRow.isactive = false;
            const savedRow = await resetRow.save({transaction:trans});
            const userid = savedRow.userId;
            
            const user = await User.findByPk(userid);
            user.password = hashPassword;
            await user.save({transaction:trans});

            await trans.commit();
            return;
        }
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
        return error;
    }
}



exports.addFileurl = async (url, request)=>{
    const createdFileurl = await Fileurl.create({url:url, userId:request.user.id});
    return createdFileurl;
}

exports.getFileurls = async (request)=>{
    const existingFileurls = request.user.getFileurls({
        attributes:['url'],
        raw:true
    });
    return existingFileurls;
}