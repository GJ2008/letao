$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();
    //渲染函数
    function render(){
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function( info ){
                console.log(info);
                $('tbody').html(template('tmp',info));
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil( info.total / info.size ),
                    onPageClicked: function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
                
            }
        })


    }
     //手动打开模态框
    $('#addBtn').on('click',function(){
        $('#addModal').modal('show');
         //点击添加分类 请求服务器 渲染一级分类
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 1000,
            },
            dataType: 'json',
            success : function( info ){
                console.log(info);
                $('.dropdown-menu').html(template('dropdownTmp',info))
                
            }
        })
    })

   //图片上传插件方法
   $('#fileupload').fileupload({
        dataType:"json",
        done:function (e, data){
            console.log(data);
            
            $(".img_box img").attr("src", data.result.picAddr);
            $('[name="brandLogo"]').val( data.result.picAddr );
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        },
        
   });
   //点击一级分类 同步到input
   $('.dropdown-menu').on('click','a',function(){
       $('#categoryText').text($(this).text());
        $('[name="categoryId"]').val($(this).data('id'));
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
   })

   $('#form').bootstrapValidator({
    excluded: [],
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
    fields: {
    // 品牌名称
    brandName: {
        //校验规则
        validators: {
        notEmpty: {
            message: "请输入二级分类名称"
        }
        }
    },
    // 一级分类的id
    categoryId: {
        validators: {
        notEmpty: {
            message: "请选择一级分类"
        }
        }
    },
    // 图片的地址
    brandLogo: {
        validators: {
        notEmpty: {
            message: "请上传图片"
        }
        }
    }
    }
   })


   $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
        url: '/category/addSecondCategory',
        type: 'post',
        data: $('#form').serialize(),
        dataType: 'json',
        success: function( info ){
            console.log(info);
            if( info.success){
                $('#categoryText').text("请选择1级分类")
                $('#form').data("bootstrapValidator").resetForm( true );
                $('#addModal').modal("hide");
                currentPage = 1;
                render();
                 // 找到下拉菜单文本重置
                

                // 找到图片重置
                $('#imgBox img').attr("src", "../images/02.jpg")
            }
        }
    })
    });

})