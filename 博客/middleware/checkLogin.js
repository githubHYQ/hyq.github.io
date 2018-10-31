exports.checkLogin = function (req, res, next) {
    // 判断用户是否登陆 如果没登陆不允许 发布文章
    // 判断是否登陆的条件 就是看 session 里面有没有 user
    if (!req.session.user) {
        req.flash("error", '需要登陆');
        return res.redirect('/login');
    }
    next()
}