layui.define(['index'],function (exports) {
    const req = function (params) {
        params.url = layui.setter.baseUrl+params.url
        params.data = JSON.stringify(params.data)
        if (!params.contentType){ // 没有提供默认的contentType，就给一个默认值
            params.contentType = 'application/json'
        }
        params.header = {
            Authorization: "Bearer "+localStorage.getItem('token')
        }
        if (params.success){
            const originSuc = params.success
            params.success = function (res) {
                if (res.code===0){
                    originSuc(res)
                }else {
                    layer.msg(res.msg)
                }
            }
        }
        if (!params.error){  /// 没有提供error处理方法，就给一个默认的操作
            params.error = function (res) {
                console.log('错误信息',res)
                // layer.msg('错误码:'+res.status+',错误信息:'+res.statusText)
                layer.msg(`错误码:${res.status},错误信息:${res.statusText}`)
            }
        }
        layui.$.ajax(params)
    }

    //输出test接口
    exports('req', req);
})
