//Port Configured
const PORT = process.env.PORT || 3000;
//API Keys are hidden here
const config = require('./config')

//Import Modules
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const sgMail = require('@sendgrid/mail')




const app = express();


//SendGrid API
sgMail.setApiKey(config.sendGrid);


//Cities temporarily stored here
const result =[];

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

//Login Schema
const Schema = mongoose.Schema;
    const loginSchema = new Schema({
        firstName : String,
        lastName: String,
        eMail:{
            type: String,
            unique: true
        } ,
        password: String,
        DOB: Date
    })


    const Register = mongoose.model('Register', loginSchema);

// GET
app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/dashboard', (req, res)=>{
    res.render('dashboard')
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
app.get('/login', (req, res)=>{
    res.render('login')
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
        res.redirect('/dashboard');
    }
})

app.post('/userReg', (req, res)=>{
    
    const validator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
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
    if (!validator.test(req.body.userPassword)){
        errors.push(`Rules are as follows:`)
        errors.push(`Password must have one lower case and one Upper case letter`)
        errors.push(`Password must have at least one number`)
        errors.push(`Password Length between 8 & 16 characters`)
    }
    if (errors.length >=1){
        res.render('userReg',{
            error: errors
        })
    } else{
        const loginData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            eMail: req.body.userEmail,
            password: req.body.userPassword,
            DOB: req.body.dateOfBirth
        }
        const saveLogin = new Register(loginData);
        saveLogin.save({validateBeforeSave: true})
        .then(()=>{
            console.log(`${loginData.firstName} Saved in the database!`)
            const email = {
                to: loginData.eMail,
                from: config.sendEmail,
                subject: `Welcome aboard!`,
                text: `Welcome aboard!`,
                html: `Thank you for creating an account with SleepEz!!!`
            }
            sgMail.send(email)
            .then(()=>{
                console.log('Message sent Successfully!')
            })
            .catch((err)=>{
                console.log(err);
            })
            res.redirect('/dashboard');
        })
        .catch((err)=>{
            console.log(`Save failed because: ${err}`);
            errors.push("Email already in use!")
            res.render('userReg', {
                error: errors
            })
        })
        
        
    }

})

app.listen(PORT, ()=>{
    console.log(`Port ${PORT} now listening`)
})
