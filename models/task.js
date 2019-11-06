const mongoose = require('mongoose');

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

module.exports = Register;