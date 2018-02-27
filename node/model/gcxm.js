const mongoose = require('mongoose');
// 项目
//定义模型字段  跟数据库匹配
let gcxmSchema = new mongoose.Schema({
    name:String, // 项目名称
    sm:String, // 项目说明
    ip: String, // ip
    status: Number, // 状态  0 正常 1 停止 2 其它
    time: String  // 添加时间
});

module.exports = mongoose.model('gcxms', gcxmSchema);