!function (window) {
  /* 普通确认框 */
  var dialog = window.YDUI.dialog; // title 没有就不传
  // dialog.confirm('', '您已成功提交MM任我装流浪包订购申请，成功受理信息请以中国移动下发短信为准，目前由于订购用户较多，短信可能有延时，请耐心等待。', [
  //     {
  //         txt: '确定',
  //         color: false, /* false:黑色  true:绿色 或 使用颜色值 */
  //         callback: function () {
  //             dialog.toast('你点了取消', 'none', 1000);
  //         }
  //     }
  //
  // ]);
  // setTimeout(function(){
  //     $('#YDUI_CONFRIM').remove();
  // },5000)

  $('.lklq-btn').click(function () {
    var query = window.YDUI.dialog;
    $.post("/t.do?requestid=freeFlow_flowOrder&product_id=100000000398", function (data, status) {
      if (status == "success") {
        var datas = data.split("|");
        var jhret = datas[0];
        var status = datas[1];
        console.log('查询订购状态码--' + jhret + "----订购状态" + status);

        if (jhret == 0) {
          if (status == 0) {
            console.log('有订购信息');

            if (status == 0) {
              query.confirm('', '您已成功提交MM任我装流浪包订购申请，成功受理信息请以中国移动下发短信为准，目前由于订购用户较多，短信可能有延时，请耐心等待。', [{
                txt: '确定',
                color: false
                /* false:黑色  true:绿色 或 使用颜色值 */

              }]);
            } else if (status == 1) {
              query.confirm('', '您已订购免费5G流量包<br/>无需重复订购', [{
                txt: '确定',
                color: false
                /* false:黑色  true:绿色 或 使用颜色值 */

              }]);
            } else if (status == 4) {
              query.confirm('', '您已退订免费5G流量包<br/>不支持再次订购', [{
                txt: '确定',
                color: false
                /* false:黑色  true:绿色 或 使用颜色值 */

              }]);
            } else {
              query.confirm('', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [{
                txt: '确定',
                color: false
                /* false:黑色  true:绿色 或 使用颜色值 */

              }]);
            }
          } else {
            console.log('无订购信息开始调用订购');
            $.post("/t.do?requestid=freeFlow_dinggou&product_id=100000000398&channel_id=C10000000311", function (data, status) {
              if (status == "success") {
                console.log('订购结果码--' + data);

                if (data == null) {
                  query.confirm('', '您所在地区暂不支持订购，敬<br/>请期待', [{
                    txt: '确定',
                    color: false
                    /* false:黑色  true:绿色 或 使用颜色值 */

                  }]);
                } else {
                  if (data == 0) {
                    query.confirm('', '您已成功提交MM任我装流浪包订购申请，成功受理信息请以中国移动下发短信为准，目前由于订购用户较多，短信可能有延时，请耐心等待。', [{
                      txt: '确定',
                      color: false,

                      /* false:黑色  true:绿色 或 使用颜色值 */
                      callback: function callback() {}
                    }]);
                  } else {
                    query.confirm('', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [{
                      txt: '确定',
                      color: false
                      /* false:黑色  true:绿色 或 使用颜色值 */

                    }]);
                  }
                }
              }
            });
          }
        } else {
          query.confirm('', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [{
            txt: '确定',
            color: false
            /* false:黑色  true:绿色 或 使用颜色值 */

          }]);
        }
      } else {
        query.confirm('', '抱歉，因网络原因<br/>您本次订购出现错误，请重新领取。', [{
          txt: '确定',
          color: false
          /* false:黑色  true:绿色 或 使用颜色值 */

        }]);
      }
    });
  });
}(window);
var block = "";
var gloableLockOnTouchend = false;
var moveByTouchEnd,moveByTouch;
$(function () {
  try {
    window.mmutil.getUserInfo("f1");
  } catch (e) {}

  setTimeout(function () {
    if (isMM65 == "true") {
      console.log("进入6.5以上...");
      var tokenJson = {};
      tokenJson.token = uToken;
      console.log("获取客户端token" + uToken);
      $.ajax({
        dataType: "json",
        method: "POST",
        url: "/t.do?requestid=getUser_selfStudy",
        data: tokenJson,
        success: function success(data) {
          console.log(data);
          var datas = JSON.stringify(data);
          var jsonObj = eval('(' + datas + ')');

          try {
            phoneAnd = jsonObj.data.msisdn;
            console.log("统一认证获得手机号码:" + phoneAnd);
          } catch (e) {
            console.log("未获取到手机号码");
          }
        }
      });
    } else {
      console.log("进入6.5以下...");
      var preSign = YDRZ.getSign("000185", "1.2");
      var sign = null;
      var RSAstartTime = Date.parse(new Date());
      $.ajax({
        type: "GET",
        url: "/t.do?requestid=getRSASign&sign=" + preSign,
        success: function success(data) {
          if (null != data) {
            var datas = JSON.stringify(data);
            var jsonObj = eval('(' + datas + ')');
            var RSAendTime = Date.parse(new Date());
            var RSATime = parseInt(RSAendTime) - parseInt(RSAstartTime);
            console.log("RSATime " + RSATime);

            if ("0" == jsonObj.resultCode) {
              sign = jsonObj.sign;
              var TokenstartTime = Date.parse(new Date());
              YDRZ.getTokenInfo({
                data: {
                  //请求的参数
                  version: '1.2',
                  //接口版本号 （必填）
                  appId: '000185',
                  //应用Id （必填）
                  sign: sign,
                  //RSA加密后的sign（必填）
                  openType: '1',
                  //移动取号接口填写1,三网取号接口填写0 （必填，联调时必须填写为1）
                  expandParams: 'phoneNum=15112395842',
                  //扩展参数  格式：参数名=值  多个时使用 | 分割（选填，联调环境只能模拟取号，联调时需填写phoneNum=188185*****手机号可以随便填写，生产可不填）
                  isTest: '0' //是否启用测试线地址（传0时为启用不为0或者不传时为不启用）

                },
                success: function success(res) {
                  //成功回调
                  var TokenendTime = Date.parse(new Date()); //获取当前时间

                  var tokenTime = parseInt(TokenendTime) - parseInt(TokenstartTime);
                  console.log("tokenTime " + tokenTime);

                  if (00000 === res.code) {
                    var tokenJson = {};
                    tokenJson.token = res.token;
                    console.log("res.token " + res.token);
                    tokenJson.userInformation = res.userInformation;
                    tokenJson.tokenTime = tokenTime;
                    tokenJson.RSATime = RSATime;
                    $.ajax({
                      dataType: "json",
                      method: "POST",
                      url: "/t.do?requestid=getAuthent",
                      data: tokenJson,
                      success: function success(data) {
                        console.log(data);
                        var datas = JSON.stringify(data);
                        var jsonObj = eval('(' + datas + ')');

                        try {
                          phoneAnd = jsonObj.data.msisdn;
                          console.log("统一认证获得手机号码:" + phoneAnd);
                        } catch (e) {
                          console.log("未获取到手机号码");
                        }
                      }
                    });
                  }
                },
                error: function error(res) {
                  console.log(res);
                }
              });
            }
          }
        },
        error: function error(res) {
          //错误回调
          console.log(res);
        }
      });
    }
  }, 500);
  /**
  * 日期转化为字符串， 4位年+2位月+2位日
  */

  function getDateStr(date) {
    var _year = date.getFullYear();

    var _month = date.getMonth() + 1; // 月从0开始计数


    var _d = date.getDate();

    _month = _month > 9 ? "" + _month : "0" + _month;
    _d = _d > 9 ? "" + _d : "0" + _d;
    return _year + _month + _d;
  }

  var userNumber = phone;
  console.log("本机手机号码:" + userNumber);
  var isYiDong = validatePhone(userNumber);
  var nowTime = getDateStr(new Date());
  var jinru = window.YDUI.dialog;

  if (isYiDong == 1) {
    jinru.confirm('', '您非本次活动对象,<br/>感谢您的关注~<br/>去首页看看更多精彩内容吧~', [{
      txt: '去逛逛',
      color: false,

      /* false:黑色  true:绿色 或 使用颜色值 */
      callback: function callback() {// window.location.href='mm://index';
      }
    }]);
  } else if (nowTime > "20190431") {
    jinru.confirm('', '<br/><br/>活动已结束，感谢您的关注~', [{
      txt: '查看我的奖品',
      color: false,

      /* false:黑色  true:绿色 或 使用颜色值 */
      callback: function callback() {
        window.location.href = '/t.do?requestid=freeFlow_myprize';
      }
    }]);
  }
});

