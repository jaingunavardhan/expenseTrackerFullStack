const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRouter.js');
const sequelize = require('./util/database.js');
const User = require('./models/user.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({extended:false}))

app.use(userRoutes);

sequelize.sync()
    .then(()=>{
        app.listen(4000);
    })
    .catch(error=>console.log(error));