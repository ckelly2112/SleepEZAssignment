//Port Configured
const PORT = process.env.PORT || 3000;
//API Keys are hidden here

//Import Modules
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const genRoutes = require('./routes/general')

require("dotenv").config({path:'./config/keys.env'});




const app = express();

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


// GET
// app.get('/', (req, res)=>{
//     res.render('home')
// })
// app.get('/roomList', (req, res)=>{
//     if(result == "Toronto"){
//         res.render('roomList', {
//             Toronto: true,
//             city: result
//         })
//     } else if(result == "Montreal"){
//         res.render('task/roomList', {
//             Montreal: true,
//             city: result
//         })
//     }else if(result == "Vancouver"){
//         res.render('roomList', {
//             Vancouver: true,
//             city: result
//         })
//     }else if(result == "St. John's"){
//         res.render('roomList', {
//             StJohns: true,
//             city: result
//         })
//     } 
//     else
//     res.render('roomList', {
//         empty: true
//     })
// })

// app.post("/", (req, res)=>
// {
//     const errors = [];
//     if (req.body.checkInDate <= '2019-10-07'){
//         errors.push("You can not select a day in the past!");
//     }
//     if (req.body.checkOutDate <= req.body.checkInDate){
//         errors.push("You need to select a day AFTER your check in date");
//     }
//     if (req.body.numberOfGuests > 9 || req.body.numberOfGuests < 1){
//         errors.push("Invalid Number of Guests/Nine guest max")
//     }
//     if (errors.length >= 1){
//         res.render("home", {
//             error: errors,
//         })
//     } else{
//         result.pop();
//         result.push(`${req.body.searchCity}`);
//         res.redirect('/roomList')
//     }
// })

app.post('/login', (req, res)=>{
    const errors = [];
    if (req.body.userEmail == ""){
        errors.push(`You forgot to enter your email!`)
    }
    if (req.body.userPassword == ""){
        errors.push(`You didn't enter your password!`)
    }
    if (errors.length >=1){
        res.render('login',{
            error: errors
        })
    } else{
        res.redirect('task/dashboard');
    }
})

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} now listening`)
})
