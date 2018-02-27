let mongoose = require('./../../database/mongooseConfig');
let SS = require('../../model/srzcs');
module.exports = async function (start ,end ) {
    console.log(start,end);
    let year = 2017;
    let yearStar = 1483200000;
    let endTime, startTime = 0;
    let arr = [];
    let mmm = [];
    // for (let a = 0; a < arr.length; a++) {
    await SS.aggregate([{$match: {$and: [{time: {$lte: start}}, {time: {$gt: end}}]}}, {
            $group: {
                _id: '$type',
                total: {$sum: '$price'}
            }
        }], (err, num1) => {
        console.log("sdada"+num1);
            return num1;
        });
    // }
};