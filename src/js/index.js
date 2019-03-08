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

         $('#J_Confirm').on('click', function () {
            dialog.confirm('自定义按钮', '我有一个小毛驴我从来也不骑！', [
                {
                    txt: '取消',
                    color: false, /* false:黑色  true:绿色 或 使用颜色值 */
                    callback: function () {
                        dialog.toast('你点了取消', 'none', 1000);
                    }
                },
                {
                    txt: '犹豫一下',
                    stay: true, /* 是否保留提示框 */
                    color: '#CCC', /* 使用颜色值 */
                    callback: function () {
                        dialog.toast('别犹豫了', 'none', 1000);
                    }
                },
                {
                    txt: '确定',
                    color: true,
                    callback: function () {
                        dialog.toast('你点了确定', 'none', 1000);
                    }
                }
            ]);
        });
}(window);



