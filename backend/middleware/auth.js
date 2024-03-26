const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authorization = (request, response, next)=>{
    console.log("In auth...", request.body, request.headers);
    const id = jwt.verify(request.headers.token, "CandyCaramelo");
    User.findByPk(id)
        .then(user =>{
            console.log("user...", user);
            if(user==null)
                return response.status(401).json("Please Login...");
            request.user = user;
            next();
        })
        .catch(error=>console.log(error));
}

module.exports = authorization;