/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
 
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
//  dialog.simpleConfirm('领取免流量包、下载MM应用商场', '快来帮好友获得视频会员卡吧',function () {
//      $('#YDUI_CONFRIM').remove();
//  });
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
    // pic =  new Picture({
    //     initBlockPosi: [10, 50],
    //     slideImg: arr[0],
    //     blockImg: arr[1],
    //     touchEndCallBack: touchEndCallBack
    // });
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

}(window);



