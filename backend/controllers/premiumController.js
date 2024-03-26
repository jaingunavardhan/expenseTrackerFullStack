const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (request, response, next)=>{
    console.log("Inside getLeaderboard...");
    try
    {
        const existingExpenses = await Expense.findAll();
        const map = new Map();
        for(var i=0; i<existingExpenses.length; i++)
        {
            if( map.has(existingExpenses[i].userId) )
            {
                map.set( existingExpenses[i].userId, map.get(existingExpenses[i].userId) + existingExpenses[i].amount )
            }
            else
                map.set( existingExpenses[i].userId, existingExpenses[i].amount )
        }
        const sorted = Array.from(map).sort( (a,b)=>b[0]-a[0]);

        const arrayOfObjects = [];
        for(let i=0; i<sorted.length; i++)
        {
            const user = await User.findByPk(sorted[i][0])    
            arrayOfObjects.push({username:user.username, amount:sorted[i][1]});
            console.log(arrayOfObjects);
        }
        return response.json(arrayOfObjects);
    }
    catch(error)
    {
        console.log(error);
    }
}

