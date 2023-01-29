var express = require('express');
var router = express.Router();
const CheckIn = require('../models/checkIn');
const Worker = require('../models/worker');
const Forklift = require('../models/forklift');
const Paper = require('../models/paper');
const Log = require('../models/log');
const NotRegisteredItems = require('../models/notRegisteredItems');

async function PushLogs(RFID, log, logNotRegisterChekOut) {

    var paper = await Paper.updateOne({ RFID: RFID }, { $push: { "log": log } });
    if (paper.modifiedCount == 1) {
        console.log("paper modified");
        await CheckIn.deleteMany({ RFID: RFID });
    } else {
        var forklift = await Forklift.updateOne({ RFID: RFID }, { $push: { "log": log } });
        if (forklift.modifiedCount == 1) {
            console.log("forklift modified");
            await CheckIn.deleteMany({ RFID: RFID });
        } else {
            var worker = await Worker.updateOne({ RFID: RFID }, { $push: { "log": log } });
            console.log("log data: ", log);
            if (worker.modifiedCount == 1) {
                console.log("worker modified");
                await CheckIn.deleteMany({ RFID: RFID });
            } else {
                await NotRegisteredItems.create(logNotRegisterChekOut);
                await CheckIn.deleteMany({ RFID: RFID });
                var msg = { log: 'This RFID is not registered' };
                return msg;
            }
        }
    }
    var msg = { log: 'success' };
    return msg;

}

