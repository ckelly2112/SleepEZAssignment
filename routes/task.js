const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/task')
const auth = require("../middleware/auth");
const sgMail = require('@sendgrid/mail');
const path = require("path");
sgMail.setApiKey(process.env.SENDGRID);


router.get('/userReg', (req, res)=>{
    res.render('task/userReg')
})

router.post('/userReg', (req, res)=>{
    
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
    if (req.body.userPassword != req.body.confirmPassword){
        errors.push(`Passwords need to match!`)
    }
    if (errors.length >=1){
        res.render('task/userReg',{
            error: errors
        })
    } else{
        const loginData = {
            eMail: req.body.userEmail,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.userPassword,
            DOB: req.body.dateOfBirth
        }
        const saveLogin = new User(loginData);
        saveLogin.save({validateBeforeSave: true})
        .then(()=>{
            console.log(`${loginData.firstName} Saved in the database!`)
            const email = {
                to: loginData.eMail,
                from: process.env.SENDEMAIL,
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
            res.redirect('/user/login');
        })
        .catch((err)=>{
            console.log(`Save failed because: ${err}`);
            errors.push("Email already in use!")
            res.render('task/userReg', {
                error: errors
            })
        })
        
        
    }

})

router.get('/profile', auth, (req, res)=>{
    res.render('user/profile')
})

router.get('/dashboard', auth, (req, res)=>{
    User.findById(req.session.userInfo._id)
    .then(task=>{ 
        if (task.Status == "Admin"){
        res.render('task/adminDashboard'),{
            userInfo: task
        }}
        else{
            res.render(`task/dashboard`),{
                userInfo: task
            }
        }
    })
    
})

router.get('/addRoom',auth,(req,res)=>{
    if(req.session.userInfo.Status == "Admin"){
        res.render('task/addRoom')
    }
})

router.post('/addRoom',auth,(req,res)=>{
    const errors = [];
    
    const roomData = {
        roomTitle: req.body.roomTitle,
        roomPrice: req.body.roomPrice,
        roomDescription: req.body.roomDescription,
        roomLocation: req.body.roomLocation
    };
    const addRoom = new Room(roomData);
    addRoom.save({validateBeforeSave: true})
    .then(()=>{
        console.log(`${roomData.roomTitle} Saved!`)
        res.redirect(`/task/dashboard`)
    })
    .catch(err=> console.log(err))
})

module.exports = router;