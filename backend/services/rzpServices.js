const Razorpay = require('razorpay');
require('dotenv').config();
const DatabaseServices = require('../services/databaseServices.js');

exports.createOrderInstance = async (request)=>{
    try{
        const rzp_instance = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        })
    
        const rzp_order = await rzp_instance.orders.create({amount: 2600, currency: "INR"});

        const createdOrder = await DatabaseServices.createOrder({
            amount:26.00,
            order_id:rzp_order.id,
            status:"PENDING",
            userId: request.user.id
        })
        return ({createdOrder, key_id:rzp_instance.key_id});
    }
    catch(error)
    {
        console.log(error);
        return error;
    }
}