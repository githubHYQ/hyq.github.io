var express = require('express');
var session = require('express-session')
var flash = require('connect-flash');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

// 模板引擎
app.set('views', './views/');
app.set('view engine', 'ejs');


// ================
// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
// ================

// 使用 flash
app.use(flash());


// 使用flash 中间件
// set flash 每一次响应请求 带的参数
app.use(function (req, res, next) {
    res.locals.content = '测试内容'
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
});

app.get('/', (req, res) => {

    // req.flash('error', '尚未登陆' + Date.now())
    console.log('req.session', req.session)
    res.render('session', {
        user: req.session.user,
    });
});


app.post('/', (req, res) => {
    req.session.user = req.body
    console.log('req.body', req.body.uesrname)

    req.flash('info', '登陆成功')
    // req.flash('error', '尚未登陆')

    console.log('req.session', req.session)
    res.redirect('/');
});


app.listen(8080, () => {
    console.log(`Server started on port 8080`);
});