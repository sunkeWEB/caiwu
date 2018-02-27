let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');
let readDxTypes = require('./readapi');   // 读取大类 小类 类型 函数
let readGcxms = require('./readxmapi'); // 读取 工程项目
let readKeHus = require('./readkh');  // 读取 客户 函数   注意这两个地方不一样
let readKeHu = require('./../../model/kefu');  // 读取 客户
let readSrzcs = require('./readsrcz'); // 收入支出
let Srzcs = require('./../../model/srzcs'); // 收支
let Accountzh = require('./../../model/accountguanli'); // 账户管理
let AccountTypes = require('./../../model/accountypes'); // 账号类型
let Dxtypes = require('./../../model/dxtype'); // 大小类项目
let Staffs = require('./../../model/staff'); // 员工
let Gcxms = require('./../../model/gcxm'); // 工程项目
let Users = require('./../../model/users'); // 用户
let moment = require('moment'); // 时间处理
let Ysyf = require('./../../model/ysyf');

// let SS = require('./mmmmm');
router.get('/sort', (req, res) => {
    Srzcs.find({$or: [{yshb: {$regex: '小姐'}}, {yshb: {$regex: '马'}}]}).limit(10).skip(0).exec((err, doc) => {
        res.json({
            num: doc
        });
    })

});

router.get('/', (req, res) => {
    res.json({
        code: 0,
        msg: "success"
    });
});

// 收入记账 支出记账
router.get('/read', (req, res) => {
    let data = 100; // 存 大类 小类
    let xm = 100;  // 存 项目信息
    readDxTypes().then(type => {
        data = type;
        return readGcxms();
    }).then(xms => {
        xm = xms;
        return readKeHus();
    }).then(khs => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: data,
            xm: xm,
            kh: khs
        });
    });
});

//收支流水列表
function sersch(searchValue) {
    let obj = [
        {
            dtype: {$regex: searchValue}
        }, {
            xtype: {$regex: searchValue}
        }, {
            zjzh: {$regex: searchValue}
        }, {
            yshb: {$regex: searchValue}
        }, {
            ywxm: {$regex: searchValue}
        }, {
            jbr: {$regex: searchValue}
        }, {
            sm: {$regex: searchValue}
        }]; // 查询的条件
    return obj;
}

function postTime(time, type) {
    let date = new Date(time);
    let year = date.getFullYear();
    let mouth = date.getMonth() + 1;
    let day = date.getDate();
    let full;
    if (type === 'start') {
        full = `${year}-${mouth}-${day} 00:00:00`;
    } else {
        full = `${year}-${mouth}-${day} 23:59:59`;
    }
    let timeStr = new Date(full).getTime() / 1000;
    return timeStr;
}

