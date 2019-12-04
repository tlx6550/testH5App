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
    /* 普通确认框 */
    var dialog = window.YDUI.dialog;

    // 其它浏览器分享
    // dialog.shareOnWeb('', 
    // '<div class="share-on-web"><span>1.微信不支持此操作,<span class="look">请点击右上角按钮;</span></span></div>'+
    // '<div class="share-on-web"><span>2.在菜单中点击</span><span class="look-me">【在浏览器中打开】</span>'+
    // '</div>', 
    // [ ]);

}(window);

!function (window) {
    // 刮奖结果卡片小猪状态切换、传true表示中奖
    function changeResultPigImg(tag){
        if(tag){
            $('.result-pig').removeClass('result-bad').addClass('result-good');
        }else{
            $('.result-pig').removeClass('result-good').addClass('result-bad');
        }
    }
    // 中奖文案修改
    $('.result-text').find('.title').html('刮奖失败，请使用本机<br>手机号码登录MM');
    $('.result-text').find('.info-detail').html('(打开4G蜂窝网络开关)');
    // 初始化刮刮乐
    function initGuaGuaLe() {
        var canvas = $('.canvas_lottery')[0];
        var ctx = canvas.getContext('2d');
        var img = new Image();
        var urlImg = $('.guauga-bg-img').attr('src');
        img.src = urlImg;
        img.onload = function () {
            var html = $('html')[0].style;
            var baseSize = parseFloat(html.fontSize);
            // console.log(baseSize);
            // console.log('img=' + img);
            // console.log('baseSize=' + baseSize);
            var bgImgW = Math.floor(6.1 * baseSize);
            var bgImgH = Math.floor(2.97 * baseSize);
            var $hideDom = $('.info-text');
            var lottery = new LotteryCard(document.getElementById('js_lottery'), { // eslint-disable-line
                size: 20, // 滑动区域大小
                percent: 60, // 激活百分比到谋个值 就全显示
                resize: true, // canvas的大小是否是可变的
                cover: img,
                bgImgH: bgImgH,
                bgImgW: bgImgW,
                hideDom:$hideDom
            });
            lottery.on('start', function () {
                console.log(1111);
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
        console.log(error);
    }
   

    // 验证码逻辑
    !function getCode(){
        var $getCode = $('#J_GetCode');

        /* 定义参数 */
        $getCode.sendCode({
            disClass: 'btn-disabled',
            secs: 15,
            run: false,
            runStr: '{%s}秒后重新获取',
            resetStr: '重新获取验证码'
        });
        $getCode.on('click', function () {
        /* ajax 成功发送验证码后调用【start】 */
            YDUI.dialog.loading.open('发送中');
            setTimeout(function(){
            
                YDUI.dialog.loading.close();
            
                $getCode.sendCode('start');
                YDUI.dialog.toast('已发送', 'success', 1500);
            
            }, 1500);
        });
        $('.icon-btn').click(function(){
            $('.get-phone-wrap').hide();
            setTimeout(function(){
                $('.get-phone-wrap').show();
            },1500);
        });
        $('.btn-comfirm').click(function(){
            $('.get-phone-wrap').hide();
            YDUI.dialog.toast('确定', 1500);
        });
    }();




    // 是否可以抽奖逻辑
    function initOpernuty(type){
        switch (type) {
        case 1:
            // 没有机会抽奖
            $('.gua-jiang').find('.info-text').addClass('no-opertunity');
            break;
        case 2:
            // 点击刮奖抽奖
            $('.gua-jiang').find('.info-text').addClass('pre-opertunity').removeClass('no-opertunity');
            $('.gua-jiang').find('.info-text').click(function(){
                $(this).remove();
            });
            break;
        default:
            break;
        }
    }
    initOpernuty(2);
    getPrizeOrNot(2);
    // 是否抽中奖了
    function getPrizeOrNot(type){
        switch (type) {
        case 1:
        // 没中
            $('.gua-jiang').find('.result-pig').addClass('result-bad').removeClass('result-good');     
            break;
        case 2:
        // 中了
            $('.gua-jiang').find('.result-pig').addClass('result-good').removeClass('result-bad');     
            break;
        default:
            break;
        }
    }
}(window);


