const ForgotPassword = require('../models/forgotpassword');
const User = require('../models/user');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
const DatabaseServices = require('../services/databaseServices');
const MailingServices = require('../services/mailingServices');

exports.postForgotPassword = async (request, response, next)=>{
    try{
        const usersList = await DatabaseServices.getUsers({where:{email:request.body.email}});
        if(usersList.length>0)
        {
            const createdForgotPassword = await DatabaseServices.createForgotPassword({isactive:true, userId:usersList[0].id});
            const receivers = [
                {
                    email: `${request.body.email}`
                }
            ]
        
            await MailingServices.sendResetLink(receivers, createdForgotPassword.id);
            return response.json('Reset Link sent to Email');
        }
        else
            return response.status(403).json("User/Email doesn't exist");
    }
    catch(error)
    {
        console.log(error);
        return error;
    }
}

exports.getResetPassword = async (request, response, next)=>{
    const id = request.params.resetID;
    const existingForgotPasswords = await DatabaseServices.getForgotPasswords({where:{id:id}});
    console.log(existingForgotPasswords);
    if(existingForgotPasswords.length>0)
    {   
        const existingForgotPassword = existingForgotPasswords[0];
        if(existingForgotPassword.isactive == true)
        {
            response.send(
                `<html><body><form action='/password/updatepassword/${id}' method='get'>
                <label for="password">New Password :</label><br>
                    <input type="password" name="password" id="password" placeholder="Enter New Password" required><br><br>
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
    const resetID = request.params.resetID;
    const newPassword = request.query.password;
    const hashPassword = await bcrypt.hash(newPassword, 10);
    try{
        await DatabaseServices.updateForgotPassword(resetID, hashPassword);
        response.json("Password Reset Successful...Please login...");
    }
    catch(error)
    {
        console.log(error);
        return error;
    }
}