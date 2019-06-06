//https://github.com/chimurai/http-proxy-middleware
var express = require('express');
  var proxy = require("http-proxy-middleware");
  var app = express();


  app.use('/s.do',
      proxy({
          // 代理目标地址
          target: "http://221.179.8.170:8080",
          changeOrigin: true,
//        pathRewrite: {
//            // 地址重写
//            "^/s.do/": "/s.do/"
//        }
      }));

  //指定启动服务器到哪个文件夹，
app.use(express.static('./'));
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});