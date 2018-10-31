var express = require('express')
var session = require('express-session')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('views', './views/');
app.set('view engine', 'ejs');


// =================


// Basic usage
mongoose.connect('mongodb://localhost/connect-mongo')

// ================
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))
// ================

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