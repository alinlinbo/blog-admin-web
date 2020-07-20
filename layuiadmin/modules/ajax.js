layui.define(['index','form'],function (exports) {
    layui.$.ajaxSetup({
        headers : {
            Authorization: "Bearer "+localStorage.getItem('token')
        },
        beforeSend : function(xhr, params) { // 发送请求前触发
            if (params.url.includes('/tinymce.js')){
                return
            }
            params.url = layui.setter.baseUrl+params.url
            if (!params.url.includes('upload')){  //上传文件不需要处理contentType
                if (!params.contentType){
                    params.contentType = 'application/json' //参数格式指定application/jaon
                }
                if (params.contentType==='application/json'||params.contentType==='json'){
                    params.data = JSON.stringify(params.data)   //JSON.stringify()将它转化为json字符串
                }
            }
            if (params.success){
                const  originSuc = params.success
                params.success = function (res) {
                    if (res.code===0){
                        originSuc(res)
                    }else{
                        layer.msg(res.msg)
                    }
                }
            }
            if (!params.error){
                params.error = function (res) {
                    console.log('错误信息',res)
                    if (res.status === 401){
                        layer.msg('登录验证已过期，即将跳转到登录页面', {
                            time: 1000
                        },function(){
                            window.parent.parent.location.href =window.origin+ "/blog-admin-web/views/user/login.html"
                        });
                    } else {
                        layer.msg('错误码：'+res.status+"，错误信息："+res.statusText)
                    }
                }
            }
        },
    });

    var form = layui.form
    form.verify({
        password: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        compareBothPwd:function (value, item) {
            const password = $("input[name='password']").val(),
                repassword = $("input[name='repassword']").val();
            if (password!==repassword){
                return '前后密码不一致'
            }
        },
        username: function(usernameV){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(usernameV)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(usernameV)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(usernameV)){
                return '用户名不能全为数字';
            }
            // if(/[\S]{6,12}$/.test(usernameV)){
            //     return '用户名必须6到12位，且不能出现空格';
            // }
        },
    });
    exports('req', {});

})
