//Port Configured
const PORT = process.env.PORT || 3000;
//API Keys are hidden here
const config = require('./config')

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");


const app = express();

//Cities temporarily stored here
const result =[];
const registered = [];

//Handlebars setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Setup
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('public'))

//Mongoose db setup
mongoose.connect(config.MongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connection to database successful`)
})
.catch((err)=>{
    console.log(`ERROR: ${err}`)
})

// GET
app.get('/', (req, res)=>{
    res.render('home',
    {
        register: registered
    })
})

app.get('/roomList', (req, res)=>{
    if(result == "Toronto"){
        res.render('roomList', {
            Toronto: true,
            city: result
        })
    } else if(result == "Montreal"){
        res.render('roomList', {
            Montreal: true,
            city: result
        })
    }else if(result == "Vancouver"){
        res.render('roomList', {
            Vancouver: true,
            city: result
        })
    }else if(result == "St. John's"){
        res.render('roomList', {
            StJohns: true,
            city: result
        })
    } 
    else
    res.render('roomList', {
        empty: true
    })
})

app.get('/userReg', (req, res)=>{
    res.render('userReg')
})

// POST
app.post("/", (req, res)=>
{
    const errors = [];
    if (req.body.checkInDate <= '2019-10-07'){
        errors.push("You can not select a day in the past!");
    }
    if (req.body.checkOutDate <= req.body.checkInDate){
        errors.push("You need to select a day AFTER your check in date");
    }
    if (req.body.numberOfGuests > 9 || req.body.numberOfGuests < 1){
        errors.push("Invalid Number of Guests/Nine guest max")
    }
    if (errors.length >= 1){
        res.render("home", {
            error: errors,
        })
    } else{
        result.pop();
        result.push(`${req.body.searchCity}`);
        res.redirect('/roomList')
    }
})

app.post('/userReg', (req, res)=>{
    const errors =[];
    if (req.body.userEmail == ""){
        errors.push("You must enter an Email")
    }
    if (req.body.firstName == ""){
        errors.push("You must enter your first name!")
    }
    if (req.body.lastName ==""){
        errors.push("Please provide a last name")
    }
    if (req.body.dateOfBirth >= '2001-10-07'){
        errors.push("Must be 18 or older to register!")
    }
    if (errors.length >=1){
        res.render('userReg',{
            error: errors
        })
    } else{
        registered.pop();
        registered.push(`${req.body.firstName}`)
        res.redirect('/')
    }

})

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} now listening`)
})