//post check-in
router.post('/checkin', async function (req, res, next) {
    var RFID = req.query.RFID;
    var workStation = req.query.workStation;
    var checkin = new CheckIn({
        RFID: RFID,
        workStation: workStation,
    });
    var rfid = await CheckIn.findOne({ RFID: RFID });
    //if the same RFID & same workStation detected ignore the checkIn ,
    //if the same RFID & different workStation detected write old checkin in LOGs(in paper,forklift,worker), write new checkin record in Checkin table
    //if no same RFID write checkin record in Checkin table
    if (rfid) {
        if (rfid.workStation === workStation) {
            console.log("same rfid + same work station");
            return res.status(200).send({ log: 'same rfid + same work station' });
        } else {
            var log = new Log({
                workStation: rfid.workStation,
                checkIn: rfid.checkIn,
                checkOut: null

            });
            var logNotRegisterChekOut = new NotRegisteredItems({
                RFID: RFID,
                workStation: rfid.workStation,
                checkIn: rfid.checkIn,
                checkOut: null,
            });
            var result = await PushLogs(RFID, log, logNotRegisterChekOut);
            CheckIn.create(checkin);
            return res.status(200).send(result);
        }
    } else {
        CheckIn.create(checkin);
        return res.status(200).send({ log: 'success' });
    }
});
//post check-out
router.post('/checkout', async function (req, res, next) {
    var RFID = req.query.RFID;
    var workStation = req.query.workStation;
    var rfid = await CheckIn.findOne({ RFID: RFID });
    console.log("rfid:", rfid);
    // if there is a checkin record with same RFID,check that RFID is from same workstation,
    // if it is from same workstation, add checkout time and update paper/forklift/worker collection with log data(checkin date&time, checkout date&time, workstation) according to RFID.
    // if it is from different workstation, update paper/forklift/worker collection with 2 log data.(1. checkin,workstation, null checkout,  2.checkout,workstatio, null checkin)
    // if the RFID is not registered in any of the collection(paper/forklift/worker), that record will save in the notRegisteredItem colection(RFID,Checkin,checkout,workstation)
    // if the no RFID same as CheckoutAPI in the Checkin collection write log with no checkin data.
    if (rfid) {
        console.log("rfid found in checkin");
        if (rfid.workStation === workStation) {
            console.log("same workstation");
            var log = new Log({
                workStation: rfid.workStation,
                checkIn: rfid.checkIn,
                checkOut: Date.now(),
            });
            var logNotRegisterChekOut = new NotRegisteredItems({
                RFID: RFID,
                workStation: workStation,
                checkIn: rfid.checkIn,
                checkOut: Date.now(),
            });

            var result = await PushLogs(RFID, log, logNotRegisterChekOut);
            // var paper = await Paper.updateOne({RFID:RFID},{$push:{"log":[log]}});
            // if(paper.modifiedCount == 1){
            //     console.log("paper modified");
            //     await CheckIn.deleteMany({ RFID:RFID}); 
            // }else{
            //     var forklift = await Forklift.updateOne({RFID:RFID},{$push:{"log":[log]}});
            //     if(forklift.modifiedCount == 1){
            //         console.log("forklift modified");
            //         await CheckIn.deleteMany({ RFID:RFID}); 
            //     }else{
            //         var worker = await Worker.updateOne({RFID:RFID},{$push:{"log":[log]}});
            //         if(worker.modifiedCount == 1){
            //             console.log("forklift modified");
            //             await CheckIn.deleteMany({ RFID:RFID});   
            //         }else{
            //             var logNotRegisterChekOut = new NotRegisteredItems({
            //                 RFID:RFID,
            //                 workStation:workStation,
            //                 checkIn:rfid.checkIn,
            //                 checkOut:Date.now(),
            //             });
            //             NotRegisteredItems.create(logNotRegisterChekOut);
            //             await CheckIn.deleteMany({ RFID:RFID});  
            //             return res.status(200).send({log:'This RFID is not registered'});
            //         }
            //     }
            // }
            return res.status(200).send(result);
        } else {
            console.log("different workstation");
            const date = new Date();
            console.log("date now:", date);
            var log = [
                {
                    workStation: rfid.workStation,
                    checkIn: rfid.checkIn,
                    checkOut: null,
                },
                {
                    workStation: workStation,
                    checkIn: null,
                    checkOut: date,
                }
            ];
            var logNotRegisterChekOut = [
                {
                    RFID: RFID,
                    workStation: rfid.workStation,
                    checkIn: date,
                    checkOut:null,
                },
                {
                    RFID: RFID,
                    workStation: workStation,
                    checkIn: null,
                    checkOut: date,
                }
            ];

            var result = await PushLogs(RFID, log, logNotRegisterChekOut);
            // var paper = await Paper.updateOne({ RFID: RFID }, { $push: { "log": logs } });
            // if (paper.modifiedCount == 1) {
            //     console.log("paper modified");
            //     await CheckIn.deleteMany({ RFID: RFID });
            // } else {
            //     var forklift = await Forklift.updateOne({ RFID: RFID }, { $push: { "log": logs } });
            //     if (forklift.modifiedCount == 1) {
            //         console.log("forklift modified");
            //         await CheckIn.deleteMany({ RFID: RFID });
            //     } else {
            //         var worker = await Worker.updateOne({ RFID: RFID }, { $push: { "log": logs } });
            //         if (worker.modifiedCount == 1) {
            //             console.log("forklift modified");
            //             await CheckIn.deleteMany({ RFID: RFID });
            //         } else {
            //             var logNotRegisterChekOut = new NotRegisteredItems({
            //                 RFID: RFID,
            //                 workStation: workStation,
            //                 checkIn: null,
            //                 checkOut: Date.now(),
            //             });
            //             NotRegisteredItems.create(logNotRegisterChekOut);
            //             // await CheckIn.deleteMany({ RFID:RFID});  
            //             return res.status(200).send({ log: 'This RFID is not registered' });
            //         }
            //     }
            // }
            return res.status(200).send(result);
            // return res.status(200).send({ log: 'success' });
        }
    } else {
        console.log("rfid not found in checkin");
        const date = new Date();
        var logNewChekOut = new Log({
            workStation: workStation,
            checkIn: null,
            checkOut: date,
        });
        var logNotRegisterChekOut = new NotRegisteredItems({
            RFID: RFID,
            workStation: workStation,
            checkIn: null,
            checkOut: date,
        });

        var result = await PushLogs(RFID, logNewChekOut, logNotRegisterChekOut);
        // var paper = await Paper.updateOne({ RFID: RFID }, { $push: { "log": [logNewChekOut] } });
        // if (paper.modifiedCount == 1) {
        //     console.log("paper modified");
        // } else {
        //     var forklift = await Forklift.updateOne({ RFID: RFID }, { $push: { "log": [logNewChekOut] } });
        //     if (forklift.modifiedCount == 1) {
        //         console.log("forklift modified");
        //     } else {
        //         var worker = await Worker.updateOne({ RFID: RFID }, { $push: { "log": [logNewChekOut] } });
        //         if (worker.modifiedCount == 1) {
        //             console.log("forklift modified");
        //         } else {
        //             var logNotRegisterChekOut = new NotRegisteredItems({
        //                 RFID: RFID,
        //                 workStation: workStation,
        //                 checkIn: null,
        //                 checkOut: Date.now(),
        //             });
        //             NotRegisteredItems.create(logNotRegisterChekOut);
        //             return res.status(200).send({ log: 'This RFID is not registered' });
        //         }
        //     }
        // }
        return res.status(200).send(result);
    }
});
module.exports = router;