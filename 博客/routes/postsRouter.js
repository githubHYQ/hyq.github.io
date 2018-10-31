var express = require('express');
var url = require('url');
var router = express.Router();
var User = require('../models/User').User;
var Post = require('../models/Post').Post;
var Comment = require('../models/Comment').Comment;

var checkLogin = require('../middleware/checkLogin').checkLogin

router.get('/', (req, res) => {
    // res.send('posts GET');

    var author = url.parse(req.url, true).query.author
    var whereStr
    if (!author) {
        // 所有文章列表
        // http://localhost:8080/posts
        whereStr = {}
    } else {
        // 某一个作者的所有文章页面 文章列表页面
        // console.log('tag', url.parse(req.url, true).query.author)
        // http://localhost:8080/posts?author=5bd03846bc8e8f3b3cdfc65f
        whereStr = {
            author: author
        }
    }

    Post.find(whereStr).sort({
        _id: -1
    }).populate('author').exec((err, result) => {
        if (err) {
            console.log('获取作者文章失败', err)
        }
        // console.log('result', result)
        res.render('post-list', {
            posts: result
        });
    })

});

// ===================



// =========================
// 发表文章
router.get('/create', checkLogin, (req, res) => {
    // res.send('posts create  GET');
    res.render('create');
});
router.post('/create', (req, res) => {
    console.log('req.body', req.body)
    var title = req.body.title
    var content = req.body.content
    var author = req.session.user._id
    // 需要验证作者 以防恶意用户修改表单里面的 author字段

    // 校验参数
    try {
        if (!title) {
            throw new Error('标题不能为空')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }

    // 写入数据库
    Post.create({
        title: title,
        content: content,
        author: author
    }, (err, result) => {
        if (err) {
            console.log('发布文章失败', err)
        }

        req.flash("success", '发布文章成功');
        res.redirect('/posts/' + result._id);
    })
});


// =========================
// 文章详情页
router.get('/:postId', (req, res) => {
    // console.log('postId', req.params.postId)
    var postId = req.params.postId

    Post.findById(postId).populate('author').exec((err, result) => {
        // console.log('result', result)

        if (err) {
            console.log('查找文章失败', err)
        }
        // 更新一下 pv
        Post.findByIdAndUpdate(postId, {
            pv: result.pv + 1
        }, (err1, result1) => {
            // console.log('result1', result1)
        })

        // 查找评论
        Comment.find({
            postId: postId
        }).populate('author').exec((err2, result2) => {
            // console.log('result2', result2)

            // 渲染页面
            res.render('post-detail', {
                post: result,
                comments: result2
            });
        })
    })
});



// 删除文章
router.get('/:postId/remove', (req, res) => {
    // console.log('postId', req.params.postId)
    var postId = req.params.postId
    // res.send('value');
    Post.findById(postId, (err, result) => {
        if (err) {
            console.log('查找文章失败', err)
        }
        // console.log('result', result)
        if (req.session.user) {
            // console.log('req.session.user._id', req.session.user._id)
            // 判断当前登陆用户和这篇文章的作者是否一样

            // console.log('req.session.user._id', req.session.user._id)
            // console.log('result.author', result.author)

            if (result.author == req.session.user._id) {
                // 删掉文章
                Post.findByIdAndRemove(postId, (err1, result1) => {
                    req.flash("success", '删除文章成功');
                    res.redirect('/posts');
                })
            } else {
                // 没权限
                req.flash("error", '没有权限删除文章');
                res.redirect('back');
            }
        } else {
            req.flash("error", '请先登录');
            res.redirect('/login');
        }

    })


    // Post.findByIdAndRemove(postId, (err, result) => {
    //     console.log('result嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻', result)

    //     req.flash("success", '删除文章成功');
    //     res.redirect('/posts');
    // })
});


// 编辑文章
router.get('/:postId/edit', (req, res) => {
    var postId = req.params.postId
    var user = req.session.user

    if (user) {
        // 判断用户登录
        Post.findById(postId, (err, result) => {
            // console.log('result', result)
            if (result.author == user._id) {
                // 判断当前登陆用户和这篇文章的作者是否一样
                res.render('edit', {
                    post: result
                });

            } else {
                // 没权限
                req.flash("error", '没权限');
                res.redirect('back');
            }
        })
    } else {
        // 未登录
        req.flash("error", '未登录');
        res.redirect('/login');
    }
})


// 编辑文章
router.post('/:postId/edit', (req, res) => {
    // console.log('req.body', req.body)
    var postId = req.params.postId
    var title = req.body.title
    var content = req.body.content
    var user = req.session.user

    // 校验参数
    try {
        if (!title) {
            throw new Error('标题不能为空')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
        if (!user) {
            throw new Error('未登录')
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }
    Post.findById(postId).populate('author').exec((err, result) => {
        if (result.author._id == user._id) {
            // 判断当前登陆用户和这篇文章的作者是否一样

            Post.findByIdAndUpdate(postId, {
                title: title,
                content: content
            }, (err1, result1) => {
                if (err) {
                    console.log('更是文章失败', err)
                    req.flash("error", '更新文章失败');
                    res.redirect('back');
                }
                req.flash("success", '更新文章成功');
                res.redirect('/posts/' + result1._id);
            })

        } else {
            // 没权限
            req.flash("error", '没权限');
            res.redirect('back');
        }
    })


})

module.exports = router