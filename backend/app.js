const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter.js');
const expenseRouter = require('./routes/expenseRouter.js');
const purchaseRouter = require('./routes/purchaseRouter.js')
const sequelize = require('./util/database.js');
const User = require('./models/user.js');
const Expense = require('./models/expense.js');
const Order = require('./models/order.js')

const app = express();

app.use(cors());
app.use(bodyParser.json({extended:false}))

app.use('/users', userRouter);
app.use('/expenses', expenseRouter);
app.use('/purchase', purchaseRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
    .then(()=>{
        app.listen(4000);
    })
    .catch(error=>console.log(error));