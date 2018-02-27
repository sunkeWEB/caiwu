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

    $.fmoney = function(v, len, split) {
        split = split || ",", len = Math.abs((+len) % 20 || 2);
        v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(len) + "";
        return v.replace(/\d+/, function (v) {
                let lit = v.length % 3 === 0;
                let index = lit ? v.length - 3 : -1;
                return v.split('').reverse().join('').replace(/\d{3}/g, function (k, l) {
                    return k + ((l === index && lit) ? "" : split);
                }).split('').reverse().join('')
            }
        );
    }


})(jQuery);