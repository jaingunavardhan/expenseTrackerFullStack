const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter.js');
const expenseRouter = require('./routes/expenseRouter.js');
const purchaseRouter = require('./routes/purchaseRouter.js')
const premiumRouter = require('./routes/premiumRouter.js');
const passwordRouter = require('./routes/passwordRouter.js');
const downloadRouter = require('./routes/downloadRouter');

const sequelize = require('./util/database.js');
const User = require('./models/user.js');
const Expense = require('./models/expense.js');
const Order = require('./models/order.js')
const ForgotPassword = require('./models/forgotpassword.js');
const Fileurl = require('./models/fileurl.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({extended:false}))

app.use('/users', userRouter);
app.use('/expenses', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/premium', premiumRouter);
app.use('/password', passwordRouter);
app.use('/download', downloadRouter);

Expense.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Order);

ForgotPassword.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(ForgotPassword);

Fileurl.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Fileurl);

sequelize.sync()
    .then(()=>{
        app.listen(4000);
    })
    .catch(error=>console.log(error));