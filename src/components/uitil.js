export default class uitil {
    //构造函数，里面写上对象的属性
    constructor() {
    
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
    //方法写在后面
    /**
	 *  获取时间格式 精确到毫秒级别 共 17位
	 */
    _getTimeToMilliseconds() { 
		var myDate = new Date();
		var moth = myDate.getMonth() + 1
		moth = hour<10?'0'+moth:moth
		var date = myDate.getDate()
		date = date<10?'0'+date:date
		var hour = myDate.getHours()
		hour = hour<10?'0'+hour:hour
		var time = myDate.getFullYear() + '' + moth + date + hour + myDate.getMinutes() + myDate.getSeconds() + myDate.getMilliseconds()
		return time
	}
	/**
	 *  获取提交签名
	 */
	_getPostSign(appKey, obj) { 
		let arr = []
		for(let key in obj) {
			arr.push(key)
		}
		arr = arr.sort();
		let pre = ''
		const not = '" "'
		for(let j = 0; j < arr.length; j++) {
			//存在设置的值且sign不拼接
			if(arr[j] !== 'sign') {
				const key = arr[j]
				const value = obj[key] 
				if(value){
					pre = pre + key + '=' + obj[key]
				}
			}

		}
		pre = appKey + pre + appKey
		return pre
	}
}