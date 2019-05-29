// var baseUrl = 'http://221.179.8.170:8080/s.do';
//var baseUrlApi = 'http://221.179.8.170:8080'; //准现网查询接口
var baseUrlApi = 'http://211.139.191.144:12634'; //测试网查询接口
var interfaceUrl = '/s.do';
var request = axios.create({
	baseURL: baseUrlApi,
	timeout: 5000
});
var gloabMobile;
/* 普通确认框 */
var dialog = window.YDUI.dialog;
// 访问分享页/外投页
function MMAppSharePage(options) {
	this.mobile = 15112395842;
	this.channelId = 5410527503;
	this.queryFreePlan = 'queryFreePlan',
	this.authentInterFaceUrl = 'http://211.139.191.144:12634' //授权测试
	this.AllFreeFlag  = 'AllFreeFlag' // 业务开关
	// 获取免流业务开关状态
	this.initState = function(){
		var that = this
		var state = false;
		var dfd = $.Deferred()	
		request.get(interfaceUrl, {
			params: {
				requestid: that.AllFreeFlag
			}
		}).then(function(res) {
			//console.log(res.data.flag)
			state = res.data.flag
			dfd.resolve(state);
		});
		return dfd
	}
//  this.authentInterFaceUrl = 'http://221.179.8.170:8080' //授权测试准现网

}
MMAppSharePage.prototype = {
	test:function(){alert(1)},
	// 获取免流业务开关状态
//	initState: function() {
//		var that = this
//		var state = false;
//		var dfd = $.Deferred()	
//		request.get(interfaceUrl, {
//			params: {
//				requestid: that.AllFreeFlag
//			}
//		}).then(function(res) {
//			//console.log(res.data.flag)
//			state = res.data.flag
//			dfd.resolve(state);
//		});
//		return dfd
//	},
	sayName:function(){
		alert('fuffu')
	},
	//业务下线-状态1  不提示免流
	offBusiness:function(){
		//显示状态1
		$('.page-state-item').hide()
		$('.page-state-2').show()
	},
	//业务在线-状态2 提示免流
	onLineBusiness:function(){
		//显示状态1
		$('.page-state-item').hide()
		$('.page-state-1').show()
	},
	//获取用户订购记录(获取免流套餐订购状态)
	getOrderByUserInfo:function(mobile){ 
	var that = this	
	request.get(interfaceUrl, {
			params: {
				requestid: that.queryFreePlan,
				mobile: mobile,
				channelId: that.channelId
			}
		}).then(function(res){
			console.log(res)
			var datas = JSON.stringify(res);
			var state = res.data.freeUser
			var isLeft = res.data.isLeft // 没余量时为false
//          var jsonObj = eval('(' + datas + ')');
//          var state = JSON.parse(jsonObj).freeUser;
   
            switch(state)
            {
            	case 0 :
            	//未办理
            	    that.onLineBusiness()
					console.log('state='+state)
					break;
				case 1 :
				//已办理
				    if(isLeft){
				    	that.onLineBusiness()
				    }
					console.log('state='+state)
					break;
				case 2 :
				//已退订
				 that.offBusiness()
					console.log('state='+state)
					break;
                case 3 :
                //不该省份不支持
                 that.offBusiness()
					console.log('state='+state)
					break;
				case 4:
					//已下线
					console.log('state='+state)
					that.offBusiness()
					break;
			    default:
			    that.offBusiness()
		}}).catch(function (error) {
		    that.offBusiness()
		  });
	},
	//网关取号认证
	authent:function(){
    var that = this
    var dfd = $.Deferred()		
	var preSign = YDRZ.getSign("000185","1.2"); 
	var sign=null;
	var RSAstartTime=Date.parse(new Date());     //获取当前时间
	$.ajax({
        type: "GET", 	 	
        url: that.authentInterFaceUrl + "/s.do?requestid=getRSASign&sign="+preSign,
        success: function(data){
        	if(null != data ){
        		var datas = JSON.stringify(data);
        		var jsonObj = eval('(' + datas + ')');
        		var RSAendTime=Date.parse(new Date());     //获取当前时间
				var RSATime = parseInt(RSAendTime) - parseInt(RSAstartTime);
				console.log("RSATime "+RSATime);
        		if("0" == jsonObj.resultCode){
					sign = jsonObj.sign;
					var TokenstartTime=Date.parse(new Date());     //获取当前时间
					YDRZ.getTokenInfo({
						data:{//请求的参数
					        version:'1.2', //接口版本号 （必填）
					        appId:'000185', //应用Id （必填）
							sign: sign,//RSA加密后的sign（必填）
							openType:'1', //移动取号接口填写1,三网取号接口填写0 （必填，联调时必须填写为1）
							expandParams:'phoneNum=15112395842',//扩展参数  格式：参数名=值  多个时使用 | 分割（选填，联调环境只能模拟取号，联调时需填写phoneNum=188185*****手机号可以随便填写，生产可不填）
							isTest:'0'//是否启用测试线地址（传0时为启用不为0或者不传时为不启用）
						},
						success:function(res){//成功回调
							var TokenendTime=Date.parse(new Date());     //获取当前时间
							var tokenTime = parseInt(TokenendTime) - parseInt(TokenstartTime);
							console.log("tokenTime "+tokenTime);
							if(00000 == res.code){
								var tokenJson = {};
								tokenJson.token =res.token;
								tokenJson.userInformation =  res.userInformation;
								tokenJson.tokenTime =  tokenTime;
								tokenJson.RSATime =  RSATime;
								 $.ajax({
								    dataType: "json",
                					method: "POST",
								    url: that.authentInterFaceUrl + "/s.do?requestid=getAuthent",
								    data: tokenJson,
								    success: function(data){
								        var datas = JSON.stringify(data);
								        var jsonObj = eval('(' + datas + ')');
								        $("body").html(jsonObj.data.msisdn);
								        console.log(jsonObj)
								        dfd.resolve(jsonObj);
								    }   
								});
							}
						},
						error:function(res){
							dfd.reject()
							console.log(res);
						}
					});


        		}
        	}
        },
        error:function(res){//错误回调
        	dfd.reject()
			console.log(res);
		}   
    });
     return dfd
	}
	}
