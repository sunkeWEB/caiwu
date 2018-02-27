const mongoose = require('mongoose');

// 收入支出表
let ssSchema = new mongoose.Schema({
    type: Number, // 0 支出 1 收入
    dtype: [
        {
            name: String,
            pid: Number
        }
    ]
});

module.exports = mongoose.model('sss', ssSchema);