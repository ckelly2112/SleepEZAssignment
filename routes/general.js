const express = require('express');
const router = express.Router();
const Room = require("../models/task")
const result =[];


router.get('/', (req, res)=>{
    res.render('general/home')
})

router.get('/viewRooms', (req,res)=>{
    Room.find({roomLocation:result})
    .then(room=>{
        let userID = "";
        if (req.session.userInfo != null) userID = req.session.userInfo._id;
        res.render('general/viewRooms',{
            rooms:room,
            user:userID
        })
    })
})

router.post("/", (req, res)=>
{
    const errors = [];
    if (req.body.checkInDate <= Date.now()){
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
        res.redirect('/viewRooms')
    }
})
module.exports = router;