const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get('/login', (req, res)=>{
    res.render('user/login')
})

router.post('/login', (req, res)=>{
    const errors = [];
    const loginInfo = {
        email : req.body.userEmail,
        password : req.body.userPassword
    }
    User.findOne({eMail:loginInfo.email})
    .then(user=>{
        if (user==null){
            errors.push("Sorry your email was not found");
            res.render("user/login",{
                error: errors
            })
        }
        else{
            bcrypt.compare(loginInfo.password, user.password)
            .then(match=>{
                if(match){
                    req.session.userInfo=user;
                    res.redirect("/task/profile")
                }
                else{
                    errors.push("Sorry, your password does not match");
                    res.render("user/login",{
                        error: errors
                    })
                }
            })
            .catch(err=>console.log(err))
        }
    })
    .catch(err=> console.log(err)) 
})

router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/user/login");
})

module.exports = router;