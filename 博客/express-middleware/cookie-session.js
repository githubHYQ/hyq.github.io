var cookieSession = require('cookie-session')
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')


// ================
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['key1'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// ================

app.use(cookieParser())


app.get('/', function (req, res, next) {
    // Update views
    console.log('req.session', req.session)
    // console.log('req.cookies', req.cookies)
    console.log('==========================')
    req.session.views = (req.session.views || 0) + 1

    // 设置session
    req.session.user = {
        name: 'nick'
    }

    // Write response
    res.send(req.session.views + ' views')
})

app.listen(8080)