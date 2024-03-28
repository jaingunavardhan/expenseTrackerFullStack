const DatabaseServices = require('../services/databaseServices.js');

exports.getLeaderboard = async (request, response, next)=>{
    console.log("Inside getLeaderboard...");
    try
    {
        const leaderboardObjects = await DatabaseServices.getUsers({
            attributes:['id', 'username', 'total_expenses'],
            order: [ ['total_expenses', 'DESC'] ],
            raw:true
        })
        console.log("premium leader....raw...", leaderboardObjects);
        return response.json(leaderboardObjects);
    }
    catch(error)
    {
        console.log(error);
    }    
}

