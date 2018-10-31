var express = require('express');
var bodyParser = require('body-parser');
// 服务器运行就链接数据库
var db = require('./lib/mongoose').db;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var flash = require("connect-flash");

var app = express()

// 使用静态托管
app.use(express.static('public'));

// 使用模板引擎
app.set('views', './views/');
app.set('view engine', 'ejs');

// 使用body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// 使用 session
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        store: new MongoStore({
            mongooseConnection: db
        })
    })
);

// 使用 flash
app.use(flash());

// set flash 每一次响应请求 带的参数
app.use((req, res, next) => {
    // console.log('success', req.flash("success"))
    // console.log('error', req.flash("error"))
    res.locals.user = req.session.user

    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    next();
});

// 路由
app.use('/', require('./routes/indexRouter'));
app.use('/login', require('./routes/loginRouter'));
app.use('/logout', require('./routes/logoutRouter'));
app.use('/register', require('./routes/registerRouter'));
app.use('/posts', require('./routes/postsRouter'));
app.use('/comments', require('./routes/commentsRouter'));



app.listen(8080, () => {
    console.log('App listening on port 8080!');
});