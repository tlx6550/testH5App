/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
import axios from '../assets/js/axios.min.js';
var baseUrl = 'http://221.179.8.170:8080/s.do';
var baseUrlApi = 'http://221.179.8.170:8080';
var apiUrl = '/s.do';
var request = axios.create({
    baseURL: baseUrlApi,
    timeout: 5000
});
request.get(apiUrl, {
    params: {
        requestid: 'queryFreePlan',
        mobile: 15112395842,
        channelId: '5210527525'
    }
}).then(function (res) {
    console.log(res);
});

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
    // 切换号码
    $('.home-bg').on('click', '.change-phone', function () {
        $('#YDUI_CONFRIM-FADE').remove();
    });
    var obj = {
        title: '温馨提示',
        phoneNum: '13417586550',
        mes: '抱歉，因网络原因您本次订购出现错误，请重新领取。抱歉，因网络原因您本次订购出现错误，请重新领取。<br><a href="www.baidu.com" class="goto-detail">查看详细活动说明></a>',
    };

    dialog.loginConfirm(obj, [
        {
            txt: '登陆',
            color: false,
            fade: true,
            callback: function () {

            }
        },
        {
            txt: '我已领取',
            color: false,
            fade: false,
            callback: function () {

            }
        },
        {
            txt: '残忍拒绝',
            color: false,
            fade: true,
            callback: function () {
                dialog.toast('你点了取消', 'none', 1000);
            }
        },
        {
            txt: '关闭',
            color: false,
            fade: false,
            callback: function () {
                dialog.toast('你点了取消', 'none', 1000);
            }
        }

    ]);
    // dialog.getPhoneConfirm(obj, [
    //     {
    //         txt: '确定',
    //         color: false, 
    //         fade:true,
    //         callback: function () {
    //             dialog.confirm('抱歉，订购失败', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
    //                 {
    //                     txt: '确定',
    //                     color: false, 
    //                     callback: function () {
    //                         dialog.toast('你点了取消', 'none', 1000);
    //                     }
    //                 }

    //             ]);
    //         }
    //     },
    //     {
    //         txt: '残忍拒绝',
    //         color: false, 
    //         fade:false,
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     },
    //     {
    //         txt: '关闭',
    //         color: false, 
    //         fade:false,
    //         callback: function () {
    //             dialog.toast('你点了取消', 'none', 1000);
    //         }
    //     }

    // ]);

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
    // $('.mflq-btn').click(function () {
    //     dialog.confirm('抱歉，订购失败', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
    //         {
    //             txt: '确定',
    //             color: false, /* false:黑色  true:绿色 或 使用颜色值 */
    //             callback: function () {
    //                 dialog.toast('你点了取消', 'none', 1000);
    //             }
    //         }

    //     ]);
    // });
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



