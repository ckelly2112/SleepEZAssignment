const express = require('express');
const router = express.Router();

router.get('/login', (req, res)=>{
    res.render('user/login')
})

router.post('/login', (req, res)=>{
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

module.exports = router;