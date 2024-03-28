const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
require('dotenv').config();
const RzpServices = require('../services/rzpServices');
const DatabaseServices = require('../services/databaseServices.js');

exports.purchaseMembership = async (request, response, next)=>{
    console.log("In purchaseMembership...");
    try{
        const order_key_object = await RzpServices.createOrderInstance(request);
        return response.json(order_key_object);
    }
    catch(error)
    {
        console.log(error);
    }
}

function generateToken(user)
{
    return jwt.sign(
        JSON.stringify({id: user.id, username:user.username, ispremiumuser:user.ispremiumuser}),
        process.env.JWT_SECRET_KEY
    );
}

exports.updateTransactionStatus = async (request, response, next)=>{
    console.log("Status updated...", request.body);
    try{
        const updatedUser = await DatabaseServices.updateOrderStatus(request);
        if(updatedUser)
            return response.json({token: generateToken(updatedUser)});
        return;
    }
    catch(error)
    {
        console.log(error);
        return error;
    } 
}
    
