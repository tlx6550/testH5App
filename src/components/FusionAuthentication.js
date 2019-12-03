import uitil from './uitil';
const axios = require('axios');
export default class FusionAuthentication extends uitil {
	constructor(setiings) {
		super()
		let options = {
			// 初始化准备参数
			appId: '',
			appkey: '', //卓望公司分配
			msgId: '',
			timestamp: '',
			uuid: '',
			ydrzVersion: '1.1',
			// end 初始化准备参数
			initCallBack: null,
			errorCallBack: null, //异常回调
			cmpassporUrl: 'https://www.cmpassport.com/NumberAbility/jssdk_vlm/jssdk.min.js'
		}
		this.baseUrl = 'http://localhost:7300/mock/5de22d06808f421eb4aa48d7/au'
		this.initBaseUrl = 'https://10.1.5.192:28443'
		let YDRZ = null;
		this.options = this._deepClone(options, setiings);

	}

	init() {
		const cmpassporUrl = this.options.cmpassporUrl
		const that = this
		this.preLoadJs(cmpassporUrl, function() {
			that.loadJsCallBack()
		})
	}
	async loadJsCallBack() {
		YDRZ = YDRZ || {}
		let upAPPId = null;
		const callback = this.options.initCallBack
		const errorCallBack = this.options.errorCallBack
		try {
			//获取上游appId
			const res = await this.getUpAppId()
			//debugger
			if(res.data.code == 200) {
				upAPPId = res.data.data.id
				//获取预签名
				const preSign = await this.getPreSign(upAPPId)
				console.log('preSign=', preSign)
				//获取签名
				const postData = {
					preSign: preSign
				}
				const signRes = await this.getSign(postData)
				if(signRes.data.code == 200) {
					console.log('sign=', signRes.data.data.sign)
					this.sign = signRes.data.data.sign
					typeof callback === 'function' && callback(this.sign)
				}
			}
		} catch(e) {
			//TODO handle the exception
			console.log(e)
			typeof errorCallBack === 'function' && errorCallBack(e)
		}

	}

	//获取上游appid
	getUpAppId() {
		const MsgReq = {
			"MsgHeader": {
				"MsgType": "xxReq",
				"Version": "1.0", //1
				"appId": '', //1 本系统为业务应用分配的AppId
				"sdkVersion": "", //0 SDK版本号标
				"appType": '', //0  调用app类型标识 100: SDK ，默认,
			},
			"MsgBody": {
				"systemTime": this._getTimeToMilliseconds(), //1 请求消息发送的系统时间，精确到毫秒，共17位
				"uaType": 'Android', //1 设备类别 1：Android 2: IOS
				"packageName": '', // 1 Android业务App包名称； IOS对应取 BundleID
				"clientState": '', // 1 防止重复提交类攻击;服务器原样返回;从客户端角度该值可以标识一次业务请求
				"ext": '', // 0 预留扩展字段
				"ua": '', //0 设备型号ua
				"sign": '' //1 签名字段1.body中的输入参数值（除sign外）参照字母排序拼接，拼接成key=value的字符串形式2.首尾加上appKey值3.最后对上述值取32位大写MD5值

			}
		}
		const obj = MsgReq.MsgBody
		const appKey = 'adsqe12adfsdf1212312'
		const aa = this._getPostSign(appKey, obj)
		debugger
		return axios.post('/web/tnc/client/threeFuse/config4appid', {
			MsgReq
		})
		//return axios.post('/web/tnc/client/threeFuse/config4appid',data:obj)
	}
	//获取准签名preSign
	getPreSign(appId) {
		return new Promise((res, rej) => {
			if(true) {
				setTimeout(function() {
					const preSign = YDRZ.getSign(appId, "1.2");
					res(preSign)
				}, 300)
			} else {
				rej(false)
			}

		})

	}
	//获取准名Sign
	getSign(data) {
		return axios.post(this.baseUrl + '/threeFuse/config4appid', data)
	}
	getSignByInit() {
		return this.sign
	}
	//获取token
	getTokenBySign() {
		return new Promise((res, rej) => {
			if(true) {
				setTimeout(function() {
					this.preSign = YDRZ.getSign(appId, "1.2");
					res(this.preSign)
				}, 300)
			} else {
				rej(false)
			}

		})
	}
	//预加载js
	preLoadJs(url, callback) {
		const script = document.createElement('script'),
			fn = callback || function() {};
		script.type = 'text/javascript';
		// IE
		if(script.readyState) {
			script.onreadystatechange = function() {
				if(script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					fn();
				}
			};
		} else {
			// 其他浏览器
			script.onload = function() {
				fn();
			};
		}
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}