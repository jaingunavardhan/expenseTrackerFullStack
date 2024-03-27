const User = require('../models/user');
const sequelize = require('../util/database')

exports.getLeaderboard = async (request, response, next)=>{
    console.log("Inside getLeaderboard...");
    try
    {
        const leaderboardObjects = await User.findAll({
            attributes:['id', 'username', 'total_expenses'],
            order: [ ['total_expenses', 'DESC'] ]
        })
        return response.json(leaderboardObjects);
    }
    catch(error)
    {
        console.log(error);
    }    
}

