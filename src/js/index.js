/*
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
var dialog = window.YDUI.dialog;
window.onload = function () {
    dialog.confirm('温馨提示', '您（13911111111）已成功订购<br><div class="look-me">0元5GB定向流量包，</div>获得抽奖机会，赶紧去抽奖吧~', [
        {
            txt: '取消',
            color: false,
            /* false:黑色  true:绿色 或 使用颜色值 */
            callback: function () {
                dialog.toast('你点了取消', 'none', 1000);
            }
        },
        {
            txt: '确定',
            color: false,
            /* false:黑色  true:绿色 或 使用颜色值 */
            callback: function () {
                dialog.toast('确定', 'none', 1000);
            }
        }
    ]);
};