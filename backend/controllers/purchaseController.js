const Razorpay = require('razorpay');
const Order = require('../models/order');
const { response } = require('express');

exports.purchaseMembership = (request, response, next)=>{
    console.log("In purchaseMembership...");
    const rzp_instance = new Razorpay({
        key_id: 'rzp_test_LvbKyvSSTHDx8m',
        key_secret: 'KUTRzB0AFTrCa9k716MkE7kA'
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

exports.updateTransactionStatus = (request, response, next)=>{
    console.log("Status updated...", request.body);
    
    if(request.body.status == 'SUCCESS')
    {
        request.user.ispremiumuser = true;
        request.user.save()
            .then((updatedUser)=>{
                console.log("user updated...", updatedUser);
                return response.json({ispremiumuser:request.user.ispremiumuser})
            })
            .catch(error=>console.log(error));
    }
        
    request.user.getOrders({where:{order_id:request.body.order_id}})
        .then(existingOrdersList=>{
            console.log(existingOrdersList);
            const existingOrder = existingOrdersList[0];
            existingOrder.status=request.body.status;
            existingOrder.payment_id=request.body.payment_id;
            existingOrder.save()
                .then(()=>{
                    return;
                })
        })
        .catch(error=>console.log(error));
}
    
