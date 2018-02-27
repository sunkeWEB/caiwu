const mongoose = require('mongoose');

// 账户类型表
let accountSchema = new mongoose.Schema({
    sort:Number, // 排序 只能是数字
    name:String, // 名称
});

module.exports = mongoose.model('acounts', accountSchema);