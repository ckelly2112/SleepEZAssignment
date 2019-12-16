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
        res.render('general/viewRooms',{
            rooms:room,
        })
    })
})

router.post("/", (req, res)=>
{
        result.pop();
        result.push(`${req.body.searchCity}`);
        res.redirect('/viewRooms')
})
module.exports = router;