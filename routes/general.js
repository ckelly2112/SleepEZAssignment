const express = require('express');
const router = express.Router();
const result =[];


router.get('/', (req, res)=>{
    res.render('general/home')
})

router.get('/roomList', (req, res)=>{
    if(result == "Toronto"){
        res.render('task/roomList', {
            Toronto: true,
            city: result
        })
    } else if(result == "Montreal"){
        res.render('task/roomList', {
            Montreal: true,
            city: result
        })
    }else if(result == "Vancouver"){
        res.render('task/roomList', {
            Vancouver: true,
            city: result
        })
    }else if(result == "St. John's"){
        res.render('task/roomList', {
            StJohns: true,
            city: result
        })
    } 
    else
    res.render('task/roomList', {
        empty: true
    })
})

router.post("/room", (req, res)=>
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
        res.render("general/home", {
            error: errors,
        })
    } else{
        result.pop();
        result.push(`${req.body.searchCity}`);
        res.redirect('/task/roomList')
    }
})
module.exports = router;