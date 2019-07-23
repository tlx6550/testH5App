/**
 * Created by issuser on 2018/9/28 0028.
 */
import '../assets/styles/index.less';
import $ from '../assets/js/jquery.min.js';
/* import  '../assets/js/mmapp.js'; */
import '../assets/js/flexible.js';
import '../components/dialog/dialog.js';
import swiper from '../assets/js/swiper.min.js';
//import BScroll from '@better-scroll/core';
// app download

/* import '../js/mmdl.js';
import '../js/mmapp.js'; */

!
!function (window) {
    // tabl逻辑
    var $header = $('.tab-header');
    var headers = Array.prototype.slice.call(document.querySelectorAll('.tab-header div'));
//  var mySwiper = new Swiper('.out-webview-container', {
//      observer: true,// 修改swiper自己或子元素时，自动初始化swiper
//      observeParents: true,// 修改swiper的父元素时，自动初始化swiper
//      onSlideChangeEnd: function (swiper) {
//          // 切换结束时，告诉我现在是第几个slide
//          var index = swiper.activeIndex;
//          $header.children('div').removeClass('active');
//          $header.children('div').eq(index).addClass('active');
//      }
//  });
   
    var outerBannerSwiper = new Swiper('.outer-swiper', {
        spaceBetween: 20,
        onSlideChangeStart: function(swiper){
            var index = swiper.activeIndex;
            $header.children('div').removeClass('active');
            $header.children('div').eq(index).addClass('active');
        }
    }); 
    var wrapper1 = document.querySelector('.btscroll1', {
        probeType: 3,
    });
    
    headers.forEach(function (o, i) {
        o.addEventListener('touchend', function () {
            var index = i;
            $header.children('div').removeClass('active');
            $header.children('div').eq(index).addClass('active');
            outerBannerSwiper.slideTo(index);
//          mySwiper.slideTo(index);
        });
    });

   

}(window);


