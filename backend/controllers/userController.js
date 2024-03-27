const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = (request, response, next)=>{
    User.findAll()
        .then(existingUsers=>{
            return response.json(existingUsers);
        })
        .catch(error=>console.log(error));
}

exports.postUser = async (request, response, next)=>{
    console.log("postUser...", request.body);
    try{
        const existingUsers = await User.findAll( {where:{email:request.body.email}});
        console.log("existingUsers...", existingUsers.length, existingUsers);
        if(existingUsers.length>0)
        {
            console.log("User Already Exists...");
            return response.status(403).json('User Already Exists...');
        }
        console.log("User not exists... creating user...")
        
        const hashData = await bcrypt.hash(request.body.password, 10);

        const createdUser = await User.create({
                username: request.body.username,
                email: request.body.email,
                password: hashData
            })
        console.log("createdUser...", createdUser);
        return response.json("Sign Up successful...");                    
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
        "CandyCaramelo"
    );
}

exports.postLogin = async (request, response, next)=>{
    console.log("postLogin...", request.body);
    try{
        const existingUsers = await User.findAll({where:{email:request.body.email}})
        console.log("Existing Users...", existingUsers.length, existingUsers);
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
    }
}