router.get('/readsrzc', async (req, res) => {
    let {order, offset, limit, sort, sid, id, dengji, types, dlserach, xlsearch, starttime, endtime, searchzjzh, searchsyhb, searchywxm, searchjzr} = req.query; // 获取查询条件 修改的时候根据sid
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let gjserach = {}; // 高级查询保存的条件
    let timesearch = {};
    let doc1, total = 1;
    let szlstotal; // 包裹收支的总价
    let sort1 = {time: -1};
    if (sort !== undefined) {
        sort1 = {
            [sort]: order
        }
    }
    if (starttime || endtime) {
        gjserach['time'] = {};
    }
    if (starttime) {
        let time = postTime(starttime, 'start');
        start = {$gte: time};
        gjserach['time'] = {...gjserach['time'], ...start};
    }
    if (endtime) {
        let time = postTime(endtime, 'end');
        end = {$lte: time};
        gjserach['time'] = {...gjserach['time'], ...end};
    }
    if (types !== 'all' && types !== undefined) {
        gjserach['type'] = parseInt(types);
    }

    if (dlserach !== 'all' && dlserach !== undefined) {
        gjserach['dtype'] = dlserach;
    }

    if (xlsearch !== 'all' && xlsearch !== undefined) {
        gjserach['xtype'] = xlsearch;
    }

    if (searchzjzh !== 'all' && searchzjzh !== undefined) {
        gjserach['zjzh'] = searchzjzh;
    }

    if (searchsyhb !== 'all' && searchsyhb !== undefined) {
        gjserach['yshb'] = searchsyhb;
    }

    if (searchywxm !== 'all' && searchywxm !== undefined) {
        gjserach['ywxm'] = searchywxm;
    }

    if (searchjzr !== 'all' && searchjzr !== undefined) {
        gjserach['jbr'] = searchjzr;
    }


    // 根据用户等级查看数据不同
    if (id === undefined) {
        res.json({
            code: 1,
            data: [],
            total: 0,
            msg: "你的账号存在异常请重新登录4"
        });
    } else {
        let doc = await Users.find({_id: id});
        if (doc.length >= 1) {  // 账号正确
            let dengji = doc[0].dengji;
            if (dengji === '普通记账') {
                if (sid === undefined) {  // 不修改的时候 sid 是undefined
                    let searchValue1 = searchValue ? k = sersch(searchValue) : k;
                    if (k.length >= 1) {
                        kkk = {
                            $or: k
                        };
                    }
                    total = await Srzcs.count({jzrid: id, ...kkk, ...gjserach});
                    szlstotal = await Srzcs.aggregate([{$match: {jzrid: id, ...kkk, ...gjserach}}, {
                        $group: {
                            _id: '$type',
                            num: {$sum: '$price'}
                        }
                    }]).exec();
                } else {  // 修改的时候根据sid
                    kkk = {
                        _id: sid
                    };
                }
                Srzcs.find({$and: [{jzrid: id}, kkk, gjserach]}).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort1).exec((err, doc) => {
                    res.json({
                        code: 0,
                        msg: "数据获取成功 普通记账员",
                        data: doc === null ? [] : doc,
                        total: total,
                        szlstotal: szlstotal
                    });
                });

            }
            else { // 如果是系统管理者或者是 经理记账  数据全部可以查看
                if (sid === undefined) {  // 不修改的时候 sid 是undefined
                    let searchValue1 = searchValue ? k = sersch(searchValue) : k;
                    if (k.length >= 1) {
                        kkk = {
                            $or: k
                        };
                    }
                    total = await Srzcs.count({...kkk, ...gjserach});
                    szlstotal = await Srzcs.aggregate([{$match: {...kkk, ...gjserach}}, {
                        $group: {
                            _id: '$type',
                            num: {$sum: '$price'}
                        }
                    }]).exec();
                }
                else {  // 修改的时候根据sid
                    kkk = {
                        _id: sid
                    };
                }
                Srzcs.find({$and: [kkk, gjserach]}).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort1).exec((err, doc) => {
                    res.json({
                        code: 0,
                        msg: "数据获取成功 管理员",
                        data: doc === null ? [] : doc,
                        total: total,
                        szlstotal
                    });
                });
            }
        }
        else {
            res.json({
                code: 1,
                data: [],
                total: 0,
                msg: "你的账号存在异常请重新登录6"
            });
        }
    }
});

//账户管理列表
function serschzh(searchValue) {
    let obj = [
        {
            name: {$regex: searchValue}
        }, {
            sm: {$regex: searchValue}
        }]; // 查询的条件
    return obj;
}

router.get('/readaccountzh', async (req, res) => {
    let {order, offset, limit, sort, sid, dengji, id} = req.query; // 获取查询条件  sid 如果有值 就是获取单个的数据  如果是undefined 全部数据
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    let sort2 = {};
    if (sort !== undefined) {  // 排序
        sort2 = {
            [sort]: order
        }
    }
    if (sid === undefined) {
        let searchValue1 = searchValue ? k = serschzh(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        total = await Accountzh.count(kkk);
    } else {
        kkk = {
            _id: sid
        };
    }
    Accountzh.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });
});

//账户类型列表
function serschtype(searchValue) {
    let obj = [{
        name: {$regex: searchValue}
    }]; // 查询的条件
    return obj;
}

router.get('/readaccountype', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let searchValue1 = searchValue ? k = serschtype(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let sort2 = {};
    if (sort !== undefined) {
        sort2 = {
            [sort]: order
        }
    }
    let doc1, total;
    let query = AccountTypes.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    AccountTypes.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });
});

