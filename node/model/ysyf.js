const mongoose = require('mongoose');

// 应收应付
let ysyfSchema = new mongoose.Schema({
    dtype:Number, // 1是应收 0是应付
    ssdtype:String, // 所属大类
    ssxtype:String, // 所属小类
    price:Number, // 应收金额
    jztime:Number, // 记账时间
    sktime:Number, // 收款时间
    yshb:String, // 生意伙伴
    ywxm:String, // 业务项目
    jbr:String, // 经办人
    sm:String, // 说明
    jzr:String, // 记账人
    jzrid:String
});

module.exports = mongoose.model('ysyf', ysyfSchema);