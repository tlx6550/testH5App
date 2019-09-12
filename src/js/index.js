/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';

import '../components/dialog/dialog.js';

! function(window) {
	! function initTel() {
		$('.tel-input').bind('input propertychange', function() {
			var val = $(this).val();
			// 移动号段
			var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
			if(regtel.test(val)) {
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

	//     dialog.confirm('温馨提示', '已超过邀请限制人数。每天最多邀请20个朋友，请明天再邀请~', [
	//         {
	//             txt: '确定',
	//             color: false, 
	//             callback: function () {
	//                 dialog.toast('你点了取消', 'none', 1000);
	//             }
	//         }
	//    
	//     ]);

//	dialog.shareConfirm(function() {
//		$('#YDUI_CONFRIM').remove();
//	});
//	dialog.stepConfirm(function() {
//	$('#YDUI_CONFRIM').remove();
//	});
	
//	     dialog.stepConfirm('温馨提示', '', [
//	         {
//	             txt: '确定',
//	             color: false, 
//	             callback: function () {
//	                 dialog.toast('你点了取消', 'none', 1000);
//	             }
//	         }
//	    
//	     ]);

	// dialog.androidConfirm(function () {
	//      $('#YDUI_CONFRIM').remove();
	//  });
       
	     function getCode(){
	     	dialog.getCode('', [
	         {
	             txt: '验证',
	             color: false, 
	             stay:true,
	             callback: function () {
	                 dialog.toast('你点了验证', 'none', 1000);
	                 $(".el-input-inner").blur();
	                 window.YDUI.util.pageScroll.unlock();
	                 setTimeout(function(){
	                 	$('#YDUI_CONFRIM').remove()
	                 },1500)
	             }
	         }
	    
	     ]);
	     
	     var $getCode = $('#J_GetCode');
		/* 定义参数 */

		$getCode.sendCode({
			disClass: 'btn-disabled',
			secs: 60,
			run: false,
			runStr: '{%s}秒后重新获取',
			resetStr: '重新获取验证码'
		});
		$getCode.on('click', function() {
			dialog.toast('获取验证码', 'none', 1000);
			$getCode.sendCode('start')
		});
	      $(".el-input-inner").focus();
	     }
	     getCode()
	//收货地址
	! function initAddress() {
		var $address = $('#J_Address');

		$address.citySelect();

		$address.on('click', function() {
			$address.citySelect('open');
		});

		$address.on('done.ydui.cityselect', function(ret) {
			/* 省：ret.provance */
			/* 市：ret.city */
			/* 县：ret.area */
			$(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
		});
	}()

	$('.chest-close').click(function() {
		$(this).addClass("shake");
		var that = this;
		this.addEventListener("webkitAnimationEnd", function() {

			$(that).closest(".open-has").addClass("opened");
			setTimeout(function() {
				$(that).removeClass("show");
				$(that).closest(".mod-chest").find(".chest-open").addClass("show");
				$(".chest-open").addClass("blur");
				fadeOutlist()
			}, 200)
		}, false);
	})

	function fadeOutlist() {
		$('.gift-wrap').show()
		$('.fade-one').addClass('animated  fadeOutUpBig1');
		$('.fade-two').addClass('animated  fadeOutUpBig2');
		$('.fade-three').addClass('animated  fadeOutUpBig3');
		$('.fade-four').addClass('animated  fadeOutUpBig4');
	}
}(window);

  try{
  	
  }catch(e){
  	//TODO handle the exception
  }
//var obj = {
//	code: xxxxxx,
//	msg: '错误提示/或者成功提示/文案提示',
//	token: xxxxx,
//	userId: 312312,
//	isNewUser: false
//}
//
//window.mmengsdk.setLoginResult(JSON.stringify(obj));