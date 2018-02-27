const mongoose = require('mongoose');

// 收入支出表
let dxtypeSchema = new mongoose.Schema({
    "dtype": Number, // 0 是支出  1是收入
    "name": String, // 名称
    "sm": String, // 说明
    "sunlist":[  // 小类
        {
            "sname":String, // 大类的名称
            "dtype":Number,
            "name":String,
            "sm":String
        }
    ]
},{
    strict:false
});

module.exports = mongoose.model('dxtypes', dxtypeSchema);