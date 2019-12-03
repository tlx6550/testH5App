/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
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

    //   dialog.simpleConfirm('抱歉，订购失败', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
    //          {
    //              txt: '×',
    //              color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //              callback: function () {
    //                  dialog.toast('你点了取消', 'none', 1000);
    //              }
    //          }
    //
    //      ]);
//一般场景打开提示
    dialog.confirm('温馨提示', '您（13722200947）的订购申请已受理，成功受理以10086短信为准。', [
        {
            txt: '去MM应用商场 ',
            callback: function () {
                $('#YDUI_CONFRIM').remove();
            }
        },
        {
            txt: '关闭',
            callback: function () {
                $('#YDUI_CONFRIM').remove();
            }
        }
    ]);
//微信打开提示
// !function popOnWeixin(){
//         dialog.shareOnWeb('',
//             '<div class="share-on-web"><span class="down-text">浏览器打开即可免流下载～</span></div>' +
// 	        '<div class="share-on-web"><span>请点击右上角按钮</span></div>' +
// 	        '<div class="share-on-web"><span>选择</span><span class="look-me">【在浏览器中打开】</span>' +
// 	        '</div>',
// 	        []);
// 	}();
//安卓打开提示
// !function popOnAndroid(){
//     dialog.popOnAndroid('','', []);
// }();
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
        setTimeout(function () {
            $getCode.sendCode('resetBtn');
        }, 3000);
    });

    // !function initClick() {
    //     var tag = false;
    //     if (tag) {
    //         $('.dom').click(function () {
    //             alert(1)
    //         })
    //     } else {
    //         $('.dom').click(function () {
    //             alert(2)
    //         })
    //     }
    // }()

    // !function initClick() {
    //     var tag = false;
    //     $('.dom').click(function () {
    //         if (tag) {
    //             alert(1)
    //         } else {
    //             alert(2)
    //         }

    //     })

    // }()


}(window);



