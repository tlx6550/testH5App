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
    /* 普通确认框 */
    var dialog = window.YDUI.dialog;

//  dialog.confirm('温馨提示', '您已成功提交MM任我装<span class="look-me">爱奇艺黄金VIP会员月卡</span>流浪包订购申请，请耐心等待。', [
//      {
//          txt: '取消',
//          color: false, /* false:黑色  true:绿色 或 使用颜色值 */
//          callback: function () {
//              dialog.toast('你点了取消', 'none', 1000);
//          }
//      },
//      {
//          txt: '确定',
//          color: false, /* false:黑色  true:绿色 或 使用颜色值 */
//          callback: function () {
//              dialog.toast('你点了取消', 'none', 1000);
//          }
//      }
//
//  ]);

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



