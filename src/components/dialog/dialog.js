import $ from '../../assets/js/jquery.min.js';
!function (window) {
    'use strict';

    var doc = window.document,
        ydui = {};


    $(window).on('load', function () {
        typeof FastClick == 'function' && FastClick.attach(doc.body);
    });

    var util = ydui.util = {

        parseOptions: function (string) {
            if ($.isPlainObject(string)) {
                return string;
            }

            var start = (string ? string.indexOf('{') : -1),
                options = {};

            if (start != -1) {
                try {
                    options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
                } catch (e) {
                }
            }
            return options;
        },

        pageScroll: function () {
            var fn = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };
            var islock = false;

            return {
                lock: function () {
                    if (islock) return;
                    islock = true;
                    doc.addEventListener('touchmove', fn);
                },
                unlock: function () {
                    islock = false;
                    doc.removeEventListener('touchmove', fn);
                }
            };
        }(),

        localStorage: function () {
            return storage(window.localStorage);
        }(),

        sessionStorage: function () {
            return storage(window.sessionStorage);
        }(),

        serialize: function (value) {
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        },
        deserialize: function (value) {
            if (typeof value !== 'string') return undefined;
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || undefined;
            }
        },

        setCookie: function (key, value, time) {
            // 默认保存时间
            var time = time || 60;
            // 获取当前时间
            var cur = new Date();

            var undefined;

            // 设置指定时间
            cur.setTime(cur.getTime() + time * 1000);

            // 创建cookie  并且设置生存周期为GMT时间
            document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + (time === undefined ? '' : cur.toGMTString());

        },
        getCookie: function (key) {

            // 获取cookie
            var data = document.cookie;
            // 获取key第一次出现的位置    pwd=
            var startIndex = data.indexOf(key + '=');
            //  name=123;pwd=abc
            // 如果开始索引值大于0表示有cookie
            if (startIndex > -1) {

                // key的起始位置等于出现的位置加key的长度+1
                startIndex = startIndex + key.length + 1;

                // 结束位置等于从key开始的位置之后第一次;号所出现的位置

                var endIndex = data.indexOf(';', startIndex);

                // 如果未找到结尾位置则结尾位置等于cookie长度，之后的内容全部获取
                endIndex = endIndex < 0 ? data.length : endIndex;
                return decodeURIComponent(data.substring(startIndex, endIndex));


            } else {

                return '';
            }

        },
        delCookie: function (key) {

            // 获取cookie
            var data = this.getCookie(key);

            // 如果获取到cookie则重新设置cookie的生存周期为过去时间
            if (data !== false) {

                this.set(key, data, -1);

            }

        }
    };

    function storage(ls) {
        return {
            set: function (key, value) {
                ls.setItem(key, util.serialize(value));
            },
            get: function (key) {
                return util.deserialize(ls.getItem(key));
            },
            remove: function (key) {
                ls.removeItem(key);
            },
            clear: function () {
                ls.clear();
            }
        };
    }

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if (typeof define === 'function') {
        define(ydui);
    } else {
        window.YDUI = ydui;
    }

}(window);
/**
 * Dialog
 */
