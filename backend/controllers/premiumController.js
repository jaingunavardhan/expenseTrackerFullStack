const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database')

exports.getLeaderboard = async (request, response, next)=>{
    console.log("Inside getLeaderboard...");
    try
    {
        const leaderboardObjects = await User.findAll(
            {
                attributes: ['id', 'username', [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_expenses'] ],
                include: [
                    {
                        model: Expense,
                        attributes: []
                    }
                ],
                group: ['user.id'],
                order: [ ['total_expenses', 'DESC'] ]
            }
        )
        return response.json(leaderboardObjects);
    }
    catch(error)
    {
        console.log(error);
    }
}

