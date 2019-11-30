import http from './http';
export default class FusionAuthentication extends http {
	constructor(setiings) {
		super()
		let options = {
			cmpassporUrl: 'https://www.cmpassport.com/NumberAbility/jssdk_vlm/jssdk.min.js'
		}
		this.options = this._deepClone(options, setiings);

	}

	init() {
		const cmpassporUrl = this.options.cmpassporUrl
		this.preLoadJs(cmpassporUrl, function() {
			console.log(YDRZ)
		})
		this.get()
		console.log(this.options)
		//	this.props.get()
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
	//获取上游appid
	getUpAppId() {

	}
	//获取准签名preSign
	getPreSign() {

	}
	//获取准名Sign
	getSign() {

	}
	//获取token
	getTokenBySign() {

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