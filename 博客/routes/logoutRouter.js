var express = require('express');
var router = express.Router();
var User = require('../models/User').User;

router.get('/', (req, res) => {
    // 清除 session 里面的user 没有user 就是没登录
    req.session.user = null

    res.redirect('back');
});

module.exports = router