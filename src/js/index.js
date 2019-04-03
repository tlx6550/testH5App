/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
import LotteryCard from '../assets/js/card.js';
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
    // 弹窗背景表情变化，title传‘sad’是未中奖表情，传good或者不传是高兴表情
    // dialog.confirm('good', '恭喜您，获得<span class="look-me">爱奇艺月卡</span><br><span class="sad-text">去首页看看更多精彩内容吧～</span>', [
    //     {
    //         txt: '回首页',
    //         color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     },
    //     {
    //         txt: '确定',
    //         color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     }
    // ]);
    //其它浏览器分享
    // dialog.shareOnWeb('good', 
    // '<div class="share-on-web"><span>1.微信不支持下载，请点击右上角按钮</span></div>'+
    // '<div class="share-on-web"><span>2.在菜单中点击</span><span class="look-me">【在浏览器中打开】</span>'+
    // '</div>', 
    // [ ]);

    //第一次提示
    // dialog.fisrtStep('提示:',
    //     '<span>下载应用后，一定要在本活动页面</span>' +
    //     '<span class="look-me">【打开】</span>' +
    //     '<span>应用，才能获得刮卡机会</span>'
    // );
    // setTimeout(function () {
    //     $('#YDUI_CONFRIM').remove();
    //     dialog.shareOnWeb('',
    //         '<div class="share-on-web"><span>1.微信不支持下载，请点击右上角按钮</span></div>' +
    //         '<div class="share-on-web"><span>2.在菜单中点击</span><span class="look-me">【在浏览器中打开】</span>' +
    //         '</div>',
    //         []);
    //     setTimeout(function () {
    //         $('#YDUI_CONFRIM').remove();
    //     }, 2000)
    // }, 2000)
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

}(window);

!function (window) {
    function changeResultPigImg(tag){
        if(tag){
            $('.result-pig').removeClass('result-bad').addClass('result-good')
        }else{
            $('.result-pig').removeClass('result-good').addClass('result-bad')
        }
    }
    // 刮刮乐
    function initGuaGuaLe() {
        var canvas = $('.canvas_lottery')[0];
        var ctx = canvas.getContext('2d');
        var img = new Image();
        var urlImg = $('.guauga-bg-img').attr('src');
        console.log('src=' + urlImg);
        img.src = urlImg;

        img.onload = function () {

            var html = $('html')[0].style;
            var baseSize = parseFloat(html.fontSize);
            // console.log(baseSize);
            // console.log('img=' + img);
            // console.log('baseSize=' + baseSize);
            var bgImgW = Math.floor(5.6 * baseSize);
            var bgImgH = Math.floor(1.6 * baseSize);
            var $hideDom = $('.info-text');
            var lottery = new LotteryCard(document.getElementById('js_lottery'), { // eslint-disable-line
                size: 20, // 滑动区域大小
                percent: 90, // 激活百分比到谋个值 就全显示
                resize: true, // canvas的大小是否是可变的
                cover: img,
                bgImgH: bgImgH,
                bgImgW: bgImgW,
                hideDom:$hideDom
            });
            lottery.on('start', function () {
                lottery.setResult('');
            });
            lottery.on('end', function () {

            });
            window.lottery = lottery;
        };
    }
    try {
        initGuaGuaLe();
    } catch (error) {
        console.log(error)
    }
   
}(window);


