const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomTitle:{
        type:String,
        required: true
    },
    roomPrice:{
        type:Number,
        default: 100.00
    },
    roomDescription:{
        type:String,
        maxlength: 255,
        required: true
    },
    roomLocation:{
        type:String,
        required: true
    },
})

const Room = mongoose.model('Room', roomSchema);

module.exports=Room;