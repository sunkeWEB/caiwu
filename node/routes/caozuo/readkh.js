let mongoose = require('./../../database/mongooseConfig');
let KeHus = require('./../../model/kefu');
module.exports = async function (data={}) {
    return await KeHus.find(data, {dtype: 0, __v: 0}, (err, doc) => {
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