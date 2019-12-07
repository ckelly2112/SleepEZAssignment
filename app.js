//Port Configured
const PORT = process.env.PORT || 3000;
//Import Modules
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const session = require("express-session")
//Routes
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const genRoutes = require('./routes/general')
//Initiate Express
const app = express();
//Processes
require("dotenv").config({path:'./config/keys.env'});
//Handlebars setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//Use Body Parser
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}));

//Sessions

app.use(session({secret:process.env.SUPER_SECRET}))
app.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})
//Routes
app.use('/', genRoutes);
app.use('/task', taskRoutes);
app.use('/user', userRoutes);



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
