var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    // res.send('home');
    res.redirect('/posts');
});

module.exports = router