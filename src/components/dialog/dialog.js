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

        },
        loadJS: function(url, callback) {
			var script = document.createElement('script'),

				fn = callback || function() {};

			script.type = 'text/javascript';

			//IE

			if(script.readyState) {

				script.onreadystatechange = function() {

					if(script.readyState == 'loaded' || script.readyState == 'complete') {

						script.onreadystatechange = null;

						fn();

					}

				};

			} else {

				//其他浏览器

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
	 * 弹窗层
	 * @param opts  回调函数Function 【必填】
	 * @constructor
	 */

	dialog.popLayer = function(options) {
		var empty = {};
		var defaults = {
			url: "",
			opts: null,
			h: 9.8
		};
		var settings = $.extend(empty, defaults, options);
		var ID = 'YDUI_CONFRIM';
		var H = null;
		var h = settings.h;
		var opts = settings.opts
		var url = settings.url
		try {
			H = h
		} catch(e) {

		}
		$('#' + ID).remove();

		var html = '<iframe data-h="9.8" width="100%" border="0" scrolling="no" marginwidth="0" marginheight="0" allowtransparency="yes" frameborder="0" class="pop-ifram" '
		if(H) {
			html = '<iframe data-h="' + H + '" width="100%" border="0" scrolling="no" marginwidth="0" marginheight="0" allowtransparency="yes" frameborder="0" class="pop-ifram" '
		}
		var $dom = $('' +
			'<div class="mask-black-dialog" id="' + ID + '">' +
			'   <div class="m-confirm">' + html +
			'src="' + url + '" > </iframe>' +
			'   </div>' +
			'</div>');

		// 禁止滚动屏幕【移动端】
		ydui.util.pageScroll.lock();

		$('body', window.parent.document).addClass('body-no-scroll');
		$('html', window.parent.document).addClass('body-no-scroll');

		$body.append($dom);
		var $ifram = $('.pop-ifram');
		var hobj = $ifram.data();
		try {
			var fs = $('html').attr("fs")
			if(!fs) { //pc端
				throw new errorMsg('pc')
			}
			$ifram.css('height', hobj.h * fs + 'px')
		} catch(error) {
			$ifram.css('height', '560px');
			$ifram.on('load', function() {
				var $ibody = $ifram.contents().find("body") // 父页面操作子页面元素
				$ibody.addClass('pc-type')
				if(url.indexOf('login') > -1) {
					$ibody.addClass('pc-type-login') // 登录弹框标识
				}
			})
		}
		sessionStorage.setItem('popType', true)
		opts && opts();
	};
    dialog.closePopLayer = function(){
    	 $('#YDUI_CONFRIM').remove();
    }

}(window, YDUI);
