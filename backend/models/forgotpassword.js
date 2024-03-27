const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const { v4 : uuidv4 } = require('uuid');

const ForgotPassword = sequelize.define('forgotpassword', {
    id:{
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        primaryKey: true
    },
    isactive:Sequelize.BOOLEAN
})

module.exports = ForgotPassword;