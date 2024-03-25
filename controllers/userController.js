const sequelize = require('../util/database.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

exports.getUsers = (request, response, next)=>{
    User.findAll()
        .then(existingUsers=>{
            return response.json(existingUsers);
        })
        .catch(error=>console.log(error));
}

exports.postUser = (request, response, next)=>{
    console.log("postUser...", request.body);
    User.findAll( {where:{email:request.body.email}} )
        .then(existingUsers=>{
            console.log("existingUsers...", existingUsers.length, existingUsers);
            if(existingUsers.length>0)
            {
                console.log("User Already Exists...");
                return response.json('User Already Exists...');
            }
            console.log("User not exists... creating user...")
            
            bcrypt.hash(request.body.password, 10, (error, hashData)=>{
                User.create({
                    username: request.body.username,
                    email: request.body.email,
                    password: hashData
                })
                .then(createdUser=>{
                    console.log("createdUser...", createdUser);
                    return response.json("Sign Up successful...");
                })  
            })         
        })
        .catch(error=>console.log(error));
}

exports.postLogin = (request, response, next)=>{
    console.log("postLogin...", request.body);
    User.findAll({where:{email:request.body.email}})
        .then(existingUsers=>{
            console.log("Existing Users...", existingUsers.length, existingUsers);
            if(existingUsers.length>0)
            {
                bcrypt.compare(request.body.password, existingUsers[0].password, (error, result)=>{
                    if(result)
                        return response.json("Logged In successfully...");
                    else
                        return response.status(401).json("Invalid Credentials...");
                })                        
            }
            else
                return response.status(404).json("Email/User doesn't exist...");
        })
        .catch(error=>console.log(error));
}