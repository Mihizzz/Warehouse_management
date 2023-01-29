var express = require('express');
var router = express.Router();
const Worker = require('../models/worker');
const Forklift = require('../models/forklift');
const Paper = require('../models/paper');
const User = require('../models/user');
const Log = require('../models/log');

//post -register worker
router.post('/worker',async function(req,res,next){
    
    var newWorker = new Worker({
        RFID : req.query.RFID,
        ID:req.query.workerId,
        name:req.query.workerName
    }); 
//    await Worker.create(newWorker);
//    return res.status(200).send({log:'success'});
   Worker.create(newWorker, function (err, worker) {
    if (err) {
      console.log(err)
      return res.status(400).send(err.message);
    } else {
        return res.status(200).send({log:'success'});
    }
  });

});
//post -register forklift
router.post('/forklift', function(req,res,next){

    var newForklift = new Forklift({
        RFID : req.query.RFID,
        ID:req.query.forkliftId,
    }); 
    Forklift.create(newForklift, function (err, forklift) {
    if (err) {
      console.log(err)
      return res.status(400).send(err.message);
    } else {
        return res.status(200).send({log:'success'});
    }
  });
    
});
//post -register paper
router.post('/paper', function(req,res,next){

    var newPaper= new Paper({
        RFID : req.query.RFID,
        PONo:req.query.PONo,
        partsNo:req.query.PartsNo,
    }); 
    Paper.create(newPaper, function (err, paper) {
    if (err) {
      console.log(err)
      return res.status(400).send(err.message);
    } else {
        return res.status(200).send({log:'success'});
    }
  });
    
});
//post -register new user to the web portal
router.post('/user', function(req,res,next){
    var newUser= new User({
        RFID : req.query.RFID,
        ID:req.query.workerId,
        name:req.query.workerName,  
        password:req.query.pass,
    }); 
    User.create(newUser, function (err, user) {
    if (err) {
      console.log(err)
      return res.status(400).send(err.message);
    } else {
        // retrieveUser = {
        //     cardId: user.cardId,
        //     username: user.username,
        //     age: user.age,
        //     profile: user.profile,
        //   };
        return res.status(200).send({log:'success'});
    }
  });
    
});
module.exports = router;