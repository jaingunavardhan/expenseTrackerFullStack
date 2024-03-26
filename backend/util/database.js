const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'expense_tracker',
    'root',
    'guna',
    {
        dialect:'mysql',
        host: 'localhost'
    }
)

module.exports = sequelize;
