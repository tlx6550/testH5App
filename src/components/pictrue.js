function Picture(options) {
    this.gloableLockOnTouchend = false;
    var DEFAULTS = {
        run: true, //初始化就执行
        $slideBg: $('.slide-bg'),
        $slideContainer: $('.slide-container'),// 拼图容器
        DomSlider: $('.slider')[0],
        DomBlock: $('.slide-block')[0],
        $slideBlock: $('.slide-block'),
        initImgWidth: 574,// 拼图最大宽度
        slideWidth: $('.slider').width(),
        slideBarWidth: $('.sliderContainer').width(),
        slideBgWidth: $('.slide-bg').width(),
        blockImgWidth: $('.slide-block').width(),

        originX: 0,
        originY: 0,
        startTime: 0,
        isTouchStart: false,
        touchEndCallBack: null,

    };
    this.options = $.extend({}, DEFAULTS, options || {});
}


/**
 * 开始倒计时
 */
Picture.prototype.initMoveBlock = function (initBlockPosi, slideImg, blockImg) {
    var that = this,
        options = that.options,
        $slideContainer = options.$slideContainer;

    that.canMoveWidth = options.slideBarWidth - options.slideWidth / 2;
    that.canMoveWidth2 = options.slideBarWidth - options.blockImgWidth / 2;
    that.radioMov = that.canMoveWidth2 / that.canMoveWidth;
    that.radioImg = options.slideBgWidth / options.initImgWidth;

    options.$slideBg.attr('src', slideImg);
    options.$slideBlock.attr('src', blockImg);
    options.$slideBg.attr('src', slideImg).css('top', initBlockPosi[1] * that.radioImg);
    $slideContainer.show();
    that.touchstart();
    document.addEventListener('touchmove', that.touchmove);
    document.addEventListener('touchend', that.touchend);
};

/**
 * 获取倒计时显示文本
 * @param secs
 * @returns {string}
 */
Picture.prototype.touchstart = function () {
    var that = this;
    var options = that.options;
    var slider = options.DomSlider;
    slider.addEventListener('touchstart', function (e) {
        options.originX = e.targetTouches[0].pageX;
        options.originY = e.targetTouches[0].pageY;
        options.startTime = e.timeStamp;
        options.isTouchStart = true;
    });
};
/**
 * 移动
 */
Picture.prototype.touchmove = function (e) {
    var that = this;
    var options = that.options;
    var slider = options.DomSlider;
    var block = options.DomBlock;
    if (!options.isTouchStart) return false;
    var moveX = e.targetTouches[0].pageX - originX;
    var moveY = e.targetTouches[0].pageY - originY;
    if (moveX < 0 || moveX > canMoveWidth) return false;
    slider.style.left = moveX + 'px';
    block.style.left = moveX * radioMov + 'px';
};
/**
 * 移动结束
 */
Picture.prototype.touchend = function (e) {
    var that = this;
    var options = that.options;
    var slider = options.DomSlider;
    if (options.isTouchStart) {
        var endX = e.changedTouches[0].clientX;
        var timeStamp = ((e.timeStamp - startTime) / 1000).toFixed(2);
        var posi = parseFloat($('.slide-block').css('left')) / that.radioImg;
        slider.style.left = '0px';
        if (!that.gloableLockOnTouchend) {
            typeof options.touchEndCallBack == 'function' && options.touchEndCallBack(parseInt(posi));
            // emitResult(parseInt(posi));
        }
    }
    e.stopPropagation();
    options.isTouchStart = false;
};
Picture.prototype.hidePop = function (e) {
    var that = this,
        options = that.options,
        document = options.Domdocument,
        $slideContainer = options.$slideContainer;
    that.gloableLockOnTouchend = false;
    document.removeEventListener('touchmove', that.touchmove, false);
    document.removeEventListener('touchend', that.touchend, false);
    $slideContainer.hide();
};