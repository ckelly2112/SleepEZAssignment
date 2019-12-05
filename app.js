//Port Configured
const PORT = process.env.PORT || 3000;
//Import Modules
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const genRoutes = require('./routes/general')
//Processes
require("dotenv").config({path:'./config/keys.env'});

//Initiate Express
const app = express();
//Use Body Parser
app.use(bodyParser.urlencoded({ extended: false}));

//Routes
app.use('/', genRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);

//Cities temporarily stored here
const result =[];

//Handlebars setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Setup
app.use(express.static('public'))

//Mongoose db setup
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connection to database successful`)    
})
.catch((err)=>{
    console.log(`ERROR: ${err}`)
})

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} now listening`)
})
