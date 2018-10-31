// 由于性能的原因，工具提示和弹出框的 data 编程接口（data api）是必须要手动初始化的。
$(function () {
  $('[data-toggle="popover"]').popover();
});

// 鼠标指到头像上弹出简介
$('[data-toggle="popover"]').hover(
  function () {
    $(this).popover("show");
  },
  function () {
    $(this).popover("hide");
  }
);

// 鼠标指到评论显示删除
$(".comment .media").hover(
  function () {
    $(this)
      .find(".delete")
      .show();
  },
  function () {
    $(this)
      .find(".delete")
      .hide();
  }
);

// 页面加载3秒之后 关闭信息提示框
setTimeout(() => {
  $('.notification .alert').alert('close')
}, 3000);