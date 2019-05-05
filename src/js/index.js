/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
/* import '../js/mmdl.js';
import '../js/mmapp.js'; */

!function (window) {
    /* 普通确认框 */
    var dialog = window.YDUI.dialog;
       dialog.confirm('good', '恭喜您，获得<span class="look-me">3GB流量</span>。', [
       {
               txt: '取消',
               color: false, /* false:黑色  true:绿色 或 使用颜色值 */
               callback: function () {
                   dialog.toast('你点了确定', 'none', 1000);
               }
           },
           {
               txt: '确定',
               color: false, /* false:黑色  true:绿色 或 使用颜色值 */
               callback: function () {
                   dialog.toast('你点了确定', 'none', 1000);
               }
           }
       ]);
    // 其它浏览器分享
    dialog.shareOnWeb('good', 
    '<div class="share-on-web"><span>1.微信不支持下载，请点击<br>右上角按钮</span></div>'+
    '<div class="share-on-web"><span>2.在菜单中点击<br></span><span class="look-me">【在浏览器中打开】</span>'+
    '</div>', 
    [ ]);


    setTimeout(function () {
        $('#YDUI_CONFRIM').remove();
        dialog.shareOnWeb('good', 
        '<div class="share-on-web"><span>1.微信不支持下载，请点击<br>右上角按钮</span></div>'+
        '<div class="share-on-web"><span>2.在菜单中点击<br></span><span class="look-me">【在浏览器中打开】</span>'+
        '</div>', 
        [ ]);
        setTimeout(function () {
            $('#YDUI_CONFRIM').remove();
        }, 2000)
    }, 2000)

}(window);



