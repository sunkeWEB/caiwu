const mongoose = require('mongoose');

// 收入支出表
let ygSchema = new mongoose.Schema({
    name:String, //员工(经办人)名称
    phone:String,
    birthday:String,
    department:String,  //部门
    bz:String,//备注
    status:Number // 转台
});

module.exports = mongoose.model('staffs', ygSchema);