function award(ordinate_x) {
  console.log("ordinate_x=" + ordinate_x);
  var duihuan = window.YDUI.dialog;

  if (isMM65 == "true") {
    if (phoneAnd != "") {
      if (phoneAnd == phone) {
        $.post("/t.do?requestid=freeFlowA_duihuan&activityid=20190330&awardid=" + Atype + "&ordinate_x=" + ordinate_x, function (data, status) {
          if (status == "success") {
            gloableLockOnTouchend = true;
            var datas = data.split('|');
            console.log(datas[0]);

            if (datas[0] == 2000 || datas[0] == 9031) {
              if (Atype == 1 || Atype == 2) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 3 || Atype == 4) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 2;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 5 || Atype == 6) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              } else if (Atype == 7 || Atype == 8) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 1;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              }

              $(".slide-msg").removeClass("error");
              $(".slide-msg").addClass("success");
              $(".slide-msg").html("验证成功!");
              setTimeout(function () {
                duihuan.confirm('', '恭喜您，获得' + datas[1], [{
                  txt: '确定',
                  color: false,

                  /* false:黑色  true:绿色 或 使用颜色值 */
                  callback: function callback() {}
                }]);
                $(".slide-msg").removeClass("success");
                $(".slide-msg").html();
                block.style.left = '0px';
                hideSlideP();
              }, 2000);
            } else if (datas[0] == 7011 || datas[0] == 9996) {
              //验证码错误
              // refreshIcon();
              $(".slide-msg").removeClass("success");
              $(".slide-msg").addClass("error");
              $(".slide-msg").html("验证失败！请重新再试～");
              block.style.left = '0px';
              setTimeout(function () {
                $(".slide-msg").removeClass("error");
                $(".slide-msg").html();
              }, 2000);
            } else if (datas[0] == 2020) {
              if (Atype == 1 || Atype == 2) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 3 || Atype == 4) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 2;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 5 || Atype == 6) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              } else if (Atype == 7 || Atype == 8) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 1;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              }

              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '奖品已兑完，请稍后再试~', [{
                txt: '确定',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {}
              }]);
            } else if (datas[0] == 3000 || datas[0] == 9998) {
              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '您非本次活动对象,<br/>感谢您的关注~<br/>去首页看看更多精彩内容吧~', [{
                txt: '去逛逛',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {// window.location.href='mm://index';
                }
              }]);
            } else if (datas[0] == 9999 || datas[0] == -1000) {
              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '兑换失败，请使用本机手机号码<br/>登录(打开4G蜂窝网络开关)', [{
                txt: '确定',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {}
              }]);
            } else if (datas[0] == 3006 || datas[0] == 2007 || datas[0] == 2008 || datas[0] == 3002 || datas[0] == 3020) {
              if (Atype == 1 || Atype == 2) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 3 || Atype == 4) {
                if (document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 2;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 5 || Atype == 6) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              } else if (Atype == 7 || Atype == 8) {
                if (document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 1;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              }

              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '兑换失败，请稍后再试~', [{
                txt: '确定',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {}
              }]);
            } else if (datas[0] == 6010) {
              if (Atype == 1 || Atype == 2) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 3 || Atype == 4) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 2;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 5 || Atype == 6) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              } else if (Atype == 7 || Atype == 8) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 1;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              }

              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '兑换失败，请稍后再试~', [{
                txt: '确定',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {}
              }]);
            } else if (datas[0] == 1010) {
              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '<br/><br/>活动已结束，感谢您的关注~', [{
                txt: '查看我的奖品',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {
                  window.location.href = '/t.do?requestid=freeFlow_myprize';
                }
              }]);
            } else {
              if (Atype == 1 || Atype == 2) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 3 || Atype == 4) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts2").innerHTML = document.getElementById("seedCounts").innerHTML - 2;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "金牌");
                }
              } else if (Atype == 5 || Atype == 6) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 6;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              } else if (Atype == 7 || Atype == 8) {
                if ($("#seedCounts").html() > 0) {
                  document.getElementById("seedCounts").innerHTML = document.getElementById("seedCounts").innerHTML - 1;
                  var number = $("#seedCounts").html();
                  console.log("还有：" + number + "银牌");
                }
              }

              block.style.left = '0px';
              hideSlideP();
              duihuan.confirm('', '<br/><br/>系统繁忙，请稍后再试~', [{
                txt: '确定',
                color: false,

                /* false:黑色  true:绿色 或 使用颜色值 */
                callback: function callback() {}
              }]);
            }
          } else {
            duihuan.confirm('', '<br/><br/>系统繁忙，请稍后再试~', [{
              txt: '确定',
              color: false,

              /* false:黑色  true:绿色 或 使用颜色值 */
              callback: function callback() {}
            }]);
          }
        });
      } else {
        console.log("本机号码与登录号码不一致");
        block.style.left = '0px';
        hideSlideP();
        duihuan.confirm('', '兑换失败,请用本机号码登录后<br/>参加活动', [{
          txt: '确定',
          color: false,

          /* false:黑色  true:绿色 或 使用颜色值 */
          callback: function callback() {}
        }]);
      }
    } else {
      console.log("未获取到统一认证手机号码");
      block.style.left = '0px';
      hideSlideP();
      duihuan.confirm('', '兑换失败,请用本机号码登录后<br/>参加活动', [{
        txt: '确定',
        color: false,

        /* false:黑色  true:绿色 或 使用颜色值 */
        callback: function callback() {}
      }]);
    }
  } else {
    if (phoneAnd != "") {
      if (phoneAnd == phone) {} else {
        console.log("未获取到统一认证手机号码");
        block.style.left = '0px';
        hideSlideP();
        duihuan.confirm('', '兑换失败,请用本机号码登录后<br/>参加活动', [{
          txt: '确定',
          color: false,

          /* false:黑色  true:绿色 或 使用颜色值 */
          callback: function callback() {}
        }]);
      }
    } else {
      console.log("未获取到统一认证手机号码");
      block.style.left = '0px';
      hideSlideP();
      duihuan.confirm('', '兑换失败,请打开4G蜂窝网络<br/>开关后重试', [{
        txt: '确定',
        color: false,

        /* false:黑色  true:绿色 或 使用颜色值 */
        callback: function callback() {}
      }]);
    }
  }
}
/*请求验证码*/