//大类项目列表
function serschdtype(searchValue, type) {
    let obj = [];
    if (type === 0 || type === 1) {
        obj = [{
            type: searchValue
        }]; // 查询的条件
    } else {
        obj = [{
            name: {$regex: searchValue},
            sm: {$regex: searchValue}
        }]; // 查询的条件
    }
    return obj;
}

router.get('/readtype', async (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let searchValue1;
    if (searchValue === "支出") {
        searchValue = '0';
        searchValue ? k = serschdtype(searchValue, 0) : k;
    } else if (searchValue === "收入") {
        searchValue = '1';
        searchValue ? k = serschdtype(searchValue, 1) : k;
    } else {
        searchValue ? k = serschdtype(searchValue, "sunke") : k;
    }

    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let sort2 = {};
    if (sort !== undefined) {
        sort2 = {
            [sort]: order
        }
    }
    let doc1, total;
    total = await Dxtypes.count(kkk);
    console.log(kkk);
    Dxtypes.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });

});

//客户列表
function serschkefu(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
    }, {
        phone: {$regex: searchValue},
    }, {
        bz: {$regex: searchValue},
    }, {
        email: {$regex: searchValue},
    }, {
        adders: {$regex: searchValue}
    }]; // 查询的条件
    return obj;
}

router.get('/readkehus', async (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let k = [];
    let searchValue1 = searchValue ? k = serschkefu(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let sort2 = {};
    if (sort !== undefined) {
        sort2 = {
            [sort]: order
        }
    }
    let doc1, total;
    total = await readKeHu.count(kkk);
    readKeHu.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });

});

// 员工列表
function serschyuangong(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
    }, {
        phone: {$regex: searchValue},
    }, {
        birthday: {$regex: searchValue},
    }, {
        department: {$regex: searchValue},
    }, {
        bz: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readyuangong', async (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let searchValue1 = searchValue ? k = serschyuangong(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let sort2 = {};
    if (sort !== undefined) {
        sort2 = {
            [sort]: order
        }
    }
    let doc1, total;
    total = await Staffs.count(kkk)
    Staffs.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });

});

//项目管理列表
function serschxm(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
    }, {
        sm: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readxm', async (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let searchValue1 = searchValue ? k = serschxm(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let sort2 = {};
    if (sort !== undefined) {
        sort2 = {
            [sort]: order
        }
    }
    let doc1, total;
    total = await Gcxms.count(kkk);
    Gcxms.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort2).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });

});

//用户管理列表
function serschusers(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
    }, {
        zsname: {$regex: searchValue},
    }, {
        avatar: {$regex: searchValue},
    }, {
        defaultxm: {$regex: searchValue},
    }, {
        defaultyhk: {$regex: searchValue},
    }, {
        defaultkhs: {$regex: searchValue},
    }, {
        dengji: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readusers', async (req, res) => {
    let {order, offset, limit, sort, sid} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let sort1 = {};
    if (sort !== undefined) {
        sort1 = {
            [sort]: order
        }
    }
    if (sid === undefined) {
        let searchValue1 = searchValue ? k = serschusers(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        total = await Users.count(kkk);
    } else {
        kkk = {
            _id: sid
        };
    }
    Users.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort1).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc === null ? [] : doc,
            total: total
        });
    });

});

//应收应付
function serschysyf(searchValue) {
    let obj = [
        {
            ssdtype: {$regex: searchValue},
        }, {
            ssxtype: {$regex: searchValue},
        }, {
            yshb: {$regex: searchValue},
        }, {
            ywxm: {$regex: searchValue},
        }, {
            jbr: {$regex: searchValue},
        }, {
            sm: {$regex: searchValue},
        }, {
            jzr: {$regex: searchValue},
        }]; // 查询的条件
    return obj;
}

