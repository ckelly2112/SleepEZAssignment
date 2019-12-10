const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/task')
const auth = require("../middleware/auth");
const sgMail = require('@sendgrid/mail');
const path = require("path");
const fs = require("fs")
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

router.get('/dashboard', auth, (req, res) => {
    User.findById(req.session.userInfo._id)
        .then(user => {
            Room.find({_id:user.booking})
            .then(bookings=>{

                if (user.Status == "Admin") {
                    Room.find({createdBy:req.session.userInfo._id})
                        .then(room => {
                            res.render('task/adminDashboard', {
                                room: room,
                                bookings: bookings
                            })
                        })
                        .catch(err=>{console.log(err)})
                }
                else {
                    res.render(`task/dashboard`, {
                        bookings: bookings
                    })
                }
            })
            .catch(err=> {
                console.log(`Error happening here ${err}`)
                if (user.Status == "Admin") {
                    Room.find({createdBy:req.session.userInfo._id})
                        .then(room => {
                            res.render('task/adminDashboard', {
                                room: room,
                            })
                        })
                        .catch(err=>{console.log(err)})
                }
                else {
                    res.render(`task/dashboard`), {
                        userInfo: user,
                    }
                }
            })
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
        roomLocation: req.body.roomLocation,
        createdBy: req.session.userInfo._id
    };
    if(req.files == null || req.files.roomPicture.mimetype.indexOf("image")==-1){
        errors.push("You must upload an image file for the room!");
        res.render('task/addRoom',{
            error:errors
        })
    }
    const addRoom = new Room(roomData);
    addRoom.save({validateBeforeSave: true})
    .then((addRoom)=>{
        console.log(req.files.roomPicture.name);
        //renaming the room to include the room id:
        req.files.roomPicture.name = `db_${addRoom._id}${path.parse(req.files.roomPicture.name).ext}`

        req.files.roomPicture.mv(`public/uploads/${req.files.roomPicture.name}`)
        .then(()=>{
            Room.findByIdAndUpdate(addRoom._id, {
                roomPicture:req.files.roomPicture.name
            })
            .then(()=>{
                console.log(`${roomData.roomTitle} Saved!`)
                res.redirect(`/task/dashboard`)
            })
        })
    })
    .catch(err=> {
        console.log(err)
        errors.push("Something went wrong. Check the following:")
        errors.push("Title is less than 25 characters")
        errors.push("Price is above $0")
        errors.push("Description is less than 250 characters")
        res.render('task/addRoom',{
            error:errors
        })
    })
})

router.get('/editRoom/:id',auth,(req,res)=>{
    Room.findById(req.params.id)
    .then(room=>{
        if(room.createdBy == req.session.userInfo._id){
            res.render('task/editRoom', {
                roomData: room
            })
        }
        else{
            res.redirect('/user/login')
        }
    })
    .catch(err=> console.log(err))
})

router.put('/editRoom/:id',auth,(req,res)=>{
    const error = [];
    Room.findById(req.params.id)
    .then(room=>{
        room.roomTitle = req.body.roomTitle;
        room.roomPrice = req.body.roomPrice;
        room.roomDescription = req.body.roomDescription;
        room.roomLocation = (req.body.roomLocation == "none")? room.roomLocation:req.body.roomLocation;
        room.save()
        .then((editRoom)=>{
            if(req.files.roomPicture == null){
                res.redirect(`/task/dashboard`)
            }
            else{
                fs.unlinkSync(`public/uploads/${room.roomPicture}`)
                req.files.roomPicture.name = `db_${editRoom._id}${path.parse(req.files.roomPicture.name).ext}`
                req.files.roomPicture.mv(`public/uploads/${req.files.roomPicture.name}`)
                .then(()=>{
                    Room.findByIdAndUpdate(editRoom._id, {
                        roomPicture:req.files.roomPicture.name
                    })
                })
                res.redirect(`/task/dashboard`)
            }
        })
        .catch(err=>{
            console.log(err)
            error.push("Something went wrong. Check the following:")
            error.push("Title is less than 25 characters")
            error.push("Price is above $0")
            error.push("Description is less than 250 characters")
            res.render('task/editRoom',{
                roomData:room,
                error:error
            })
        }) 
    })
})

router.delete("/delete/:id", auth, (req, res)=>{

    Room.findOneAndDelete({_id:req.params.id})
    .then(room=>{
        console.log(room.roomPicture)
        fs.unlinkSync(`public/uploads/${room.roomPicture}`)
        res.redirect("/task/dashboard")
    })
})

router.get("/book/:id",auth,(req,res)=>{
    Room.findById(req.params.id)
    .then(room=>{
        User.findByIdAndUpdate(req.session.userInfo._id, {
           "$push": {booking: room._id}
        })
        .then(()=>{
            res.redirect('/task/dashboard')
        })
        .catch(err=> {
            console.log(`update failed because: ${err}`)
            res.render('general/viewRooms',
            {
                error:"Could not book. Might already be booked"
            })
        })

    })
    .catch(err=> console.log(`Couldn't find room because ${err}`))
})

router.get("/deleteBookings",auth,(req,res)=>{
    User.findByIdAndUpdate(req.session.userInfo._id, {
        booking: []
    })
    .then(()=>{
        res.redirect('/task/dashboard')
    })
})

module.exports = router;