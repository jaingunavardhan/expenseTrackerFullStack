const sequelize = require('../util/database.js');
const Sequelize = require('sequelize');

const Expense = sequelize.define('expense', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    amount:Sequelize.DOUBLE,
    description: Sequelize.STRING,
    category: Sequelize.STRING,
    date: Sequelize.STRING,
    month: Sequelize.STRING,
})

module.exports = Expense;