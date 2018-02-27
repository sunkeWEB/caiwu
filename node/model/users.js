const mongoose = require('mongoose');

//定义模型字段  跟数据库匹配
let userSchema = new mongoose.Schema({
    name: String, // 用户名
    zsname:String, //真实姓名
    avatar:String, //头像
    defaultyhk:String, //默认资金账户
    pwd: String, // 密码
    ip: String,  // 最近登录ip
    defaultxm:String, // 默认项目
    defaultkhs:String, // 默认客户
    status: Number,  // 状态  是否激活 0 是激活
    time: String,  // 最近登录时间
    dengji:String, // 级别  系统管理  普通记账 经理记账
    quanxian:[
        {
            name:String,
            list:{
                read:Number,    // 0表示具有权限 增删改 浏览 权限
                update:Number,
                create:Number,
                delete:Number
            }
        }
    ] // 权限数组
},{ versionKey: false});

module.exports = mongoose.model('users', userSchema);