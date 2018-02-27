const mongoose = require('mongoose');

// 收入支出表
let szSchema = new mongoose.Schema({
    type: Number, // 0 是支出  1是收入
    dtype:String ,
    xtype:String,
    price: Number,
    time: Number,
    zjzh:String,
    yshb:String,
    ywxm:String,
    jbr: String, // 进班人
    sm: String,
    jzr:String, // 记账人的名字
    jzrid:String, // 记账人的id
});

module.exports = mongoose.model('srzcs', szSchema);