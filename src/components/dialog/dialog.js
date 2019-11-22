import $ from '../../assets/js/jquery.min.js';
! function(window) {
    'use strict';

    var doc = window.document,
        ydui = {};

    $(window).on('load', function() {
        typeof FastClick == 'function' && FastClick.attach(doc.body);
    });

    var util = ydui.util = {

        parseOptions: function(string) {
            if($.isPlainObject(string)) {
                return string;
            }

            var start = (string ? string.indexOf('{') : -1),
                options = {};

            if(start != -1) {
                try {
                    options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
                } catch(e) {}
            }
            return options;
        },

        pageScroll: function() {
            var fn = function(e) {
                e.preventDefault();
                e.stopPropagation();
            };
            var islock = false;
            var supportsPassive = false;

            try {
                var opts = {};
                Object.defineProperty(opts, 'passive', {
                    get() {
                        /* istanbul ignore next */
                        supportsPassive = true;
                    }
                });
                window.addEventListener('test-passive', null, opts);
            } catch(e) {}

            var passive = false;
            return {
                lock: function() {
                    if(islock) return;
                    islock = true;
                    doc.addEventListener(
                        'touchmove',
                        fn,
                        supportsPassive ? {
                            capture: false,
                            passive
                        } : false
                    );
                },
                unlock: function() {
                    islock = false;
                    doc.removeEventListener('touchmove', fn);
                }
            };
        }(),

        localStorage: function() {
            return storage(window.localStorage);
        }(),

        sessionStorage: function() {
            return storage(window.sessionStorage);
        }(),

        serialize: function(value) {
            if(typeof value === 'string') return value;
            return JSON.stringify(value);
        },
        deserialize: function(value) {
            if(typeof value !== 'string') return undefined;
            try {
                return JSON.parse(value);
            } catch(e) {
                return value || undefined;
            }
        },

        setCookie: function(key, value, time) {
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
        getCookie: function(key) {

            // 获取cookie
            var data = document.cookie;
            // 获取key第一次出现的位置    pwd=
            var startIndex = data.indexOf(key + '=');
            //  name=123;pwd=abc
            // 如果开始索引值大于0表示有cookie
            if(startIndex > -1) {

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
        delCookie: function(key) {

            // 获取cookie
            var data = this.getCookie(key);

            // 如果获取到cookie则重新设置cookie的生存周期为过去时间
            if(data !== false) {

                this.set(key, data, -1);

            }

        },
        loadJS: function(url, callback) {
            var script = document.createElement('script'),

                fn = callback || function() {};

            script.type = 'text/javascript';

            // IE

            if(script.readyState) {

                script.onreadystatechange = function() {

                    if(script.readyState == 'loaded' || script.readyState == 'complete') {

                        script.onreadystatechange = null;

                        fn();

                    }

                };

            } else {

                // 其他浏览器

                script.onload = function() {

                    fn();

                };

            }

            script.src = url;

            document.getElementsByTagName('head')[0].appendChild(script);
        }
    };

    function storage(ls) {
        return {
            set: function(key, value) {
                ls.setItem(key, util.serialize(value));
            },
            get: function(key) {
                return util.deserialize(ls.getItem(key));
            },
            remove: function(key) {
                ls.removeItem(key);
            },
            clear: function() {
                ls.clear();
            }
        };
    }

    $.fn.emulateTransitionEnd = function(duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function() {
            called = true;
        });

        var callback = function() {
            if(!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if(typeof define === 'function') {
        define(ydui);
    } else {
        window.YDUI = ydui;
    }

}(window);

/**
 * Device
 */
!function (window) {
    var doc = window.document,
        ydui = window.YDUI,
        ua = window.navigator && window.navigator.userAgent || '';

    var ipad = !!ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = !!ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && !!ua.match(/(iPhone\sOS)\s([\d_]+)/);

    ydui.device = {
        /**
         * 是否移动终端
         * @return {Boolean}
         */
        isMobile: !!ua.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement,
        /**
         * 是否IOS终端
         * @returns {boolean}
         */
        isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        /**
         * 是否Android终端
         * @returns {boolean}
         */
        isAndroid: !!ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        /**
         * 是否ipad终端
         * @returns {boolean}
         */
        isIpad: ipad,
        /**
         * 是否ipod终端
         * @returns {boolean}
         */
        isIpod: ipod,
        /**
         * 是否iphone终端
         * @returns {boolean}
         */
        isIphone: iphone,
        /**
         * 是否webview
         * @returns {boolean}
         */
        isWebView: (iphone || ipad || ipod) && !!ua.match(/.*AppleWebKit(?!.*Safari)/i),
        /**
         * 是否微信端
         * @returns {boolean}
         */
        isWeixin: ua.indexOf('MicroMessenger') > -1,
        /**
         * 是否火狐浏览器
         */
        isMozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
        /**
         * 设备像素比
         */
        pixelRatio: window.devicePixelRatio || 1
    };
}(window);
/**
 * Dialog
 */
! function(window, ydui) {
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
    dialog.confirmSour = function(title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if(args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if(typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if(args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if(typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function() {
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

        $.each(btnArr, function(i, val) {
            var $btn;
            // 指定按钮颜色
            if(typeof val.color == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if(typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function(p) {
                $btn.on('click', function(e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if(!btnArr[p].stay) {
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
    dialog.confirm = function(title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if(args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if(typeof arguments[1] != 'function' && args == 2 && !(arguments[1] instanceof Array)) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if(args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if(typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function() {
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

        $.each(btnArr, function(i, val) {
            var $btn;
            // 指定按钮颜色
            if(val.txt !== '取消') {
                $btn = $('<a href="javascript:;" class="confirm-btn primary">' + (val.txt || '') + '</a>');
            } else  {
                $btn = $('<a href="javascript:;"  class="cancle-btn primary">' + (val.txt || '') + '</a>');
            }
            // 给对应按钮添加点击事件
            (function(p) {
                $btn.on('click', function(e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if(!btnArr[p].stay) {
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
    dialog.shareOnWeb = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
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
        var htmlCom;
        htmlCom = '<div class="m-confirm m-confirm-share">';
        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            htmlCom +
            '<div class="arrow-wrap"></div>' +
            '       <div class="confirm-hd">' +
            '<strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        var $btnBoxWrap = $('<div class="confirm-ft-wrap"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if (val.txt === '取消' || val.txt === '回首页') {
                    $btn = $('<a href="javascript:;" class="' + 'yd-btn-block yd-btn-danger cancle-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                } else {
                    $btn = $('<a href="javascript:;" class="' + 'yd-btn-block yd-btn-danger ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
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
            $btnBoxWrap.append($btnBox);
        });
        $dom.find('.m-confirm').append($btnBoxWrap);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
        $body.click(function(){
            $('#' + ID).remove();
        });
    };
    dialog.notBeigin = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
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
        var htmlCom;
        htmlCom = '<div class="m-confirm m-confirm-share">';
        var $dom = $('' +
            '<div class="mask-black-dialog" id="' + ID + '">' +
            htmlCom +
            '       <div class="confirm-hd">' +
            '<strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        var $btnBoxWrap = $('<div class="confirm-ft-wrap"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                if (val.txt === '取消' || val.txt === '回首页') {
                    $btn = $('<a href="javascript:;" class="' + 'yd-btn-block yd-btn-danger cancle-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
                } else {
                    $btn = $('<a href="javascript:;" class="' + 'yd-btn-block yd-btn-danger ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
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
            $btnBoxWrap.append($btnBox);
        });
        $dom.find('.m-confirm').append($btnBoxWrap);
        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
        $body.click(function(){
            $('#' + ID).remove();
            ydui.util.pageScroll.unlock();
        });
    };
    /**
	 * 弹出警示框
	 * @param mes       提示文字String 【必填】
	 * @param callback  回调函数Function 【可选】
	 */
    dialog.alert = function(mes, callback) {

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

        $dom.find('a').on('click', function() {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };
    /**
	 * 弹出提示层
	 */
    dialog.toast = function() {
        var timer = null;
        /**
		 * @param mes       提示文字String 【必填】
		 * @param type      类型String success or error 【必填】
		 * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
		 * @param callback  回调函数Function 【可选】
		 */
        return function(mes, type, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_TOAST';

            $('#' + ID).remove();

            var args = arguments.length;
            if(args < 2) {
                console.error('From YDUI\'s toast: Please set two or more parameters!!!');
                return;
            }

            var iconHtml = '';
            if(type == 'success' || type == 'error') {
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

            if(typeof timeout === 'function' && arguments.length >= 3) {
                callback = timeout;
                timeout = 2000;
            }

            timer = setTimeout(function() {
                clearTimeout(timer);
                ydui.util.pageScroll.unlock();
                $dom.remove();
                typeof callback === 'function' && callback();
            }, (~~timeout || 2000) + 100); // 100为动画时间
        };
    }();

    /**
	 * 顶部提示层
	 */
    dialog.notify = function() {

        var timer = null;

        /**
		 * @param mes       提示文字String 【必填】
		 * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
		 */
        return function(mes, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_NOTIFY';

            $('#' + ID).remove();

            var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

            $body.append($dom);

            var next = function() {
                $dom.remove();
                typeof callback == 'function' && callback();
            };

            var closeNotify = function() {
                clearTimeout(timer);

                $dom.find('.m-notify').addClass('notify-out');

                $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
            };

            $dom.on('click', closeNotify);

            if(~~timeout > 0) {
                timer = setTimeout(closeNotify, timeout + 200);
            }
        };
    }();

    /**
	 * 加载中提示框
	 */
    dialog.loading = function() {

        var ID = 'YDUI_LOADING';

        return {
            /**
			 * 加载中 - 显示
			 * @param text 显示文字String 【可选】
			 */
            open: function(text) {
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
            close: function() {
                ydui.util.pageScroll.unlock();
                $('#' + ID).remove();
            }
        };
    }();
}(window, YDUI);
/**
 * SendCode Plugin
 */
! function() {
    'use strict';

    function SendCode(element, options) {
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
    SendCode.prototype.start = function() {
        var _this = this,
            options = _this.options,
            secs = options.secs;

        _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(options.disClass);

        _this.timer = setInterval(function() {
            secs--;
            _this.$btn.html(_this.getStr(secs));
            if(secs <= 0) {
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
    SendCode.prototype.getStr = function(secs) {
        return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
    };

    /**
	 * 重置按钮
	 */
    SendCode.prototype.resetBtn = function() {
        var _this = this,
            options = _this.options;
        _this.$btn.html(options.resetStr).css('pointer-events', 'auto').removeClass(options.disClass);
        clearInterval(_this.timer);
        _this.$btn.html('获取验证码');

    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this),
                sendcode = $this.data('ydui.sendcode');

            if(!sendcode) {
                $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
                if(typeof option == 'object' && option.run) {
                    sendcode.start();
                }
            }

            if(typeof option == 'string') {
                sendcode[option] && sendcode[option].apply(sendcode, args);
            }
        });
    }

    $.fn.sendCode = Plugin;
}();

/**
 * CitySelect Plugin
 */
!function (window) {
    'use strict';

    var $body = $(window.document.body);

    function CitySelect (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CitySelect.DEFAULTS, options || {});
        this.init();
    }

    CitySelect.DEFAULTS = {
        provance: '',
        city: '',
        area: ''
    };

    CitySelect.prototype.init = function () {
        var _this = this,
            options = _this.options;

        if (typeof YDUI_CITYS == 'undefined') {
            console.error('请在ydui.js前引入ydui.citys.js。下载地址：http://cityselect.ydui.org');
            return;
        }

        _this.citys = YDUI_CITYS;

        _this.createDOM();

        _this.defaultSet = {
            provance: options.provance,
            city: options.city,
            area: options.area
        };
    };

    CitySelect.prototype.open = function () {
        var _this = this;

        $body.append(_this.$mask);

        // 防止火狐浏览器文本框丑丑的一坨小水滴
        YDUI.device.isMozilla && _this.$element.blur();

        _this.$mask.on('click.ydui.cityselect.mask', function () {
            _this.close();
        });

        var $cityElement = _this.$cityElement,
            defaultSet = _this.defaultSet;

        $cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-next cityselect-prev');

        _this.loadProvance();

        if (defaultSet.provance) {
            _this.setNavTxt(0, defaultSet.provance);
        } else {
            $cityElement.find('.cityselect-nav a').eq(0).addClass('crt').html('请选择');
        }

        if (defaultSet.city) {
            _this.loadCity();
            _this.setNavTxt(1, defaultSet.city);
        }

        if (defaultSet.area) {
            _this.loadArea();
            _this.ForwardView(false);
            _this.setNavTxt(2, defaultSet.area);
        }

        $cityElement.addClass('brouce-in');
    };

    CitySelect.prototype.close = function () {
        var _this = this;

        _this.$mask.remove();
        _this.$cityElement.removeClass('brouce-in').find('.cityselect-nav a').removeClass('crt').html('');
        _this.$itemBox.html('');
    };

    CitySelect.prototype.createDOM = function () {
        var _this = this;

        _this.$mask = $('<div class="mask-black"></div>');

        _this.$cityElement = $('' +
            '<div class="m-cityselect">' +
            '    <div class="cityselect-header">' +
            '        <p class="cityselect-title">所在地区</p>' +
            '        <div class="cityselect-nav">' +
            '            <a href="javascript:;" ></a>' +
            '            <a href="javascript:;"></a>' +
            '            <a href="javascript:;"></a>' +
            '        </div>' +
            '    </div>' +
            '    <ul class="cityselect-content">' +
            '        <li class="cityselect-item">' +
            '            <div class="cityselect-item-box"></div>' +
            '        </li>' +
            '        <li class="cityselect-item">' +
            '            <div class="cityselect-item-box"></div>' +
            '        </li>' +
            '        <li class="cityselect-item">' +
            '            <div class="cityselect-item-box"></div>' +
            '        </li>' +
            '    </ul>' +
            '</div>');

        $body.append(_this.$cityElement);

        _this.$itemBox = _this.$cityElement.find('.cityselect-item-box');

        _this.$cityElement.on('click.ydui.cityselect', '.cityselect-nav a', function () {
            var $this = $(this);

            $this.addClass('crt').siblings().removeClass('crt');

            $this.index() < 2 ? _this.backOffView() : _this.ForwardView(true);
        });
    };

    CitySelect.prototype.setNavTxt = function (index, txt) {

        var $nav = this.$cityElement.find('.cityselect-nav a');

        index < 2 && $nav.removeClass('crt');

        $nav.eq(index).html(txt);
        $nav.eq(index + 1).addClass('crt').html('请选择');
        $nav.eq(index + 2).removeClass('crt').html('');
    };

    CitySelect.prototype.backOffView = function () {
        this.$cityElement.find('.cityselect-content').removeClass('cityselect-next')
            .addClass('cityselect-move-animate cityselect-prev');
    };

    CitySelect.prototype.ForwardView = function (animate) {
        this.$cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-prev')
            .addClass((animate ? 'cityselect-move-animate' : '') + ' cityselect-next');
    };

    CitySelect.prototype.bindItemEvent = function () {
        var _this = this,
            $cityElement = _this.$cityElement;

        $cityElement.on('click.ydui.cityselect', '.cityselect-item-box a', function () {
            var $this = $(this);

            if ($this.hasClass('crt'))return;
            $this.addClass('crt').siblings().removeClass('crt');

            var tag = $this.data('tag');

            _this.setNavTxt(tag, $this.text());

            var $nav = $cityElement.find('.cityselect-nav a'),
                defaultSet = _this.defaultSet;

            if (tag == 0) {

                _this.loadCity();
                $cityElement.find('.cityselect-item-box').eq(1).find('a').removeClass('crt');

            } else if (tag == 1) {

                _this.loadArea();
                _this.ForwardView(true);
                $cityElement.find('.cityselect-item-box').eq(2).find('a').removeClass('crt');

            } else {

                defaultSet.provance = $nav.eq(0).html();
                defaultSet.city = $nav.eq(1).html();
                defaultSet.area = $nav.eq(2).html();

                _this.returnValue();
            }
        });
    };

    CitySelect.prototype.returnValue = function () {
        var _this = this,
            defaultSet = _this.defaultSet;

        _this.$element.trigger($.Event('done.ydui.cityselect', {
            provance: defaultSet.provance,
            city: defaultSet.city,
            area: defaultSet.area
        }));

        _this.close();
    };

    CitySelect.prototype.scrollPosition = function (index) {

        var _this = this,
            $itemBox = _this.$itemBox.eq(index),
            itemHeight = $itemBox.find('a.crt').height(),
            itemBoxHeight = $itemBox.parent().height();

        $itemBox.parent().animate({
            scrollTop: $itemBox.find('a.crt').index() * itemHeight - itemBoxHeight / 3
        }, 0, function () {
            _this.bindItemEvent();
        });
    };

    CitySelect.prototype.fillItems = function (index, arr) {
        var _this = this;

        _this.$itemBox.eq(index).html(arr).parent().animate({scrollTop: 0}, 10);

        _this.scrollPosition(index);
    };

    CitySelect.prototype.loadProvance = function () {
        var _this = this;

        var arr = [];
        $.each(_this.citys, function (k, v) {
            arr.push($('<a class="' + (v.n == _this.defaultSet.provance ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
                citys: v.c,
                tag: 0
            }));
        });
        _this.fillItems(0, arr);
    };

    CitySelect.prototype.loadCity = function () {
        var _this = this;

        var cityData = _this.$itemBox.eq(0).find('a.crt').data('citys');

        var arr = [];
        $.each(cityData, function (k, v) {
            arr.push($('<a class="' + (v.n == _this.defaultSet.city ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
                citys: v.a,
                tag: 1
            }));
        });
        _this.fillItems(1, arr);
    };

    CitySelect.prototype.loadArea = function () {
        var _this = this;

        var areaData = _this.$itemBox.eq(1).find('a.crt').data('citys');

        var arr = [];
        $.each(areaData, function (k, v) {
            arr.push($('<a class="' + (v == _this.defaultSet.area ? 'crt' : '') + '" href="javascript:;"><span>' + v + '</span></a>').data({tag: 2}));
        });

        if (arr.length <= 0) {
            arr.push($('<a href="javascript:;"><span>全区</span></a>').data({tag: 2}));
        }
        _this.fillItems(2, arr);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                citySelect = $this.data('ydui.cityselect');

            if (!citySelect) {
                $this.data('ydui.cityselect', (citySelect = new CitySelect(this, option)));
            }

            if (typeof option == 'string') {
                citySelect[option] && citySelect[option].apply(citySelect, args);
            }
        });
    }

    $.fn.citySelect = Plugin;

}(window);
/**
 * ydui.util
 */
!function (window) {
    'use strict';

    var util = window.YDUI.util = window.YDUI.util || {},
        doc = window.document;

    /**
     * 日期格式化
     * @param format 日期格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 单位 毫秒
     * @returns {string}
     */
    util.timestampTotime = function (format, time,callback) {
        var t = {},
		    left_time = time,
            floor = Math.floor;

        t.f = time % 1000;
        time = floor(time / 1000);
        t.s = time % 60;
        time = floor(time / 60);
        t.m = time % 60;
        time = floor(time / 60);
        t.h = time % 24;
        t.d = floor(time / 24);

        var ment = function (a) {
            if (a <= 0) {
                return '';
            }
            return '$1' + (a < 10 ? '0' + a : a) + '$2';
        };

        format = format.replace(/\{([^{]*?)%d(.*?)\}/g, ment(t.d));
        format = format.replace(/\{([^{]*?)%h(.*?)\}/g, ment(t.h));
        format = format.replace(/\{([^{]*?)%m(.*?)\}/g, ment(t.m));
        format = format.replace(/\{([^{]*?)%s(.*?)\}/g, ment(t.s));
        format = format.replace(/\{([^{]*?)%f(.*?)\}/g, ment(t.f));

        var obj = {
            day:t.d,
            h:t.h < 10 ? '0' + t.h:t.h,
            m:t.m < 10 ? '0' + t.m:t.m,
            s:t.s < 10 ? '0' + t.s:t.s
        };
		
        if (left_time > 0) {
            typeof callback == 'function' && callback(obj);
        }
        return format;
    };
    util.dayjs = function (){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        var obj = {
            y:year,
            m:month,
            d:strDate
        }
        return obj;
    }
    /**
     * js倒计时
     * @param format 时间格式 {%d}天{%h}时{%m}分{%s}秒{%f}毫秒
     * @param time 结束时间时间戳 毫秒
     * @param speed 速度
     * @param callback ret 倒计时结束回调函数 ret 时间字符 ；ret == '' 则倒计时结束
     * DEMO: YDUI.util.countdown('{%d天}{%h时}{%m分}{%s秒}{%f毫秒}', Date.parse(new Date()) + 60000, 1000, function(ret){ console.log(ret); });
     */
    util.countdown = function (format, time, speed, callback) {
        var that = this;
        var timer = setInterval(function () {
            var l_time = time - new Date().getTime();
			
            if (l_time > 0) {
                that.timestampTotime(format, l_time,callback);
            } else {
                clearInterval(timer);
                typeof callback == 'function' && callback('end');
            }
        }, speed);
    };

    /**
     * js 加减乘除
     * @param arg1 数值1
     * @param op 操作符string 【+ - * /】
     * @param arg2 数值2
     * @returns {Object} arg1 与 arg2运算的精确结果
     */
    util.calc = function (arg1, op, arg2) {
        var ra = 1, rb = 1, m;

        try {
            ra = arg1.toString().split('.')[1].length;
        } catch (e) {
        }
        try {
            rb = arg2.toString().split('.')[1].length;
        } catch (e) {
        }
        m = Math.pow(10, Math.max(ra, rb));

        switch (op) {
        case '+':
        case '-':
            arg1 = Math.round(arg1 * m);
            arg2 = Math.round(arg2 * m);
            break;
        case '*':
            ra = Math.pow(10, ra);
            rb = Math.pow(10, rb);
            m = ra * rb;
            arg1 = Math.round(arg1 * ra);
            arg2 = Math.round(arg2 * rb);
            break;
        case '/':
            arg1 = Math.round(arg1 * m);
            arg2 = Math.round(arg2 * m);
            m = 1;
            break;
        }
        try {
            var result = eval('(' + '(' + arg1 + ')' + op + '(' + arg2 + ')' + ')/' + m);
        } catch (e) {
        }
        return result;
    };

    /**
     * 读取图片文件 并返回图片的DataUrl
     * @param obj
     * @param callback
     */
    util.getImgBase64 = function (obj, callback) {
        var that = this, dataimg = '', file = obj.files[0];
        if (!file)return;
        if (!/image\/\w+/.test(file.type)) {
            that.tipMes('请上传图片文件', 'error');
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            dataimg = this.result;
            typeof callback === 'function' && callback(dataimg);
        };
    };

    /**
     * 获取地址栏参数
     * @param name
     * @returns {*}
     */
    util.getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
            r = window.location.search.substr(1).match(reg),
            qs = '';
        if (r != null)qs = decodeURIComponent(r[2]);
        return qs;
    };

}(window);