var mmApp  = new MMAppSharePage()
mmApp.initState().then(function(getState){
if(getState==='true'){ // 在线
	// 网关取号
//	mmApp.authent().then(function(res){
//	console.log(res)
//	var mobile = 15112395842
//	mmApp.getOrderByUserInfo:function(mobile)
//	})
setTimeout(function(){
	gloabMobile = 13417586550;
},1000)
var mobile = 15112395842
	mmApp.getOrderByUserInfo(mobile)
	}else{
	// 下线
	mmApp.offBusiness()
}
})


// 点击下载按钮
function onClickDonwLoad(){
	MMAppSharePage.call(this)
	this.mobile = '99999999'
	this.onc = 'jjjjj'
	this.Name = function(){alert(999)}
}
onClickDonwLoad.prototype = mmApp;
onClickDonwLoad.prototype.constructor = onClickDonwLoad;
onClickDonwLoad.prototype = {
	initState:function(){
		 MMAppSharePage.prototype.initState.apply(this, arguments);
	},
	getOrderByUserInfo:function(){
		var that = this	
	request.get(interfaceUrl, {
			params: {
				requestid: that.queryFreePlan,
				mobile: gloabMobile,
				channelId: that.channelId
			}
		}).then(function(res){
			console.log(res)
			var datas = JSON.stringify(res);
			var state = res.data.freeUser
			var isLeft = res.data.isLeft // 没余量时为false
//          var jsonObj = eval('(' + datas + ')');
//          var state = JSON.parse(jsonObj).freeUser;
   
            switch(state)
            {
            	case 0 :
            	//未办理
            	    that.popState1_2()
					console.log('state='+state)
					break;
				case 1 :
				//已办理
				    if(isLeft){
				    	that.onLineBusiness()
				    }
					console.log('state='+state)
					break;
				case 2 :
				//已退订
				 that.offBusiness()
					console.log('state='+state)
					break;
                case 3 :
                //不该省份不支持
                 that.offBusiness()
					console.log('state='+state)
					break;
				case 4:
					//已下线
					console.log('state='+state)
					that.offBusiness()
					break;
			    default:
			    that.offBusiness()
		}}).catch(function (error) {
		   // that.offBusiness()
		  });
	},
	// 下载主流程
	mainDownProgress:function(){
		alert('进入主流程')
	},
	// 弹窗1-2
	popState1_2:function(){
		var that = this
		var phone = that.plusXing(gloabMobile,3,4,'*')
		var obj = {
        title: '温馨提示',
        phoneNum: phone,
        mes: '0元5GB/月定向流量，任性下应用！现在免费领取0元套餐，获得连续6个月每月5G定向流量，到期自动取消。<br><a href="www.baidu.com" class="goto-detail">查看详细活动说明></a>',
       };
        dialog.getPhoneConfirm(obj, [
        {
            txt: '确定',
            color: false, 
            fade:true,
            callback: function () {
                dialog.confirm('抱歉，订购失败', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [
                    {
                        txt: '免费领取',
                        color: false, 
                        callback: function () {
                            dialog.toast('你点了取消', 'none', 1000);
                        }
                    }

                ]);
            }
        },
        {
            txt: '残忍拒绝',
            color: false, 
            fade:false,
            callback: function () {
                dialog.toast('你点了取消', 'none', 1000);
            }
        },
        {
            txt: '关闭',
            color: false, 
            fade:false,
            callback: function () {
                dialog.toast('你点了取消', 'none', 1000);
            }
        }

    ]);
	},
	test:function(){
		 MMAppSharePage.prototype.test.apply(this, arguments);
	},
	 /* 部分隐藏处理
    ** str 需要处理的字符串
    ** frontLen 保留的前几位
    ** endLen 保留的后几位
    ** cha 替换的字符串
    */
	plusXing:function(str, frontLen, endLen,cha) {
      var len = str.length - frontLen - endLen;
      var xing = '';
      for (var i = 0; i < len; i++) {
        xing += cha;
      }
      return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    }
}
// https://www.cnblogs.com/catgatp/p/9096103.html
var onDonwLoad = new onClickDonwLoad();


