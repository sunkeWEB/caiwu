let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./routes/index');
// 用户操作的路由
let users = require('./routes/users/users');
// 增加 删除 修改 操作路由
let dxtypes = require('./routes/caozuo/caozuo');
// 读取路由
let read = require('./routes/caozuo/read');

let app = express();


// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1');
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",true); //带cookies
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// app.use((req, res, next) => {
//     console.log(req.cookies.username);
//     // if(req.cookies.userid) {  //当前用户已经登录状态
//     //     next();
//     // }else {
//     //     if (req.originalUrl === "/users/register"|| req.originalUrl === "/users/login") {
//     //         next();
//     //     }else{
//     //         res.redirect('/users/login');
//     //     }
//     // }
//     next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
//  添加  删除  修改 路由
app.use('/dxtypes',dxtypes);
// 读取 路由
app.use('/reads',read);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
