const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create not registed items schema-not registered items save here
const NotRegisterdSchema = new Schema({
    RFID:{
      type:String,
    },
    workStation:String,
    checkIn:Date,
    checkOut:Date,
    createdAt:{
        type: Date,
        default: Date.now
    },
  });
const NotRegister = mongoose.model('notRegister',NotRegisterdSchema);
module.exports = NotRegister;