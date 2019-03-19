/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
import Fmover from '../assets/js/finger-mover.js';
import fmoverSlideX from '../assets/js/fmover-slide-x.js';
import swiper from '../assets/js/swiper.min.js';
// app download

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

    // dialog.confirm('您的订单已受理', '您已成功提交MM任我装流浪包订购申请，成功受理信息请以中国移动下发短信为准，目前由于订购用户较多，短信可能有延时，请耐心等待。', [
    //     {
    //         txt: '确定',
    //         color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     }
    //
    // ]);
    $('.mflq-btn').click(function () {
        dialog.confirm('抱歉，订购失败', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
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
}(window);
!function (window) {
    // tabl逻辑
    var $header = $('.tab-header');
    var headers = Array.prototype.slice.call(document.querySelectorAll('.tab-header div'));
    var mySwiper = new Swiper('.out-webview-container', {
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function (swiper) {
            // 切换结束时，告诉我现在是第几个slide
            var index = swiper.activeIndex;
            $header.children('div').removeClass('active');
            $header.children('div').eq(index).addClass('active');
        }
    });
    var innerBannerSwiper = new Swiper('.inner-swiper', {
        loop: true,
        autoplay : 1000,
        autoplayDisableOnInteraction : false,
        speed:1100,
    });
    headers.forEach(function (o, i) {
        o.addEventListener('touchend', function () {
            console.log(i);
            var index = i;
            $header.children('div').removeClass('active');
            $header.children('div').eq(index).addClass('active');
            mySwiper.slideTo(index);
        });
    });
    !function initIframH(){
        var bodyH = document.body.clientHeight;
        var headerH = $('.tab-header').height()
        var iframH = Math.floor(bodyH-headerH)
        $('.flexiframe').css('height',iframH + 'px')
    }()
    // var startX,startY,moveEndX,moveEndY,X,Y;
    // $("body").on("touchstart", function(e) {
    //     // 判断默认行为是否可以被禁用
    //     if (e.cancelable) {
    //         // 判断默认行为是否已经被禁用
    //         if (!e.defaultPrevented) {
    //             e.preventDefault();
    //         }
    //     }   
    //     startX = e.originalEvent.changedTouches[0].pageX;
    //     startY = e.originalEvent.changedTouches[0].pageY;
    // });
    // $("body").on("touchend", function(e) {         
    //     // 判断默认行为是否可以被禁用
    //     if (e.cancelable) {
    //         // 判断默认行为是否已经被禁用
    //         if (!e.defaultPrevented) {
    //             e.preventDefault();
    //         }
    //     }               
    //     moveEndX = e.originalEvent.changedTouches[0].pageX,
    //     moveEndY = e.originalEvent.changedTouches[0].pageY,
    //     X = moveEndX - startX,
    //     Y = moveEndY - startY;
    //     //左滑
    //     if ( X > 0 ) {
    //         alert('左滑');                
    //     }
    //     //右滑
    //     else if ( X < 0 ) {
    //         alert('右滑');    
    //     }
    //     //下滑
    //     else if ( Y > 0) {
    //         alert('下滑');    
    //     }
    //     //上滑
    //     else if ( Y < 0 ) {
    //         alert('上滑');    
    //     }
    //     //单击
    //     else{
    //         alert('单击');    
    //     }
    // });


}(window);


