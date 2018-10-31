var express = require('express');
var router = express.Router();
var User = require('../models/User').User;

router.get('/', (req, res) => {
    // res.send('login GET');

    // res.render('login', {
    //     user: req.session.user
    // });
    // index.js 全局已经设置了 uesr 变量
    res.render('login');
});

router.post('/', (req, res) => {
    console.log('req.body', req.body)
    var username = req.body.username
    var password = req.body.password

    // 校验参数
    try {
        if (!username) {
            throw new Error('用户名不能为空')
        }
        if (!password) {
            throw new Error('密码不能为空')
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }


    // 查找
    User.findOne({
        username: username
    }, (err, resulte) => {
        // console.log('resulte', resulte)
        if (err) {
            console.log('查找用户失败', err)
        }

        if (!resulte) {
            req.flash("error", '用户不存在');
            return res.redirect('back');
        }

        if (resulte.password != password) {
            req.flash("error", '密码错误');
            res.redirect('back');
        } else {
            // 将当前用户写入 session 以后判断登陆就看session里面有没有 user
            req.session.user = resulte

            // console.log('req.session.user', req.session.user)

            req.flash("success", '登陆成功');
            res.redirect('/posts?author=' + resulte._id);
        }
    })


    // res.send('login POST');
});

module.exports = router