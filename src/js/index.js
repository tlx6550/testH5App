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



    !function () {

        // 根据实际情况自定义获取数据方法
        var page = 1, pageSize = 10;
        var loadMore = function (callback) {
        	setInterval(function(){
        		setTimeout(function () {
                        typeof callback == 'function' && callback();
                    }, 1000);
        	},2000)
           
        };

        $('#J_List').infiniteScroll({
            binder: '#J_List',
            pageSize: pageSize,
            initLoad: true,
            loadingHtml: '<div>加载中...</div>',
            loadListFn: function () {
                var def = $.Deferred();

                loadMore(function () {

                    var html = '<div>888888</div>'
                    $('#J_ListContent').append(html);
					var listArr = [
					{a:'<div>888888</div>'},
					{a:'<div>888888</div>'}
					]
                    def.resolve(listArr);

                    ++page;
                });

                return def.promise();
            }
        });
    }();