function qqyzm(type) {
  Atype = type;
  $.post("/t.do?requestid=Slider_Verification_Component", function (data, status) {
    if (status == "success") {
      var datas = data.split('|');

      if (datas[0] == 0) {
        var initBlockPosi = [0, datas[1]]; //坐标

        var slideImg = "data:img/png;base64," + datas[2]; //背景图

        var blockImg = "data:img/png;base64," + datas[3]; //滑块图

        moveBlock(initBlockPosi, slideImg, blockImg);
      }
    }
  });
}

function hideSlideP() {
  gloableLockOnTouchend = false;
  document.removeEventListener('touchmove',moveByTouch,false);
    document.removeEventListener('touchend',moveByTouchEnd,false);
  $(".slide-container").hide();
}
/*刷新验证码*/

 
function refreshIcon() {
  $.post("/t.do?requestid=Slider_Verification_Component", function (data, status) {
    if (status == "success") {
      var datas = data.split('|');

      if (datas[0] == 0) {
        var initBlockPosi = [0, datas[1]]; //坐标

        var slideImg = "data:img/png;base64," + datas[2]; //背景图

        var blockImg = "data:img/png;base64," + datas[3]; //滑块图

        resetSlideImg(slideImg, blockImg, initBlockPosi);
      }
    }
  });
}

