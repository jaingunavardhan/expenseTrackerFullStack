const sequelize = require('../util/database.js');
const User = require('../models/user.js');
const { type } = require('os');

exports.getUsers = (request, response, next)=>{
    User.findAll()
        .then(existingUsers=>{
            return response.json(existingUsers);
        })
        .catch(error=>console.log(error));
}

exports.postUser = (request, response, next)=>{
    console.log("postUser...", request.body);
    User.findAll()
        .then(existingUsers=>{
            console.log("existingUsers...", existingUsers);
            for(var i=0; i<existingUsers.length; i++)
            {
                if(existingUsers[i].email == request.body.email)
                {
                    console.log("User Already Exits...");
                    return response.json('User Already Exists...');
                }
            }
            console.log("User not exists... creating user...")
            User.create({
                username: request.body.username,
                email: request.body.email,
                password: request.body.password
            })
            .then(createdUser=>{
                console.log("createdUser...", createdUser);
                return response.json("Sign Up successful...");
            })
        })
        .catch(error=>console.log(error));
}

exports.postLogin = (request, response, next)=>{
    console.log("postLogin...", request.body);
    User.findAll()
        .then(existingUsers=>{
            let isEmail = false;
            for(var i=0; i<existingUsers.length; i++)
            {
                if(existingUsers[i].email == request.body.email)
                {
                    isEmail = true;
                    if(existingUsers[i].password == request.body.password)
                        return response.json("Logged In successfully...");
                    else
                        return response.status(401).json("Invalid Credentials...");
                }
            }
            if(isEmail == false)
            {
                return response.status(404).json("Email/User doesn't exist...");
            }
        })
        .catch(error=>console.log(error));
}