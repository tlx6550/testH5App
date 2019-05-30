// var baseUrl = 'http://221.179.8.170:8080/s.do';
//var baseUrlApi = 'http://221.179.8.170:8080'; //准现网查询接口
//var baseUrlApi = 'http://211.139.191.144:12634'; //测试网查询接口
var baseUrlApi = 'http://localhost:3000'; //测试网查询接口
var interfaceUrl = '/s.do';
var request = axios.create({
	baseURL: baseUrlApi,
	timeout: 5000
});
var storage = window.localStorage;
var gloabMobile;
/* 普通确认框 */
var dialog = window.YDUI.dialog;
// 访问分享页/外投页
function MMAppSharePage(options) {
	this.mobile = 15112395842;
	this.channelId = 5410527503;
	this.queryFreePlan = 'queryFreePlan',
		this.subscribeFreePlan = 'subscribeFreePlan', //订购接口
		this.channel = 'C10000010527', //分配的渠道号
		this.authentInterFaceUrl = 'http://localhost:3000' //授权测试
	this.AllFreeFlag = 'AllFreeFlag' // 业务开关
	this.send_code = 'send_code', //验证码
		this
	// 获取免流业务开关状态
	this.initState = function() {
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
	test: function() {
		alert(1)
	},
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
	sayName: function() {
		alert('fuffu')
	},
	//业务下线-状态1  不提示免流
	offBusiness: function() {
		//显示状态1
		$('.page-state-item').hide()
		$('.page-state-2').show()
	},
	//业务在线-状态2 提示免流
	onLineBusiness: function() {
		//显示状态1
		$('.page-state-item').hide()
		$('.page-state-1').show()
	},
	//获取用户订购记录(获取免流套餐订购状态)
	getOrderByUserInfo: function(mobile) {
		var that = this
		request.get(interfaceUrl, {
			params: {
				requestid: that.queryFreePlan,
				mobile: mobile,
				channelId: that.channelId
			}
		}).then(function(res) {
			console.log(res)
			var datas = JSON.stringify(res);
			var state = res.data.freeUser
			var isLeft = res.data.isLeft // 没余量时为false
			//          var jsonObj = eval('(' + datas + ')');
			//          var state = JSON.parse(jsonObj).freeUser;

			switch(state) {
				case 0:
					//未办理
					that.onLineBusiness()
					console.log('state=' + state)
					break;
				case 1:
					//已办理
					if(isLeft) {
						that.onLineBusiness()
					}
					console.log('state=' + state)
					break;
				case 2:
					//已退订
					that.offBusiness()
					console.log('state=' + state)
					break;
				case 3:
					//不该省份不支持
					that.offBusiness()
					console.log('state=' + state)
					break;
				case 4:
					//已下线
					console.log('state=' + state)
					that.offBusiness()
					break;
				default:
					that.offBusiness()
			}
		}).catch(function(error) {
			that.offBusiness()
		});
	},
	//网关取号认证
	authent: function() {
		var that = this
		var dfd = $.Deferred()
		var preSign = YDRZ.getSign("000185", "1.2");
		var sign = null;
		var RSAstartTime = Date.parse(new Date()); //获取当前时间
		$.ajax({
			type: "GET",
			url: that.authentInterFaceUrl + "/s.do?requestid=getRSASign&sign=" + preSign,
			success: function(data) {
				if(null != data) {
					var datas = JSON.stringify(data);
					var jsonObj = eval('(' + datas + ')');
					var RSAendTime = Date.parse(new Date()); //获取当前时间
					var RSATime = parseInt(RSAendTime) - parseInt(RSAstartTime);
					console.log("RSATime " + RSATime);
					if("0" == jsonObj.resultCode) {
						sign = jsonObj.sign;
						var TokenstartTime = Date.parse(new Date()); //获取当前时间
						YDRZ.getTokenInfo({
							data: { //请求的参数
								version: '1.2', //接口版本号 （必填）
								appId: '000185', //应用Id （必填）
								sign: sign, //RSA加密后的sign（必填）
								openType: '1', //移动取号接口填写1,三网取号接口填写0 （必填，联调时必须填写为1）
								expandParams: 'phoneNum=15112395842', //扩展参数  格式：参数名=值  多个时使用 | 分割（选填，联调环境只能模拟取号，联调时需填写phoneNum=188185*****手机号可以随便填写，生产可不填）
								isTest: '0' //是否启用测试线地址（传0时为启用不为0或者不传时为不启用）
							},
							success: function(res) { //成功回调
								var TokenendTime = Date.parse(new Date()); //获取当前时间
								var tokenTime = parseInt(TokenendTime) - parseInt(TokenstartTime);
								console.log("tokenTime " + tokenTime);
								if(00000 == res.code) {
									var tokenJson = {};
									tokenJson.token = res.token;
									tokenJson.userInformation = res.userInformation;
									tokenJson.tokenTime = tokenTime;
									tokenJson.RSATime = RSATime;
									$.ajax({
										dataType: "json",
										method: "POST",
										url: that.authentInterFaceUrl + "/s.do?requestid=getAuthent",
										data: tokenJson,
										success: function(data) {
											var datas = JSON.stringify(data);
											var jsonObj = eval('(' + datas + ')');
											$("body").html(jsonObj.data.msisdn);
											console.log(jsonObj)
											dfd.resolve(jsonObj);
										}
									});
								}
							},
							error: function(res) {
								dfd.reject()
								console.log(res);
							}
						});

					}
				}
			},
			error: function(res) { //错误回调
				dfd.reject()
				console.log(res);
			}
		});
		return dfd
	}
}
var mmApp = new MMAppSharePage()
mmApp.initState().then(function(getState) {
	if(getState === 'true') { // 在线
		// 网关取号
		//		mmApp.authent().then(function(res){
		//		console.log(res)
		//
		//			})
		var mobile = 15112395842
		setTimeout(function() {
			gloabMobile = 13417586550;
			mmApp.getOrderByUserInfo(gloabMobile)
		}, 300)
		//		  var mobile = 15112395842

	} else {
		// 下线
		mmApp.offBusiness()
	}
})

// 点击下载按钮
function onClickDonwLoad() {
	MMAppSharePage.call(this)
	this.mobile = '99999999'
	this.onc = 'jjjjj'
	this.Name = function() {
		alert(999)
	}
}
onClickDonwLoad.prototype = mmApp;
onClickDonwLoad.prototype.constructor = onClickDonwLoad;
onClickDonwLoad.prototype = {
		//	initState:function(){
		//		 MMAppSharePage.prototype.initState.apply(this, arguments);
		//	},
		getOrderByUserInfo: function() {
			var that = this
			request.get(interfaceUrl, {
				params: {
					requestid: that.queryFreePlan,
					mobile: gloabMobile,
					channelId: that.channelId
				}
			}).then(function(res) {
				var datas = JSON.stringify(res);
				var state = res.data.freeUser
				var isLeft = res.data.isLeft // 没余量时为false
				//          var jsonObj = eval('(' + datas + ')');
				//          var state = JSON.parse(jsonObj).freeUser;

				switch(state) {
					case 0:
						//未办理
						that.popState1_2()
						console.log('state=' + state)
						break;
					case 1:
						//已办理
						if(isLeft) {
							that.mainDownProgress()
						}
						console.log('state=' + state)
						break;
					case 2:
						//已退订
						that.mainDownProgress()
						console.log('state=' + state)
						break;
					case 3:
						//不该省份不支持
						that.mainDownProgress()
						console.log('state=' + state)
						break;
					case 4:
						//已下线
						console.log('state=' + state)
						that.mainDownProgress()
						break;
					default:
						that.mainDownProgress()
				}
			}).catch(function(error) {
				// that.offBusiness()
			});
		},
		// 下载主流程
		mainDownProgress: function() {
			alert('进入主流程')
		},
		//请求订购状态
		getOrderState: function() {
			var dfd = $.Deferred()
			var that = this
			request.get(interfaceUrl, {
					params: {
						requestid: that.subscribeFreePlan,
						mobile: gloabMobile,
						channelId: that.channelId,
						channel: that.channel
					}
				}).then(function(res) {
					var state = res.data.result
					dfd.resolve(state)
				})
				.catch(function(e) {
					dfd.reject(e)
				});
			return dfd
		},
		// 弹窗取号
		popState1_1: function() {
			var that = this
			var checkMoblie = false;
			var checkCode = false;
			var moblie;
			var code;
			var $getBtn;
			var obj = {
				title: '温馨提示',
				mes: '0元5GB/月定向流量，任性下应用！现在免费领取0元套餐，获得连续6个月每月5G定向流量，到期自动取消。',
			};
			dialog.loginConfirm(obj, [{
					txt: '免费领取',
					color: false,
					fade: true,
					stay:true,
					callback: function(calMe) {
						if(that.checkMobile(moblie) && that.checkCode(code)){
			                that.checkMobileAndCode(moblie, code).then(function(res){
			                	console.log('校验手机和验证码是否正确='+res)
			                	// 验证成功
			                	var tag = res
			                	if(tag){
			                		that.getOrderState().then(function(data) {
										switch(data) {
											case 0:
												//成功
												that.popState2_1()
												break;
											case 1:
												//失败
												that.popState2_2()
												break;
											case -1:
												//已订购
												that.popState2_3()
												break;
											default:
												break;
										}
										calMe()
									})
			                	}
			                }).fail(function(){ alert("验证失败"); });
			            }
					  	
					}
				},
				{
					txt: '我已领取',
					color: false,
					fade: false,
					callback: function() {

					}
				},
				{
					txt: '残忍拒绝',
					color: false,
					fade: true,
					callback: function() {
						dialog.toast('你点了取消', 'none', 1000);
					}
				},
				{
					txt: '关闭',
					color: false,
					fade: false,
					callback: function() {
						dialog.toast('你点了取消', 'none', 1000);
					}
				}

			]);
			
			$('.confirm-ft').find('.default').each(function(){
				if($(this).text().indexOf('免费领取')>-1){
					$(this).addClass('disable')
					$getBtn = $(this)
				}
			})
			$('.tel-input').blur(function() {
				moblie = $(this).val()
				checkMoblie = that.checkMobile(moblie)
				if(checkMoblie)$getBtn.removeClass('disable')
			})
			$('.code-input').blur(function() {
				code = $(this).val()
				checkCode = that.checkCode(code)
			})

			// 获取验证码逻辑
			var $getCode = $('#J_GetCode');

			/* 定义参数 */
			$getCode.sendCode({
				disClass: 'btn-disabled',
				secs: 60,
				run: false,
				runStr: '{%s}秒后重新获取',
				resetStr: '重新获取验证码'
			});
           $getCode.on('click',function(){
           	that.getRandomCode(moblie,$getCode)
           })
        },//end fun
					// 弹窗1-2
					popState1_2: function() {
						var that = this;
						var phone = that.plusXing(gloabMobile, 3, 4, '*');
						var obj = {
							title: '温馨提示',
							phoneNum: phone,
							mes: '0元5GB/月定向流量，任性下应用！现在免费领取0元套餐，获得连续6个月每月5G定向流量，到期自动取消。<br><a href="www.baidu.com" class="goto-detail">查看详细活动说明></a>',
						};
						dialog.getPhoneConfirm(obj, [{
								txt: '免费领取',
								color: false,
								fade: true,
								stay: true,
								callback: function(me) {
									that.getOrderState().then(function(res) {
										switch(res) {
											case 0:
												//成功
												that.popState2_1()
												break;
											case 1:
												//失败
												that.popState2_2()
												break;
											case -1:
												//已订购
												that.popState2_3()
												break;
											default:
												break;
										}
										me()
									})
								}
							},
							{
								txt: '残忍拒绝',
								color: false,
								fade: false,
								callback: function() {
									dialog.toast('你点了取消', 'none', 1000);
								}
							},
							{
								txt: '关闭',
								color: false,
								fade: false,
								callback: function() {
									dialog.toast('你点了取消', 'none', 1000);
								}
							}

						]);
					},
					//您的订单已受理
					popState2_1: function() {
						var that = this
						var phone = that.plusXing(gloabMobile, 3, 4, '*');
						var orderObj = {
							title: '温馨提示',
							phone: phone,
							mes: '【MM任我装流量包】订购申请已受理，办理成功通知以中国移动10086短信为准，请耐心等候。',
						};
						dialog.orderConfirm(orderObj, [{
								txt: '开始下载',
								color: false,
								fade: false,
								callback: function() {
									that.mainDownProgress()
								}
							},
							{
								txt: '关闭',
								color: false,
								fade: false,
								callback: function() {

								}
							}

						]);
					},
					//订购失败
					popState2_2: function() {
						var that = this
						var phone = that.plusXing(gloabMobile, 3, 4, '*');
						var orderObj = {
							title: '抱歉！订购失败',
							phone: phone,
							mes: '抱歉，因网络原因，您的本次订购出现错误，请重新领取。',
						};
						dialog.orderConfirm(orderObj, [{
								txt: '免费领取',
								color: false,
								fade: false,
								callback: function() {

								}
							},
							{
								txt: '关闭',
								color: false,
								fade: false,
								callback: function() {

								}
							}

						]);
					},
					//已订购
					popState2_3: function() {
						var that = this
						var phone = that.plusXing(gloabMobile, 3, 4, '*');
						var orderObj = {
							title: '您已经领取过免流套餐了',
							phone: phone,
							mes: '您已经订购过【MM任我装流量包】，可以马上开始免流下载了！',
						};
						dialog.orderConfirm(orderObj, [{
								txt: '开始下载',
								color: false,
								fade: false,
								callback: function() {

								}
							},
							{
								txt: '关闭',
								color: false,
								fade: false,
								callback: function() {

								}
							}

						]);
					},
					//手机输入框校验
					checkMobile: function(mobile) {
						var mobile = mobile || ''
						var regtel = /(?:^1[3456789]|^9[28])\d{9}$/; // 手机号段
						var $telYan = $('.tel-yanzheng')
						var flag = false
						if(mobile.length != 0) {
							if(regtel.test(mobile)) {
								// 移动号段
								var reg = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
								if(reg.test(mobile)) {
									$telYan.hide();
									flag =  true;
								} else {
									$telYan.text("请填写正确的移动手机号！");
									$telYan.show();
									flag =  false;
								}
							} else {
								$telYan.text("请填写正确的手机号！");
								$telYan.show();
								flag =  false;
							}
						} else {
							$telYan.text("手机号不能为空！");
							$telYan.show();
							flag =  false;
						}
						return flag;
					},
					checkCode: function(code) {
						var regtel = /^[0-9]{6}$/;
						$validCode = $('.valid-code');
						if(code.length != 0) {
							if(regtel.test(code)) {
								$validCode.hide();
								return true;
							} else {
								$validCode.text("验证码格式不正确！");
								$validCode.show();
								return false;
							}
						} else {
							$('.tel-code').text("验证码不能为空！");
							$('.tel-code').show();
							return false;
						}
					},
					//发送验证码
					getRandomCode(phone,$getCode) {
						var that = this
						var tag = that.checkMobile(phone)
				        if(tag){
				            YDUI.dialog.loading.open('发送中');
				            $.ajax({
				                type: "GET",
				                async:false,
				                url: "/s.do?requestid=send_code&msisdn="+phone,
				                success:function(data){
				           		YDUI.dialog.loading.close();
								$getCode.sendCode('start');
								YDUI.dialog.toast('已发送', 'success', 500);
				                }
				            });
				            
				        }
				},//end fun
					//校验验证码和手机号
					checkMobileAndCode:function (phone, code) {
						var that = this
						var LocCode = storage.getItem(phone);
						var dfd = $.Deferred()
						if(LocCode === code) {
							$('.tel-code').text("验证码已失效,请重新输入！");
							$('.tel-code').show();
							return;
						}
						request.get(interfaceUrl, {
								params: {
									requestid: that.send_code,
									msisdn: phone,
									userCode: code
								}
						}).then(function(res) {
							    var state = res.data
								if(state == 0) {
									storage.setItem(phone, code);
									dfd.resolve(true)
								} else {
									$('.tel-code').show();
									dfd.reject(false)
								}

							})
							.catch(function(e) {
								dfd.reject(false)
					        })
							return dfd;
				},//end fun
				test: function() {
					MMAppSharePage.prototype.test.apply(this, arguments);
				},
				/* 部分隐藏处理
				 ** str 需要处理的字符串
				 ** frontLen 保留的前几位
				 ** endLen 保留的后几位
				 ** cha 替换的字符串
				 */
				plusXing: function(num, frontLen, endLen, cha) {
					var str = num.toString()
					var len = str.length - frontLen - endLen;
					var xing = '';
					for(var i = 0; i < len; i++) {
						xing += cha;
					}
					return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
				}
		}
		// https://www.cnblogs.com/catgatp/p/9096103.html
		var onDonwLoad = new onClickDonwLoad();