const ForgotPassword = require('../models/forgotpassword');
const User = require('../models/user');
const path = require('path');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');

require('dotenv').config();

const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;


exports.postForgotPassword = async (request, response, next)=>{

    const usersList = await User.findAll({where:{email:request.body.email}});
    console.log(usersList);
    if(usersList.length>0)
    {
        const createdForgotPassword = await ForgotPassword.create({isactive:true, userId:usersList[0].id})
        console.log(createdForgotPassword);

        const transEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'jaingunavardhan@gmail.com',
            name: 'Gunavardhan Jain'
        }
    
        const receivers = [
            {
                email: `${request.body.email}`
            }
        ]
    
        transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Password Reset Link',
            htmlContent: `<h4><a href="http://localhost:4000/password/resetpassword/${createdForgotPassword.id}">Reset Password Here</a></h4>`,
        })
        .then(data=>{
            return response.json('Reset Link sent to Email')
        })
        .catch(error=>console.log(error));
    }
    else
        return response.status(403).json("User/Email doesn't exist");
}

exports.getResetPassword = async (request, response, next)=>{

    const id = request.params.resetID;
    const existingForgotPassword = await ForgotPassword.findByPk(id);
    if(existingForgotPassword)
    {
        if(existingForgotPassword.isactive == true)
        {
            response.send(
                `<html><body><form action='/password/updatepassword/${id}' method='get'>
                <label for="password">New Password :</label><br>
                    <input type="password" name="password" id="password" placeholder="Enter New Password" required><br>
                <button type="submit">Create New Password</button>`
            )
            response.end();
        }
        else
        {
            response.status(403).send("Link expired");
        }
    }
    else
    {
        response.status(403).send("Invalid Link")
    }
}

exports.getUpdatePassword = async (request, response, next)=>{
    //console.log("post reset...", request.body, request.params, request.query );
    const resetID = request.params.resetID;
    const newPassword = request.query.password;
    const trans = await sequelize.transaction();
    try
    {
        const resetRow = await ForgotPassword.findByPk(resetID);
        if(resetRow)
        {
            resetRow.isactive = false;
            const savedRow = await resetRow.save({transaction:trans});
            const userid = savedRow.userId;
            const hashPassword = await bcrypt.hash(newPassword, 10);
            const user = await User.findByPk(userid);
            user.password = hashPassword;
            await user.save({transaction:trans});

            await trans.commit();
            response.send("Password reset successful.. Proceed to login");
        }
    }
    catch(error)
    {
        console.log(error);
        await trans.rollback();
    }
}