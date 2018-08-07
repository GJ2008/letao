//验证用户是否登录过 ajax请求
if(location.href.indexOf('login.html') === -1){
    $.ajax({
        url: '/employee/checkRootLogin',
        type: 'get',
        dataType: 'json',
        success: function(info){
            if( info.error === 400 ){
                location.href = 'login.html';
            }
        }
    })
};


// 进度条
$(document).ajaxStart(function() {
    // 开启进度条
    NProgress.start();
  })
  
  // 在最后一个ajax请求回来时, 关闭进度条
  $(document).ajaxStop(function() {
  
    // 模拟网络延迟
    setTimeout(function() {
      // 关闭进度条
      NProgress.done();
    }, 500);
  
  });



$(function(){
    //分类下拉菜单
    $('.lt_aside .nav .category').click(function(){
        $('.lt_aside .nav .child').stop().slideToggle();
    })
    // 侧边栏滑动事件
    $('.lt_main .icon_menu').click(function(){
        $('.lt_aside').toggleClass('current');
        $('.lt_main').toggleClass('current');
        $('.lt_main .lt_topbar').toggleClass('current');
    })
    //模态框 ajax请求退出
    $('.modal-footer .btn-logout').click(function(){
        $.ajax({
            url:'/employee/employeeLogout' ,
            type: 'get' ,
            dataType:'json',
            success: function( info ){
                if(info.success){
                    location.href = 'login.html';
                }
                
            }
        })
    })
});