const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const DatabaseServices = require('../services/databaseServices.js');

exports.getUsers = async (request, response, next)=>{
    const existingUsers = await DatabaseServices.getUsers();
    return response.json(existingUsers);
}

exports.postUser = async (request, response, next)=>{
    try{
        const existingUsers = await DatabaseServices.getUsers( {where:{email:request.body.email}} );
        if(existingUsers.length>0)
        {
            return response.status(403).json('User Already Exists...');
        }
        
        const hashData = await bcrypt.hash(request.body.password, 10);

        const createdUser = await DatabaseServices.createUser({
                username: request.body.username,
                email: request.body.email,
                password: hashData
            })
        return response.json("Sign Up successful...");                    
    }
    catch(error)
    {
        console.log(error);
        response.status(500).json("Somewthing went wrong...");
    }
        
}

function generateToken(user)
{
    return jwt.sign(
        JSON.stringify({id: user.id, username:user.username, ispremiumuser:user.ispremiumuser}),
        process.env.JWT_SECRET_KEY
    );
}

exports.postLogin = async (request, response, next)=>{
    try{
        const existingUsers = await DatabaseServices.getUsers({where:{email:request.body.email}});
        if(existingUsers.length>0)
        {
            const result = await bcrypt.compare(request.body.password, existingUsers[0].password)
            if(result)
                return response.json({token: generateToken(existingUsers[0])});
            else
                return response.status(401).json("Invalid Credentials...");
        }
        else
            return response.status(404).json("Email/User doesn't exist...");
    }
    catch(error)
    {
        console.log(error);
        response.status(500).json("Somewthing went wrong...");
    }
}