const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
require('dotenv').config();

exports.purchaseMembership = (request, response, next)=>{
    console.log("In purchaseMembership...");
    const rzp_instance = new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET
    })

    rzp_instance.orders.create({amount: 2600, currency: "INR"}, (error, rzp_order)=>{
        if(error)
            console.log(error);
        console.log("RZP ORDER...", rzp_order);
        request.user.createOrder({amount:26.00, order_id:rzp_order.id, status:"PENDING"})
            .then((createdOrder)=>{
                return response.json({createdOrder, key_id:rzp_instance.key_id })
            })
            .catch(error=>console.log(error));
    })
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
            return response.json({token: generateToken(updatedUser)});
        }

        await trans.commit();
        return;
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
    }
    
}
    
