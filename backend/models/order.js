const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Order = sequelize.define('order', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    order_id:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    payment_id:{
        type: Sequelize.STRING,
    },
    amount:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    status:{
        type:Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Order;