router.get('/readysyf', async (req, res) => {
    let {order, offset, limit, sort, sid, id, dengji} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    let ysyftotal = [];
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let sort1 = {time: -1};
    if (sort !== undefined) {
        sort1 = {
            [sort]: order
        }
    }
    // 根据用户等级查看数据不同
    if (id === undefined) {
        res.json({
            code: 1,
            data: [],
            total: 0,
            msg: "你的账号存在异常请重新登录1"
        });
    } else {
        let doc = await Users.find({_id: id});
            if (doc.length >= 1) {
                let dengji = doc[0].dengji;
                if (dengji === '普通记账') {
                    if (sid === undefined) {
                        let searchValue1 = searchValue ? k = serschysyf(searchValue) : k;
                        if (k.length >= 1) {
                            kkk = {
                                '$or': k
                            };
                        }
                        total = await Ysyf.count({jzrid:id,...kkk});
                        ysyftotal =await Ysyf.aggregate([{$match: {jzrid:id,...kkk}}, {
                            $group: {
                                _id: '$dtype',
                                num: {$sum: '$price'}
                            }
                        }]).exec();
                    } else {
                        kkk = {
                            _id: sid
                        };
                    }
                    Ysyf.find({$and: [{jzrid: id}, kkk]}).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort1).exec((err, doc) => {
                        res.json({
                            code: 0,
                            msg: "数据获取成功",
                            data: doc === null ? [] : doc,
                            total: total,
                            ysyftotal
                        });
                    });
                } else { // 如果是系统管理者或者是 经理记账  数据全部可以查看
                    if (sid === undefined) {
                        let searchValue1 = searchValue ? k = serschysyf(searchValue) : k;
                        if (k.length >= 1) {
                            kkk = {
                                '$or': k
                            };
                        }
                        total = await Ysyf.count(kkk);
                        ysyftotal =await Ysyf.aggregate([{$match: {...kkk}}, {
                            $group: {
                                _id: '$dtype',
                                num: {$sum: '$price'}
                            }
                        }]).exec();
                    } else {
                        kkk = {
                            _id: sid
                        };
                    }
                    Ysyf.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).sort(sort1).exec((err, doc) => {
                        res.json({
                            code: 0,
                            msg: "数据获取成功",
                            data: doc === null ? [] : doc,
                            total: total,
                            ysyftotal
                        });
                    });
                }
            } else {
                res.json({
                    code: 1,
                    data: [],
                    total: 0,
                    msg: "你的账号存在异常请重新登录3"
                });
            }
    }

});

// 支出汇总统计图
router.get('/readsrzctjt', (req, res) => {
    Srzcs.aggregate({$group: {_id: '$type', total: {$sum: '$price'}}}, (err, doc) => {
        if (err) {
            res.json({
                code: 1,
                msg: "数据获取失败",
                err: err
            });
        } else {
            res.json({
                code: 0,
                msg: "数据获取成功",
                data: doc
            });
        }
    });
});

// 年度支出汇总统计图
router.get('/readyearzctjt', (req, res) => {
    let {years} = req.query;
    let stringTime = `${years}-01-1 00:00:00`;
    let yearStar = Date.parse(new Date(stringTime)) / 1000;
    // let yearStar = 1483200000;
    let endTime, startTime = 0;
    let arr = [];
    for (let i = 1; i <= 12; i++) {
        startTime = startTime === 0 ? yearStar : startTime;
        if (i % 2 !== 0) {
            endTime = 86400 * 31 + startTime;
        } else {
            if (i === 2) {
                // 判断是否是润年
                if ((years % 4 === 0) && (years % 100 !== 0 || years % 400 === 0)) {
                    endTime = 86400 * 29 + startTime;
                } else {
                    endTime = 86400 * 28 + startTime;
                }
            } else {
                endTime = 86400 * 30 + startTime;
            }
        }
        arr.push([startTime, endTime]);
        startTime = endTime;
    }

    let sleep = function (start, end) {
        return new Promise(function (resolve, reject) {
            Srzcs.aggregate([{$match: {$and: [{time: {$lte: start}}, {time: {$gt: end}}]}}, {
                $group: {
                    _id: '$type',
                    total: {$sum: '$price'}
                }
            }], (err, num1) => {
                resolve(num1);
            });
        })
    };
    let start = async function () {
        let result = [];
        for (let a = 0; a < 12; a++) {
            result.push(await sleep(arr[a][1], arr[a][0]));
        }
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: result
        });
    };
    start();
});

