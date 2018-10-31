var express = require('express');
var url = require('url');
var router = express.Router();
var User = require('../models/User').User;
var Post = require('../models/Post').Post;
var Comment = require('../models/Comment').Comment;

var checkLogin = require('../middleware/checkLogin').checkLogin

// 删除留言
router.get('/:commentId/remove', checkLogin, (req, res) => {
    var commentId = req.params.commentId
    Comment.findById(commentId, (err, result) => {
        if (err) {
            console.log('查找留言失败', err)
        }

        // 判断当前登陆用户和这个留言的作者是否一样
        if (result.author == req.session.user._id) {
            // 删掉留言
            Comment.findByIdAndRemove(commentId, (err1, result1) => {
                req.flash("success", '删除留言成功');
                res.redirect('back');

                Post.findById(result1.postId, (err2, result2) => {
                    // console.log('result2', result2)
                    Post.findByIdAndUpdate(result1.postId, {
                        comments: result2.comments - 1
                    }, (err3, result3) => {
                        // console.log('更新评论数成功', result3)
                    })
                })
            })
        } else {
            // 没权限
            req.flash("error", '没有权限删除留言');
            res.redirect('back');
        }

    })
});

// 发表留言
router.post('/:postId', checkLogin, (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.params.postId', req.params.postId)

    var content = req.body.content
    var postId = req.params.postId
    var author = req.session.user._id

    // 校验参数
    try {
        if (!content) {
            throw new Error('评论内容不能为空')
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('back');
        // 阻止代码继续向下执行 校验错误就不要写入数据库
        return
    }

    // console.log(content, postId, author)
    Comment.create({
        postId: postId,
        content: content,
        author: author
    }, (err, result) => {
        if (err) {
            console.log('发布留言失败', err)
        }

        req.flash("success", '发布留言成功');
        res.redirect('back');
        Post.findById(postId, (err1, result1) => {
            // console.log('result1', result1)
            Post.findByIdAndUpdate(postId, {
                comments: result1.comments + 1
            }, (err2, result2) => {
                console.log('result2', result2)
            })
        })

    })

});

module.exports = router