const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")

const loginSchema = new Schema({
    firstName :{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    eMail:{
        type: String,
        unique: true
    } ,
    password: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        default: "User"
    },
    booking: {
        type: Array,
    }
})

loginSchema.pre("save", function(next){

    bcrypt.genSalt(parseInt(process.env.BC_SALT))
    .then(salt=>{
        bcrypt.hash(this.password,salt)
        .then(hash=>{
            this.password=hash
            next();
        })
    })
})


const Register = mongoose.model('Register', loginSchema);

module.exports = Register;