function emitResult(x) {
  //7011
  console.log("x坐标是：" + x);
    award(x);
  luckNum = parseInt(luckNum) + 1;
}

$(".refreshIcon").click(function () {
  refreshIcon();
}); // 弹窗关闭

$('.pop .close').click(function () {
  $('.pop').hide();
}); //点击X,关闭滑块弹窗

$(".canvas-close").click(function () {
  hideSlideP();
});

function resetSlideImg(slideImg, blockImg, initBlockPosi) {
  var initImgWidth = 574;
  var slideBgWidth = $(".slide-bg").width();
  var radioImg = slideBgWidth / initImgWidth;
  $(".slide-bg").attr("src", slideImg);
  $(".slide-block").attr("src", blockImg);
  $(".slide-block").css("top", initBlockPosi[1] * radioImg);
}

function moveBlock(initBlockPosi, slideImg, blockImg) {
  console.log('ccccc');
  var initImgWidth = 574;
  $(".slide-container").show();
  var slideWidth = $(".slider").width();
  var slideBarWidth = $(".sliderContainer").width();
  var canMoveWidth = slideBarWidth - slideWidth / 2;
  var slideBgWidth = $(".slide-bg").width();
  var blockImgWidth = $(".slide-block").width();
  var canMoveWidth2 = slideBarWidth - blockImgWidth;
  var radioMov = canMoveWidth2 / canMoveWidth;
  var slider = $(".slider")[0];
  block = $(".slide-block")[0]; //原始图片与页面图片的比例

  var radioImg = slideBgWidth / initImgWidth;
  $(".slide-bg").attr("src", slideImg);
  $(".slide-block").attr("src", blockImg);
  $(".slide-block").css("top", initBlockPosi[1] * radioImg);
  var originX,
      originY,
      startTime,
      isTouchStart = false;
  slider.addEventListener('touchstart', function (e) {
    originX = e.targetTouches[0].pageX, originY = e.targetTouches[0].pageY;
    startTime = e.timeStamp;
    var posi = parseFloat($(".slide-block").css("left")) / radioImg;
    console.log('开始拖动:');
    console.log("X坐标:" + posi);
    isTouchStart = true;
  });
  moveByTouch= function moveByTouch(e){
    if (!isTouchStart) return false;
    var moveX = e.targetTouches[0].pageX - originX;
    var moveY = e.targetTouches[0].pageY - originY;
    if (moveX < 0 || moveX > canMoveWidth) return false;
    slider.style.left = moveX + 'px';
    block.style.left = moveX * radioMov + 'px';
    }
  moveByTouchEnd=function moveByTouchEnd(e){
    console.log('dddddd');

    if (isTouchStart) {
      var endX = e.changedTouches[0].clientX;
      var timeStamp = ((e.timeStamp - startTime) / 1000).toFixed(2);
      var posi = parseFloat($(".slide-block").css("left")) / radioImg;
      console.log('');
      console.log('拖动结束:');
      console.log("X坐标:" + posi);
      console.log("时间:" + timeStamp + "秒");
      slider.style.left = "0px";
        if (!gloableLockOnTouchend) {
            console.log("eeeee");
            emitResult(parseInt(posi));
        }
    }
    e.stopPropagation();
    isTouchStart = false;
}
  document.addEventListener('touchmove', moveByTouch);
  document.addEventListener('touchend', moveByTouchEnd);
}