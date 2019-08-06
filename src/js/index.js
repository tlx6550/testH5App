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

! function(window) {
	! function initTel() {
		$('.tel-input').bind('input propertychange', function() {
			var val = $(this).val();
			// 移动号段
			var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
			if(regtel.test(val)) {
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
	//  dialog.simpleConfirm('领取免流量包、下载MM应用商场', '快来帮好友获得视频会员卡吧',function () {
	//      $('#YDUI_CONFRIM').remove();
	//  });
	$('.lklq-btn').click(function() {
		dialog.confirm('', '您（13911111111）已成功订购<br><div class="look-me">0元5GB定向流量包，</div>获得抽奖机会，赶紧去抽奖吧~', [
//		    {
//				txt: '取消',
//				color: false,
//				/* false:黑色  true:绿色 或 使用颜色值 */
//				callback: function() {
//					dialog.toast('你点了取消', 'none', 1000);
//				}
//			},
			{
				txt: '确定',
				color: false,
				/* false:黑色  true:绿色 或 使用颜色值 */
				callback: function() {
					dialog.toast('确定', 'none', 1000);
				}
			}
		]);
	});

}(window);