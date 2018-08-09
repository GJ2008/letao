$(function(){
    // 页面渲染
    var currentPage = 1;
    var pageSize = 5;
    // var total = 1
    render();
    function render(){
        $.ajax({
            url: '/user/queryUser',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success : function( info ){
                // console.log(info);
                var tmp = template('tmp',info);
                $('tbody').html(tmp);
                // console.log(info.total / pageSize);
                // console.log(total);
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                        // console.log(page);
                        currentPage = page;
                        render()
                        
                      //为按钮绑定点击事件 page:当前点击的按钮值
                    }
                  });
                
            }
        })
    }
    


    $('tbody').on('click','.btn',function(){
        $('#userModal').modal("show");
        var id = $(this).parent().data('id');
        var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
        $('#userModal .btn-submitbtn').off('click').on('click',function(){
            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                dataType: 'json',
                success: function( info ){
                    // console.log(info);
                   if(info.success){
                    $('#userModal').modal("hide");
                    render()
                   }
                }
            })
        })
    })
    
    //分页
    
})