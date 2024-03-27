const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authorization = (request, response, next)=>{
    try
    {
        console.log("In auth...", request.body, request.headers);
        const user = jwt.verify(request.headers.token, "CandyCaramelo");
        User.findByPk(user.id)
            .then(user =>{
                if(user==null)
                    return response.status(401).json("Please Login...");
                request.user = user;
                next();
            })
            .catch(error=>{
                console.log(error);
                return response.status(500).json(error);
            }) 
    }
    catch(error)
    {
        return response.status(401).json(error);
    }
       
}

module.exports = authorization;