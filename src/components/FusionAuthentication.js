import http from './http';
const axios = require('axios');
export default class FusionAuthentication extends http {
	constructor(setiings) {
		super()
		let options = {
			// 初始化准备参数
			appId: '',
			appkey: '', //卓望公司分配
			msgId: '',
			timestamp: '',
			uuid: '',
			ydrzVersion:'1.1',
			// end 初始化准备参数
			initCallBack:null,
			cmpassporUrl: 'https://www.cmpassport.com/NumberAbility/jssdk_vlm/jssdk.min.js'
		}
		this.baseUrl = 'http://localhost:7300/mock/5de22d06808f421eb4aa48d7/au'
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
		try{
			//获取上游appId
			 const res = await this.getUpAppId()
		     if(res.data.code==200){
		     	 upAPPId = res.data.data.id
		     	 //获取预签名
		     	 const preSign =  await this.getPreSign(upAPPId)
		     	 console.log('preSign=',preSign)
		     	 //获取签名
		     	 const postData = {
		     	 	preSign:preSign
		     	 }
		     	 const signRes = await this.getSign(postData)
		     	 if(signRes.data.code==200){
		     	 	 console.log('sign=',signRes.data.data.sign)
		     	 	 this.sign = signRes.data.data.sign
		     	 	 typeof callback ==='function' && callback(this.sign)
		     	 }
		     }
		}catch(e){
			//TODO handle the exception
		}

	}

	//获取上游appid
	getUpAppId() {
		return axios.get(this.baseUrl+'/getUpAppId')
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
		return axios.post(this.baseUrl+'/threeFuse/getH5Sign',data)
	}
	getSignByInit(){
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
	/**
	 *  深度合并对象
	 */
	_deepClone(FirstOBJ, SecondOBJ) {
		for(let key in SecondOBJ) {
			FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
				deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
		}
		return FirstOBJ;
	}
}