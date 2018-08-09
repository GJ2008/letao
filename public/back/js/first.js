$(function(){
    var currentPage =1 ;
    var pageSize = 5;
    //页面加载时渲染第一页
    render()
    //定义渲染方法
    function render(){
        // ajax请求服务器获取需要渲染数据
        $.ajax({
            //接口文档
            url: '/category/queryTopCategoryPaging',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                //渲染模板和数据组合
                $('tbody').html(template('tmp',info));
                // 根据服务器数据渲染分页 设置点击分页重新渲染功能
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage = page;
                      render();
                    }
                  });
                
            }
        })
    }
   //点击添加按钮,弹出模态框
    $('#add-btn').on('click',function(){
        $('#addModal').modal('show')
    })
    // 表单校验
    $('#form').bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        //3. 指定校验字段
        fields: {
          //校验用户名，对应name表单的name属性
          categoryName: {
            validators: {
              //不能为空
              notEmpty: {
                message: '用户名不能为空'
              },
            }
          },
        }
      });


    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url: '/category/addTopCategory',
            type: 'post',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function( info ){
                console.log(info);
                if( info.success ){
                    $('#addModal').modal('hide')
                    currentPage = 1;
                    render();
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
                
            }
        })
    });


});