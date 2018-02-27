let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');
module.exports = async function (data={}) {
   return await DxTypes.find(data, {dtype: 0, __v: 0}, (err, doc) => {
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