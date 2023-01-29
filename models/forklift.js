const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//importing log models,
const LogModel=require('./log').schema

//create Forklift schema
const ForkliftSchema = new Schema({
    RFID:{
      type:String,
      unique: true,
      required: [true, "RFID is Required"],
    },
    //forklift ID
    ID:{
        type:String,
        unique: true,
        required: [true, "forkliftID is Required"],
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    log:[LogModel],
  });
const Forklift = mongoose.model('forklift',ForkliftSchema);
module.exports = Forklift;