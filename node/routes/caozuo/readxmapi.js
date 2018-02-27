let mongoose = require('./../../database/mongooseConfig');
let Gcxms = require('./../../model/gcxm');
module.exports = async function (data={}) {
    return await Gcxms.find(data, {dtype: 0, __v: 0}, (err, doc) => {
        if (err) {
            return {
                code:1,
                msg:err
            }
        }
        if (doc) {
            return doc
        }
    });
};