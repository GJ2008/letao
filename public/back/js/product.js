$(function(){
    var currentPage = 1;
    var pageSize = 2;
    var picAddr = [];
    render();
    // 渲染页面函数
    function render(){
        $.ajax({
            url:'/product/queryProductDetailList',
            type: 'get',
            data:{
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function(info){
                // console.log(info);
                // 模板引擎渲染页面
                $('tbody').html( template('productTmp', info));
                // 设置分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil( info.total / info.size),
                    onPageClicked: function(a,b,c,page){
                        currentPage = page;
                        render();

                    }
                })
            }
        })
    }
    // 点击添加商品， 弹出模态框 请求服务器 渲染二级分类
    $('#addBtn').click(function(){
        $("#addModal").modal('show');
        $.ajax({
            url:'/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType: 'json',
            success: function( info ) {
                // console.log(info);
                $('.dropdown-menu').html(template('secondCategotyTmp',info))
                
            }
        })
    })
    //注册渲染的二级分类的事件委托
    $('.dropdown-menu').on('click','a',function(){
        $('#categoryText').text($(this).text());
        $('[name="brandId"]').val($(this).parent().data('id'));
        //手动设置表单校验
        $('#form').data('bootstrapValidator').updateStatus('brandId','Valid');

    })

    //文件上传 动态添加到下面预览
    
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function(e,data){
            // console.log(data);
            picAddr.unshift(data.result);
            $('.img_box').prepend('<img src="'+ data.result.picAddr +'" height="100">')
            console.log(picAddr);
            if(picAddr.length > 3){
                picAddr.pop();
                
                $('.img_box img:last-of-type').remove();
            }
            if(picAddr.length === 3){
                $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
            }
        }
    })


    // 表单校验
    $('#form').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
         
        //表单校验
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            picStatus: {
                validators: {
                  notEmpty: {
                    message: "请上传3张图片"
                  }
                }
              }

        }
    })
    //表单校验完成 阻止默认挑 用ajax提交
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        var formData = $('#form').serialize();
        console.log(formData);
        console.log(picAddr);
        formData +='&picName1='+ picAddr[0].picName + '&picAddr1='+picAddr[0].picAddr;
        formData +='&picName2='+ picAddr[1].picName + '&picAddr2='+picAddr[1].picAddr;
        formData +='&picName3='+ picAddr[2].picName + '&picAddr3='+picAddr[2].picAddr;
        $.ajax({
            url: '/product/addProduct',
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function( info ){
                console.log(info);
                if(info.success){
                    $('#addModal').modal('hide');
                    $('#form').data('bootstrapValidator').resetForm(true);
                    currentPage = 1;
                    render();
                    $('#categoryText').text('请选择二级分类');
                    $('.img_box img').remove();
                    picAddr = [];

                }
                

            }
        })
    })


});