// 月统计图
router.get('/readmouthtjt', (req, res) => {
    let {year, mouth, num} = req.query;
    let sleep = function (start, end) {
        return new Promise(function (resolve, reject) {
            Srzcs.aggregate([{$match: {$and: [{time: {$lte: start}}, {time: {$gt: end}}]}}, {
                $group: {
                    _id: '$type',
                    total: {$sum: '$price'}
                }
            }], (err, num1) => {
                resolve(num1);
            });
        })
    };
    let start = async function () {
        let result = [];
        for (let a = 1; a <= num; a++) {
            let stringTime = `${year}-${mouth}-${a} 00:00:00`;
            let mouthStar = Date.parse(new Date(stringTime)) / 1000;
            let endTime = `${year}-${mouth}-${a} 23:59:59`;
            let mouthend = Date.parse(new Date(endTime)) / 1000;
            result.push(await sleep(mouthend, mouthStar));
        }
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: result
        });
    };
    start();
});

// 购表
router.get('/readsrgb', async (req, res) => {
    let {type} = req.query; // 收入

    let result = [];

    let list = await Srzcs.aggregate([{$match: {$and: [{type: parseInt(type)}]}}, {
        $group: {
            _id: '$jbr',
            total: {$sum: '$price'}
        }
    }]);

    result.push(list);

    res.json({
        code: 0,
        msg: "数据获取成功",
        data: result
    });
});

// 读取大类
router.get('/readdalei', (req, res) => {
    let {type} = req.query;
    DxTypes.find({type: type}, {type: 0, _id: 0, sm: 0, __v: 0}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "读取错误大类"
            });
        } else {
            res.json({
                code: 0,
                data: doc
            });
        }
    });
});

// 读取生意伙伴
router.get('/readyshb', (req, res) => {
    readKeHu.find({}, {_id: 0, status: 0}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "读取生意伙伴失败"
            });
        } else {
            Gcxms.find({}, {_id: 0, __v: 0, ip: 0, status: 0, time: 0}, (err, doc1) => {
                Accountzh.find({}, {
                    __v: 0,
                    ip: 0,
                    status: 0,
                    createtime: 0,
                    zzdz: 0,
                    szdz: 0,
                    defaultprice: 0
                }, (err, doc2) => {
                    return res.json({
                        code: 0,
                        msg: "读取项目success",
                        yshb: doc,
                        gcxm: doc1,
                        yhzh: doc2
                    });
                });
            });
        }
    });
});

//读取银行账户收支流水详情
router.get('/readyhzhszls', (req, res) => {
    let {id} = req.query; // 获取查询条件
    Accountzh.find({_id: id}).sort({time:-1}).exec((err, doc) => {
        if (err) {
            res.json({
                code: 1,
                msg: "系统错误",
                data: []
            });
        }
        if (doc.length >= 1) {
            res.json({
                code: 0,
                msg: "获取数据成功",
                data: doc[0].szdz,
            });
        } else {
            return res.json({
                code: 2,
                msg: "没有相关的数据",
                data: []
            });
        }
    });
});

//读取银行账户转账流水详情
router.get('/readyhzzzzls', (req, res) => {
    let {id} = req.query; // 获取查询条件
    Accountzh.find({_id: id}, (err, doc) => {
        if (err) {
            res.json({
                code: 1,
                msg: "数据获取失败",
                data: [],
            });
        } else {
            if (doc.length >= 1) {
                res.json({
                    code: 0,
                    msg: "数据获取成功",
                    data: doc[0].zzdz,
                });
            } else {
                res.json({
                    code: 1,
                    msg: "数据获取失败",
                    data: [],
                });
            }
        }
    });
});

// 读取小类
router.get('/readxtypes', async (req, res) => {
    DxTypes.find({}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "小类获取失败"
            });
        } else {
            let data = [];
            for (item of doc) {
                if (item.sunlist.length >= 1) {
                    for (items of item.sunlist) {
                        data.push(items);
                    }
                }
            }
            return res.json({
                code: 0,
                msg: "小类获取成功",
                data: data
            });
        }
    });
});

router.get('/ts', (req, res) => {
    let total = 0;
    Srzcs.aggregate([{$match: {jbr: '周帅'}}, {$group: {_id: '$type', num: {$sum: '$price'}}}]).exec((err, doc) => {
        if (err) {
            res.json({
                code: 1,
                msg: 'err',
                err_msg: err
            });
        } else {
            res.json({
                code: 0,
                data: doc
            });
        }
    })
});

module.exports = router;