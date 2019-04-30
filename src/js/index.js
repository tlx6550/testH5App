/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
 function Picture(options) {
    	var DEFAULTS = {
    		$slideBg: $('.slide-bg'),
    		$slideContainer: $('.slide-container'), // 拼图容器
    		DomSlider: $('.slider')[0],
    		DomBlock: $('.slide-block')[0],
    		$slideBlock: $('.slide-block'),
    		$sldeMsg: $(".slide-msg"),
    		initImgWidth: 574, // 拼图最大宽度
    		Domdocument: window.document,
    		touchEndCallBack: null,
    		initBlockPosi: [],
    		slideImg: "",
    		blockImg: ""
    	};
    	this.options = $.extend({}, DEFAULTS, options || {});
    	this.initMoveBlock()
    }
    
    /**
     * 初始化拼图弹窗
     */
    Picture.prototype.initMoveBlock = function() {
    	var that = this;
    	var options = that.options;
    	options.$slideContainer.show()
    	setTimeout(function() {
    		var initBlockPosi = options.initBlockPosi;
    		options.slideBarWidth = $('.sliderContainer').width()
    		options.slideWidth = $('.slideWidth').width()
    		options.blockImgWidth = $('.slide-block').width()
    		options.slideBgWidth = $('.slide-bg').width()
    		var document = options.Domdocument;
    		that.canMoveWidth = options.slideBarWidth - (options.slideWidth / 2);
    		that.canMoveWidth2 = options.slideBarWidth - options.blockImgWidth;
    		that.radioMov = that.canMoveWidth2 / that.canMoveWidth;
    		that.radioImg = options.slideBgWidth / options.initImgWidth;
    
    		var realTop = initBlockPosi[1] * that.radioImg;
    		$(".slide-block").css("top", realTop);
    		that.touchstart();
    		//使用 $.proxy改变this的上下文，否则这里的that传入之后是指向document对象了！
    		document.addEventListener('touchmove', $.proxy(that.touchmove, that));
    		document.addEventListener('touchend', $.proxy(that.touchend, that));
    	}, 210)
    	var slideImg = options.slideImg,
    		blockImg = options.blockImg;
    	options.$slideBg.attr('src', slideImg);
    	options.$slideBlock.attr('src', blockImg);
    
    };
    
    /**
     * 移动开始
     */
    Picture.prototype.touchstart = function() {
    	var that = this;
    	var options = that.options;
    	var slider = options.DomSlider;
    	slider.addEventListener('touchstart', function(e) {
    		that.originX = e.targetTouches[0].pageX;
    		that.originY = e.targetTouches[0].pageY;
    		that.startTime = e.timeStamp;
    		that.isTouchStart = true;
    	});
    };
    /**
     * 移动
     */
    Picture.prototype.touchmove = function(e) {
    	var that = this;
    	var options = that.options;
    	var slider = options.DomSlider;
    	var block = options.DomBlock;
    	if(!that.isTouchStart) return false;
    	var moveX = e.targetTouches[0].pageX - that.originX;
    	var moveY = e.targetTouches[0].pageY - that.originY;
    	if(moveX < 0 || moveX > that.canMoveWidth) return false;
    	slider.style.left = moveX * that.radioMov + 'px';
    	block.style.left = moveX * that.radioMov + 'px';
    };
    /**
     * 移动结束
     */
    Picture.prototype.touchend = function(e) {
    	var that = this;
    	var options = that.options;
    	var slider = options.DomSlider;
    	if(that.isTouchStart) {
    		var endX = e.changedTouches[0].clientX;
    		var timeStamp = ((e.timeStamp - that.startTime) / 1000).toFixed(2);
    		var posi = parseFloat($('.slide-block').css('left')) / that.radioImg;
    		slider.style.left = '0px';
    		typeof options.touchEndCallBack == 'function' && options.touchEndCallBack(parseInt(posi));
    	}
    	e.stopPropagation();
    	that.isTouchStart = false;
    };
    Picture.prototype.hidePop = function(e) {
    	var that = this,
    		options = that.options,
    		document = options.Domdocument,
    		$slideContainer = options.$slideContainer;
    	that.gloableLockOnTouchend = false;
    	document.removeEventListener('touchmove', $.proxy(that.touchmove, that), false);
    	document.removeEventListener('touchend', $.proxy(that.touchend, that), false);
    	$slideContainer.hide();
    };
    Picture.prototype.resetSlideImg = function(initBlockPosi, slideImgSrc, blockImgSrc) {
    	var initBlockPosi = initBlockPosi.slice();
    	var that = this;
    	var options = that.options;
    	var block = options.DomBlock;
    	var $sldeMsg = options.$sldeMsg
    	block.style.left = initBlockPosi[0] + 'px';
    	var slideImg = options.slideImg,
    		blockImg = options.blockImg;
    	options.$slideBg.attr('src', slideImgSrc);
    	options.$slideBlock.attr('src', blockImgSrc);
    
    	var realTop = initBlockPosi[1] * that.radioImg;
    
    	$(block).css("top", realTop);
    
    	$sldeMsg.removeClass("error").removeClass('success');
    };