!function (window, ydui) {
    'use strict';

    var dialog = ydui.dialog = ydui.dialog || {},
        $body = $(window.document.body);

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirmSour = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');

        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });

        $dom.find('.m-confirm').append($btnBox);

        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.confirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd">' +
            '<strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                       
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.orderConfirm = function (obj, opts) {
        var title = obj['title'],
        phone = obj['phone'],
        mes =  obj['mes'];
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm order-confirm">' +
            '       <div class="confirm-hd">' +
            '       <strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' +
            '          <div class="phone-title">您的手机号码' + '<span class="phone-num">' +phone+ '</span>' +
            '          </div>' +  mes +
            '   </div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('关闭')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'close-icon  ' + (val.color ? 'primary' : '' ) + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                       
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.getPhoneConfirm = function (obj, opts) {
        var argsObj = {
            fade:true,
        };
        argsObj = $.extend({},argsObj,obj);
        var fade= argsObj['fade'];
        var title = argsObj['title'];
        var phoneNum = argsObj['phoneNum'];
        var mes = argsObj['mes'];
        var ID = 'YDUI_CONFRIM-FADE';
        var args = arguments.length;

        if (args == 1) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm get-phone-confirm">' +
            '       <div class="confirm-hd">' +
            '<strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes +
            '       <div class="confirm-phone-wrap">' +
            '<div class="phone-title">' + '您的手机号码' + '</div>' +
            '<div class="phone-num-wrap">' +
            ' <div class="phone-num item">'+ phoneNum + '</div>' +
            ' <div class="change-phone item">切换号码</div>' +
            ' </div>' +
            ' </div>' +
            '</div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('拒绝')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn reject-cancel-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('关闭')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'close-icon  ' + (val.color ? 'primary' : '' ) + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }
                else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default ') +(val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        var fade =  $(this).hasClass('need-fade');
                        if(fade){ // 开启平滑删除效果
                            $dom.find('.m-confirm').addClass('m-confirm-out');
                            $('#' + ID).addClass('mask-black-dialog-fade-out');
                        }else{
                            $dom.find('.m-confirm').removeClass('m-confirm-out');
                            $dom.remove();
                        }
                        setTimeout(function(){
                            $dom.remove();
                        },1000);
                       
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.loginConfirm = function (obj, opts) {
        var argsObj = {
            fade:true,
        };
        argsObj = $.extend({},argsObj,obj);
        var fade= argsObj['fade'];
        var title = argsObj['title'];
        var phoneNum = argsObj['phoneNum'];
        var mes = argsObj['mes'];
        var ID = 'YDUI_CONFRIM-FADE';
        var args = arguments.length;

        if (args == 1) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm get-phone-confirm">' +
            '       <div class="confirm-hd">' +
            '<strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes +
            '       <div class="confirm-phone-wrap login-by-num-wrap">' +
            '<div class="el-input ">' +'<input type="number" autocomplete="off " placeholder="请输入您的手机号码"  class="el-input-inner yanzheng-code">' + '</div>' +
            '<div class="valid-phone valid-item">手机号错误</div>'+
            '<div class="el-input">' +
            ' <input type="text" autocomplete="off" placeholder="请输入短信验证码"  class="el-input-inner tel-input">' +
            ' <button type="button " class="btn btn-warning" id="J_GetCode">获取验证码</button>' +
            ' </div>' +
            '<div class="valid-code valid-item">验证码错误</div>'+
            ' </div>' +
            '</div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default ') +  (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('拒绝')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn reject-cancel-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('已领取')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn has-get-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }
                else if(val.txt.indexOf('关闭')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'close-icon  ' + (val.color ? 'primary' : '') + '">' + (val.txt || '') + (val.fade ? 'need-fade' : '') +'</a>');
                }
                else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        var fade =  $(this).hasClass('need-fade');
                        if(fade){ // 开启平滑删除效果
                            $dom.find('.m-confirm').addClass('m-confirm-out');
                            $('#' + ID).addClass('mask-black-dialog-fade-out');
                        }else{
                            $dom.find('.m-confirm').removeClass('m-confirm-out');
                            $dom.remove();    
                        }
                        setTimeout(function(){
                            $dom.remove();
                        },1000);
                       
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.guide3Confirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog m-confirm-guide-3-mask" id="' + ID + '">' +
            '   <div class="m-confirm m-confirm-guide-3">' +
            '       <div class="confirm-hd ">' +
            '    <div class="confirm-hd-guide-3-top">'+
            '    </div>'+
            '    <div class="confirm-bd confirm-bd-simple">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft confirm-ft-guid3 confirm-ft-simple"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('马上安装')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn install-btn ' + (val.color ? 'primary' : 'default ') + (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('关闭')>-1){
                    $btn = $('<a href="javascript:;" class="' + 'close-icon  ' + (val.color ? 'primary' : '') + (val.fade ? 'need-fade' : '') +'">' + (val.txt || '') + '</a>');
                }else if(val.txt.indexOf('应用')>-1){
                    $btn = $('<div" class="' + 'app' + (val.color ? 'primary ' : '') +  (val.fade ? 'need-fade' : '') +'">' + '<div class="app-name">'+ (val.txt || '')+'</div>' +'</div>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();
                    var tag = $(this).find('.app-name').text().indexOf('应用')>-1;
                    if(tag)return
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                   
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.guide1Confirm = function (title, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

       var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog m-confirm-guide-1-mask" id="' + ID + '">' +
            '<i class="guid1-arrow"></i>'+
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd ">' +
            '  <div class="confirm-title">'+
            '   <div class="info">点按</div>'+
            '   <div class="info simple">...</div>'+
            '   <div class="info">' + title +'</div>'+
            '  </div>'+
            '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft confirm-ft-simple"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.guide2Confirm = function (title, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

       var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog m-confirm-guide-2-mask" id="' + ID + '">' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd ">' +
            '  </div>'+
            '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft confirm-ft-simple"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    dialog.simpleConfirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            '   <div class="m-confirm m-confirm-simple">' +
            '       <div class="confirm-hd ">' +
            '<strong class="confirm-title  confirm-title-simple">' + title + '</strong></div>' +
            '       <div class="confirm-bd confirm-bd-simple">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft confirm-ft-simple"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if(!val.txt){
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn hide-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }else{
                    $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                }
                
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });
        $dom.find('.m-confirm').append($btnBox);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };
    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {

        var ID = 'YDUI_ALERT';

        $('#' + ID).remove();

        var $dom = $('' +
            '<div id="' + ID + '">' +
            '   <div class="mask-black-dialog">' +
            '       <div class="m-confirm m-alert">' +
            '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '           <div class="confirm-ft">' +
            '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };
    dialog.alert = function (mes, callback) {

        var ID = 'YDUI_ALERT';

        $('#' + ID).remove();

        var $dom = $('' +
            '<div id="' + ID + '">' +
            '   <div class="mask-black-dialog">' +
            '       <div class="m-confirm m-alert">' +
            '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '           <div class="confirm-ft">' +
            '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };
    /**
     * 弹出提示层
     */
    dialog.toast = function () {
        var timer = null;
        /**
         * @param mes       提示文字String 【必填】
         * @param type      类型String success or error 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         * @param callback  回调函数Function 【可选】
         */
        return function (mes, type, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_TOAST';

            $('#' + ID).remove();

            var args = arguments.length;
            if (args < 2) {
                console.error('From YDUI\'s toast: Please set two or more parameters!!!');
                return;
            }

            var iconHtml = '';
            if (type == 'success' || type == 'error') {
                iconHtml = '<div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>';
            }

            var $dom = $('' +
                '<div class="mask-white-dialog" id="' + ID + '">' +
                '    <div class="m-toast ' + (iconHtml == '' ? 'none-icon' : '') + '">' + iconHtml +
                '        <p class="toast-content">' + (mes || '') + '</p>' +
                '    </div>' +
                '</div>');

            ydui.util.pageScroll.lock();

            $body.append($dom);

            if (typeof timeout === 'function' && arguments.length >= 3) {
                callback = timeout;
                timeout = 2000;
            }

            timer = setTimeout(function () {
                clearTimeout(timer);
                ydui.util.pageScroll.unlock();
                $dom.remove();
                typeof callback === 'function' && callback();
            }, (~~timeout || 2000) + 100);// 100为动画时间
        };
    }();

    /**
     * 顶部提示层
     */
    dialog.notify = function () {

        var timer = null;

        /**
         * @param mes       提示文字String 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         */
        return function (mes, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_NOTIFY';

            $('#' + ID).remove();

            var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

            $body.append($dom);

            var next = function () {
                $dom.remove();
                typeof callback == 'function' && callback();
            };

            var closeNotify = function () {
                clearTimeout(timer);

                $dom.find('.m-notify').addClass('notify-out');

                $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
            };

            $dom.on('click', closeNotify);

            if (~~timeout > 0) {
                timer = setTimeout(closeNotify, timeout + 200);
            }
        };
    }();

    /**
     * 加载中提示框
     */
    dialog.loading = function () {

        var ID = 'YDUI_LOADING';

        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            open: function (text) {
                $('#' + ID).remove();

                var $dom = $('' +
                    '<div class="mask-white-dialog" id="' + ID + '">' +
                    '   <div class="m-loading">' +
                    '       <div class="loading-icon"></div>' +
                    '       <div class="loading-txt">' + (text || '数据加载中') + '</div>' +
                    '   </div>' +
                    '</div>').remove();

                ydui.util.pageScroll.lock();
                $body.append($dom);
            },
            /**
             * 加载中 - 隐藏
             */
            close: function () {
                ydui.util.pageScroll.unlock();
                $('#' + ID).remove();
            }
        };
    }();
}(window, YDUI);
/**
 * SendCode Plugin
 */
!function () {
    'use strict';

    function SendCode (element, options) {
        this.$btn = $(element);
        this.options = $.extend({}, SendCode.DEFAULTS, options || {});
    }

    SendCode.DEFAULTS = {
        run: false, // 是否自动倒计时
        secs: 60, // 倒计时时长（秒）
        disClass: '', // 禁用按钮样式
        runStr: '{%s}秒后重新获取', // 倒计时显示文本
        resetStr: '重新获取验证码' // 倒计时结束后按钮显示文本
    };

    SendCode.timer = null;

    /**
     * 开始倒计时
     */
    SendCode.prototype.start = function () {
        var _this = this,
            options = _this.options,
            secs = options.secs;

        _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(options.disClass);

        _this.timer = setInterval(function () {
            secs--;
            _this.$btn.html(_this.getStr(secs));
            if (secs <= 0) {
                _this.resetBtn();
                clearInterval(_this.timer);
            }
        }, 1000);
    };

    /**
     * 获取倒计时显示文本
     * @param secs
     * @returns {string}
     */
    SendCode.prototype.getStr = function (secs) {
        return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
    };

    /**
     * 重置按钮
     */
    SendCode.prototype.resetBtn = function () {
        var _this = this,
            options = _this.options;
        _this.$btn.html(options.resetStr).css('pointer-events', 'auto').removeClass(options.disClass);
        clearInterval(_this.timer);
        _this.$btn.html('获取验证码');
        
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var $this = $(this),
                sendcode = $this.data('ydui.sendcode');
                
            if (!sendcode) {
                $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
                if (typeof option == 'object' && option.run) {
                    sendcode.start();
                }
            }
           
            if (typeof option == 'string') {
                sendcode[option] && sendcode[option].apply(sendcode, args);
            }
        });
    }

    $.fn.sendCode = Plugin;
}();