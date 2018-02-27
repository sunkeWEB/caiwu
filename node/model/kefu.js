const mongoose = require('mongoose');

//定义模型字段  跟数据库匹配
let kehuSchema = new mongoose.Schema({
    // name:"王小姐",phone:'',cz:'',email:'',adders:'',bz:''
    name: String,
    phone:String,
    cz:String,
    email:String,
    adders:String,
    bz:String,
    status:Number
},{ versionKey: false});

module.exports = mongoose.model('kehus', kehuSchema);