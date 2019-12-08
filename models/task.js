const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomTitle:{
        type:String,
        required: true,
        maxlength: 25
    },
    roomPrice:{
        type:Number,
        default: 100.00,
        min: [0, "Can't be a negative number"]
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
    createdBy:{
        type:String,
        required: true
    },
    roomPicture:{
        type: String
    }
})

const Room = mongoose.model('Room', roomSchema);

module.exports=Room;