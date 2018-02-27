let mongoose = require('./../../database/mongooseConfig');
let Srzcs = require('./../../model/srzcs');
// 读取 收入支出
module.exports = async function (item = {}) {
    let data = item;
    let limit = parseInt(data.limit);
    let offset = parseInt(data.offset);
    let searchValue = data.search;
    if (searchValue) {
        let obj = [
            {
            dtype: searchValue
        }, {
            xtype: searchValue
        }, {
            price: searchValue
        }, {
            time: searchValue
        }, {
            zjzh: searchValue
        }, {
            yshb: searchValue
        }, {
            ywxm: searchValue
        }, {
            jbr: searchValue
        }, {
            sm: searchValue
        }]; // 查询的条件
        return await Srzcs.find({$or: obj}).limit(limit).skip(offset).exec((err, doc) => {
            if (err) {
                return {
                    code: 1,
                    msg: err
                }
            }
            if (doc) {
                return doc
            }
        })

    } else {
        return await  Srzcs.find({}).limit(limit).skip(offset).exec((err, doc) => {
            if (err) {
                return {
                    code: 1,
                    msg: err,
                    doc: []
                }
            }
            if (doc) {
                let num = async function () {
                    return await Srzcs.count({}, (err, num1) => {
                        return num1
                    });
                };
                let total;
                num().then(res => {
                    total = res;
                });
            }
            return [doc,1];
        });
    }
};