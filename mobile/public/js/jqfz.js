(function ($) {

    'use strict';

    /**
     *  url 删除的url
     *  id  删除的地址
     */
    $.deletelData = function (url, id) {
        var result = {};  // 返回的结果
        if (url == '' || id == '') {
            result = {
                code: 1,
                msg: "url或者id错误"
            };
        } else {
            $.ajax({
                url: url,
                type: 'post',
                async: false,
                data: {id: id},
                dataType: 'json',
                success: function (res) {
                    result = res;
                }
            });
        }
        return result;
    };

    /**
     *
     * @param url 更改的地址
     * @param id  条件
     * @param data  更改的数据
     */
    $.updateData = function (url, id, data) {  //data 传递的是对象  这里要把他解耦出来
        var result = {};  // 返回的结果
        if (url == '' || id == '') {
            result = {
                code: 1,
                msg: "url或者id错误"
            };
        } else {
            $.ajax({
                url: url,
                type: 'post',
                async: false,
                data: {sid: id, data: JSON.stringify(data)},
                dataType: 'json',
                success: function (res) {
                    result = res;
                }
            });
        }
        return result;
    };

    /**
     *
     * @param url  读取的的url
     * @param id 条件
     */
    $.readData = function (url, id) {
        var result = {};  // 返回的结果
        if (url == '' || id == '') {
            result = {
                code: 1,
                msg: "url或者id错误"
            };
        } else {
            $.ajax({
                url: url,
                type: 'get',
                async: false,
                data: {sid: id},
                dataType: 'json',
                success: function (res) {
                    result = res;
                }
            });
        }
        return result;
    };

    //  导出需要
    $.DoOnMsoNumberFormat = function (cell, row, col) {
        var result = "";
        if (row > 0 && col == 0)
            result = "\\@";
        return result;
    }

    //  删除导出功能
    $.delDaochu = function ($table) {
        $table.bootstrapTable('refreshOptions', {
            showExport: false
        });
        $table = "";  // 防止用户执行可行代码 找回功能
        $('.selecrex').remove();
        return "";
    };


    $.auth = function () {
        var authresult = {};
        if (false) {
        } else {
            $.ajax({
                url: 'http://'+location.hostname+':3000/users/auth',
                type: 'post',
                xhrFields: {
                    withCredentials: true
                },
                async: false,
                crossDomain: true,
                dataType: 'json',
                success: function (res) {

                    if (res.data.length===0) {
                        location.href = "login.html";
                    }

                    if (res.data == undefined) {  // 修改页面之后用户回退
                        location.href = "login.html";
                    } else {
                        authresult = res.data;
                    }

                }
            });
        }
        return authresult;
    };

    $.formatDate = function (nows) {
        var now = new Date(nows * 1000);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        return year + "-" + month + "-" + date;
    };

    $.fmoney = function (s,n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }

    $.sendAjax =function(ajaxUrl, ajaxType, ajaxData) {
        var type = ajaxType || 'get';  // 默认get请求
        var data = ajaxData || {}; // 默认什么也不带
        var result = {};
        $.ajax({
            url:ajaxUrl,
            type:type,
            async:false,
            data:data,
            dataType:'json',
            success:function (data) {
                result = data;
            },
            error:function (e) {
                console.log(e);
            }
        });
        return result;
    }

})(jQuery);