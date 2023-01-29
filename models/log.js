const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Log schema
const LogSchema = new Schema({
    workStation:String,
    checkIn:Date,
    checkOut:Date,
  });
const Log = mongoose.model('log',LogSchema);
module.exports = Log;