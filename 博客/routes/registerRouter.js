var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer')
var User = require('../models/User').User;
var fs = require('fs')

// =========
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

// =========

router.get('/', (req, res) => {
    // res.send('register GET');
    res.render('register');
});

router.post('/', upload.single('avatar'), (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.file', req.file)

    var username = req.body.username
    var password = req.body.password
    var gender = req.body.gender
    var profile = req.body.profile
    var avatar = req.file

    // 校验参数
    try {
        if (!username) {
            throw new Error('用户名不能为空')
        }
        if (!password) {
            throw new Error('密码不能为空')
        }
        if (!profile) {
            throw new Error('简介不能为空')
        }
        if (!avatar) {
            throw new Error('头像不能为空')
        }
    } catch (e) {
        // 注册失败，删掉头像文件
        if (avatar) {
            fs.unlink(avatar.path, (err) => {
                if (err) {
                    console.log('删除头像失败', err)
                } else {
                    console.log('删除头像成功')
                }
            })
        }

        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }


    //写入数据库
    User.create({
        username: username,
        password: password,
        gender: gender,
        profile: profile,
        avatar: avatar.filename
    }, (err, result) => {
        if (err) {
            console.log('注册写入数据库失败', err)
            req.flash("success", '用户名已存在');
            res.redirect('/login');
        } else {
            // 将当前用户写入 session 以后判断登陆就看session里面有没有 user
            req.session.user = result


            console.log('注册成功')
            req.flash("success", '注册成功');
            res.redirect('/login');
        }
    })

    // res.send('register POST');
    // req.flash("error", "flash提示");
    // req.flash("success", "success提示");
    // res.redirect('back');
});

module.exports = router