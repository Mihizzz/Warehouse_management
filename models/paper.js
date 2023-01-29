const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//importing log models,
const LogModel=require('./log').schema

//create Paper schema
const PaperSchema = new Schema({
    RFID:{
      type:String,
      unique: true,
      required: [true, "RFID is Required"],
    },
    PONo:{
        type:String,
        required: [true, "Purchase Order number is Required"],
    },
    partsNo:{
        type:String,
        required: [true, "parts number is Required"],
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    log:[LogModel],
  });
const Paper = mongoose.model('paper',PaperSchema);
module.exports = Paper;