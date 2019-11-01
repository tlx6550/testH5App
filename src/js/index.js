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

window.onload = function(){
    !function init() {
        var hobj = $('.ifram').data();
        var video = $('.top-video').data();
        try {
            var fs = $('html').attr('fs');
            $('.top-video').css('height',video.h*fs +'px');
            $('.top-video').css('width',video.w*fs +'px');
            $('.ifram').css('height',hobj.h*fs +'px');
        } catch (error) {
            
        }
       
       
    }();
    !function gotoDeatail(){
    	$('.linear').click(function(e){
    		e.stopPropagation();
    		e.preventDefault();
    		var noTarget = $(e.target);
    		var tagA = noTarget.children().text() ==='直接玩'
    		var tag = noTarget.text() ==='直接玩';
    		var flag = tagA || tag
    		var urld = noTarget.parent().attr('href') 
    		var urla = noTarget.attr('href') 
    		var urlhref = urld?urld:urla
    		if(!flag){
    			//卡片详情跳转
    			var cardurl = $(this).data('url');
    			window.location.href = cardurl;
    		}else{
    			window.location.href = urlhref;
    		}
    	});
    }();

};



