//http://211.139.191.144:12634/s.do?requestid=authent

<!DOCTYPE html>
<html>
<head>
	<title>authent</title>
	<meta content="always" name="referrer">
</head>
<script type="text/javascript" src="/defaultSite/js/js/YDRZ.min.js" ></script>
<script src="/defaultSite/js/a/activity/common/jquery.min.js"></script>
<body>

</body>
<script type="text/javascript">	
	var preSign = YDRZ.getSign("000185","1.2"); 
	var sign=null;
	var RSAstartTime=Date.parse(new Date());     //获取当前时间
	$.ajax({
        type: "GET", 	 	
        url: "/s.do?requestid=getRSASign&sign="+preSign,
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
								    url: "/s.do?requestid=getAuthent",
								    data: tokenJson,
								    success: function(data){
								    	console.log(data);
								        var datas = JSON.stringify(data);
								        var jsonObj = eval('(' + datas + ')');
								        $("body").html(jsonObj.data.msisdn);
								    }   
								});
							}
						},
						error:function(res){
							console.log(res);
						}
					});


        		}
        	}
        },
        error:function(res){//错误回调
			console.log(res);
		}   
    });
</script>

<script type="text/javascript">
        var _udataProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _udataProtocol + 
	"da.mmarket.com/udata/udata.js%3faid%3d000185' type='text/javascript'%3E%3C/script%3E"));
</script>
</html>
 
