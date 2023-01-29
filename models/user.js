const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create User schema
const UserSchema = new Schema({
    RFID:{
      type:String,
      unique: true,
      required: [true, "RFID is Required"],
    },
    //worker Id = username
    ID:{
        type:String,
        unique: true,
        required: [true, "WorkerID is Required"],
    },
    //worker name
    name:{
        type:String,
    },
    password:String,
    createdAt:{
        type: Date,
        default: Date.now
    },
  });
const User = mongoose.model('user',UserSchema);
module.exports = User;