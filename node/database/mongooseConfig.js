const mongoose = require('mongoose');

const DB_PORT = "mongodb://127.0.0.1/financial";   //mongodb 地址

mongoose.connect(DB_PORT);

mongoose.connection.on('connected',()=>{
    console.log("MongoDB链接成功");
});

mongoose.connection.on('error',(err)=>{
    console.log("数据库连接失败"+err);
});

mongoose.connection.on('disconnected',()=>{
    console.log("断开连接");
});

module.exports = mongoose;