/* import '../js/mmdl.js';
import '../js/mmapp.js'; */

!function (window) {
    !function initTel() {
        $('.tel-input').bind('input propertychange', function () {
            var val = $(this).val();
            // 移动号段
            var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
            if (regtel.test(val)) {
                console.log(val);
                $('.tel-yanzheng').hide();
            } else {
                $('.tel-yanzheng').show();
            }
        });
    }();

    /* 普通确认框 */
    var dialog = window.YDUI.dialog;
    // title 没有就不传
    // dialog.confirm('', '您已成功提交MM任我装流浪包订购申请，成功受理信息请以中国移动下发短信为准，目前由于订购用户较多，短信可能有延时，请耐心等待。', [
    //     {
    //         txt: '确定',
    //         color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     }
    //
    // ]);
    // setTimeout(function(){
    //     $('#YDUI_CONFRIM').remove();
    // },5000)
    $('.lklq-btn').click(function () {
        dialog.confirm('', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
            {
                txt: '确定',
                color: false, /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function () {
                    dialog.toast('你点了取消', 'none', 1000);
                }
            }

        ]);
    });
    // 获取验证码逻辑
    var $getCode = $('#J_GetCode');

    /* 定义参数 */
    $getCode.sendCode({
        disClass: 'btn-disabled',
        secs: 10,
        run: false,
        runStr: '{%s}秒后重新获取',
        resetStr: '重新获取验证码'
    });

    $getCode.on('click', function () {
        /* ajax 成功发送验证码后调用【start】 */
        YDUI.dialog.loading.open('发送中');
        setTimeout(function () {

            YDUI.dialog.loading.close();

            $getCode.sendCode('start');
            YDUI.dialog.toast('已发送', 'success', 500);

        }, 500);
    });
    //移动完的回调函数
    var touchEndCallBack = function (x) {
    	console.log('回调函数执行')
        if (x >= 220 && x <= 240) {
            $(".slide-msg").removeClass("error");
            $(".slide-msg").addClass("success");
            $(".slide-msg").html("验证成功!");
        } else {
            $(".slide-msg").removeClass("success");
            $(".slide-msg").addClass("error");
            $(".slide-msg").html("验证失败！请重新再试～");
             var arr = ['https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1555922961&di=4ef1dc7735ac683fe34ea6cadb39924c&src=http://cdn.lizhi.fm/radio_cover/2014/08/18/13784961166699780.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1555922961&di=4ef1dc7735ac683fe34ea6cadb39924c&src=http://cdn.lizhi.fm/radio_cover/2014/08/18/13784961166699780.jpg'];
        //传入新的构造参数即可刷新
        var arr1 = [0,66];
        pic.resetSlideImg(arr1,arr[0],arr[1])
        }
    }
    var arr = ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555924994965&di=1cad779bb2d4b340234448effdfe37a3&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201406%2F09%2F20140609125318_3vkCu.thumb.700_0.jpeg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555924994965&di=1cad779bb2d4b340234448effdfe37a3&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201406%2F09%2F20140609125318_3vkCu.thumb.700_0.jpeg'];
    //初始化拼图
    
    var pic;
    pic =  new Picture({
        initBlockPosi: [10, 50],
        slideImg: arr[0],
        blockImg: arr[1],
        touchEndCallBack: touchEndCallBack
    });
    //刷新
    $(".refreshIcon").click(function () {
        var arr = ['https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1555922961&di=4ef1dc7735ac683fe34ea6cadb39924c&src=http://cdn.lizhi.fm/radio_cover/2014/08/18/13784961166699780.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1555922961&di=4ef1dc7735ac683fe34ea6cadb39924c&src=http://cdn.lizhi.fm/radio_cover/2014/08/18/13784961166699780.jpg'];
        //传入新的构造参数即可刷新
        var arr1 = [0,66];
        pic.resetSlideImg(arr1,arr[0],arr[1])
    })
    $(".canvas-close").click(function () {
        $('.slide-container').picture('hidePop');
    });
    $('.app-box').on('click', 'a', function (e) {
        e.preventDefault();
        $('.slide-container').picture({
            run: true,
            initBlockPosi: [10, 50],
            slideImg: arr[0],
            blockImg: arr[1],
            touchEndCallBack: touchEndCallBack
        });
    })


}(window);



