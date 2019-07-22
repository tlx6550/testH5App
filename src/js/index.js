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
//     dialog.confirm('温馨提示', '恭喜您，获得<br>XXXXXXX~<div class="tip-text">＊请及时填写，以免错失奖品！</div>', [
//         {
//             txt: '确定',
//             color: false, /* false:黑色  true:绿色 或 使用颜色值 */
//             callback: function () {
//                 dialog.toast('你点了取消', 'none', 1000);
//             }
//         }
//    
//     ]);

//参数是4个
//     dialog.orderConfirm('温馨提示','13417586550', '<a href="" class="rule-link">权益规则详情 ></a>', [
//         {
//             txt: '免费领取',
//             color: false, 
//             callback: function () {
//                 dialog.toast('免费领取', 'none', 1000);
//             }
//         },
//          {
//             txt: '关闭',
//             color: false, 
//             callback: function () {
//                 dialog.toast('你点了取消', 'none', 1000);
//             }
//         }
//    
//     ]);
      // setTimeout(function(){
    //     $('#YDUI_CONFRIM').remove();
    // },5000)
    
    
//  dialog.shareConfirm(function () {
//      $('#YDUI_CONFRIM').remove();
//  });


//  dialog.downAppConfirm(function () {
//      $('#YDUI_CONFRIM').remove();
//  });
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



