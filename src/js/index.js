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

window.onload = function() {
	function initIframH() {
		var hobj = $('.pop-ifram').data();
		try {
			var fs = $('html').attr('fs');
			$('.pop-ifram').css('height', hobj.h * fs + 'px');
		} catch(error) {

		}

	}
	! function gotoDeatail() {
		$('.card-item').click(function(e) {
			e.stopPropagation()
			var noTarget = $(e.target)
			var tag = noTarget.hasClass('js-label')
			if(!tag) {
				var url = $(this).data('url')
				window.location.href = url
			}
		})
	}()
	var popLayer = window.YDUI.dialog
	function showPopLayer(url,cb){
		popLayer.popLayer(url, cb);
	}
	showPopLayer('more.html',function(){})
};