const sequelize = require('../util/database.js');
const Sequelize = require('sequelize');

const Fileurl = sequelize.define('fileurl', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        alowNull: true,
        primaryKey: true
    },
    url:Sequelize.STRING
})

module.exports = Fileurl;