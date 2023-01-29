const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Checkin schema
const CheckInSchema = new Schema({
  //RFID is required and unique
    RFID:{
      type:String,
      unique: true,
      required: [true, "RFID is Required"],
    },
    workStation:String,
    checkIn:{
        type: Date,
        default: Date.now
    },
  });
const CheckIn = mongoose.model('checkIn',CheckInSchema);
module.exports = CheckIn;