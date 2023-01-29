const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//importing log models,
const LogModel=require('./log').schema

//create Worker schema
const WorkerSchema = new Schema({
  //RFID is required and unique
    RFID:{
      type:String,
      unique: true,
      required: [true, "RFID is Required"],
    },
    //ID is required and unique
    ID:{
        type:String,
        unique: true,
        required: [true, "WorkerID is Required"],
    },
    name:{
        type:String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    log:[LogModel],

  });
const Worker = mongoose.model('worker',WorkerSchema);
module.exports = Worker;