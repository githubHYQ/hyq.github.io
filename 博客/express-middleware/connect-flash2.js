var express = require("express");
var session = require("express-session");
var flash = require("connect-flash");

var app = express();

// 模板引擎
app.set("views", "./views/");
app.set("view engine", "ejs");

// ================
// session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);
// ================

// 使用 flash
app.use(flash());

// 使用中间件
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("flash");
});

app.get("/flash", (req, res) => {
  req.flash("success", "来自/flash路由的提示");
  res.redirect("/");
});

app.get("/about", (req, res) => {
  req.flash("error", "来自/about路由的提示");
  res.redirect("/");
});

app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});
