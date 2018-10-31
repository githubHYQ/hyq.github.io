var express = require('express')
var multer = require('multer')
var path = require('path')
// var upload = multer({
//     dest: 'uploads/'
// })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

var app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

    console.log('req.body', req.body)
    console.log('req.file', req.file)
    res.send('profile POST');
})


app.listen(8080, () => {
    console.log('App listening on port 8080!');
});