var cookieSession = require('cookie-session')
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('views', './views/');
app.set('view engine', 'ejs');

// ================
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['key1'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// ================

// app.use(cookieParser())


app.get('/', function (req, res, next) {
    console.log('req.session', req.session)
    res.render('session', {
        user: req.session.user
    });
})

app.post('/', function (req, res, next) {
    console.log('req.body', req.body)

    req.session.user = req.body
    res.redirect('/');
})

app.listen(8080)