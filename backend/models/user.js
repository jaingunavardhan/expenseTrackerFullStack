const sequelize = require('../util/database.js');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username:Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    ispremiumuser: Sequelize.BOOLEAN
})

module.exports = User;