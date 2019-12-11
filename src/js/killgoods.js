function KillGoods(options){
    this.timer = null;
    this.todayTimer = true;
    this.options = $.extend({}, KillGoods.DEFAULTS, options || {});
}
KillGoods.DEFAULTS = {
    speed:1,// 间隔多少秒刷新时间 
    site:12,// 场次 用于回调函数的钩子 和下面的开始时间相关联
    beginTime:12,// 哪个时间点的场次
    $listBtn:null,
    $targetObj:null,// 时间动态变化jq集合
    beforeCallback:null, // 未开始的回调
    doCallback:null, // 正在进行时的回调
    endCallback:null, // 结束的回调
    notTodayCallback:null,// 不是当天的回调
    tagBefore:false, // 当前时间是否在设定时间之前
    tagNow:false,// 当前时间是否等于设定时间
    tagAfter:false,// 当前时间是否在设定时间之后
    tagNextEnd:false,// 该秒杀时间段是否结束了
    endTime:19,
    timeGap:{},// 距离活动时间开始集合
    timeEndGap:{}// 距离活动结束时间集合
};
KillGoods.prototype.init = function(){
    var speed = this.options.speed;
    var that = this;
    // 判断当前日期是否是周六
    var dayjs = this.getDate();
    var today = dayjs.weekDay;
    if(today!==6){
        this.todayTimer = false;
        that.isNotTody(today);
    }
    // 进入当天时间判断轮训
    that.todayTimer = setInterval(function(){
        var dayjs = that.getDate();
        var today = dayjs.weekDay;
        if(today!==6){
            return;
        }else{
            that.initPage();
            that.timer = setInterval(function(){
                that.initPage();
            },speed * 1000);
            clearInterval(that.todayTimer);
        }
    },speed * 1000);
};
KillGoods.prototype.initPage = function(){
    var that = this;
    // 获取当前时间
    that.getTagByTime();
    // 判断当前时间距离场次设定时间
    // 1.如果还没开始，设置文案 倒计时
    if(that.options.tagBefore){
        that.beforeSet();
        return;
    }
    // 2.如果开始，设置文案和倒计时
    if((that.options.tagAfter || that.options.tagNow) && !that.options.tagNextEnd) {
        that.rightNowSet();
        return;
    }
    // 3.如果结束，设置文案和倒计时
    if(that.options.tagNextEnd){
        that.endSet();
        return;
    }
};
KillGoods.prototype.getDate = function(){
    var date = new Date();
    var seperator1 = '-';
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var weekDay = date.getDay();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var obj = {
        y:year,
        m:month,
        d:strDate,
        weekDay:weekDay
    };
    return obj;
};
KillGoods.prototype.getTagByTime = function(){
    var dayjs = this.getDate();
    var beginTime = this.options.beginTime;
    var sBeginDate = dayjs.y + '/' + dayjs.m +'/' +dayjs.d + ' ' + beginTime + ':00:00';
    var now = new Date();
    var end = new Date(sBeginDate);
    var obj = this.caculate(end,now);
    var seconds = obj.seconds;
    var mins = obj.minutes
    var hours = obj.hours
    this.timeGap = obj;
    if(seconds===0 && mins===0 && hours===0){
        this.options.tagNow = true;
        this.options.tagBefore = false;
        this.options.tagAfter = false;
    }
    if(seconds > 0){
        this.options.tagBefore = true;
        this.options.tagNow = false;
        this.options.tagAfter = false;
    }
    if(seconds < 0){
        this.options.tagAfter = true;
        this.options.tagNow = false;
        this.options.tagBefore = false;
    }
    var endTime = this.options.endTime;
    var sEndTimeDate = dayjs.y + '/' + dayjs.m +'/' +dayjs.d + ' ' + endTime + ':00:00';
    var nextEnd = new Date(sEndTimeDate);
    var nextObj = this.caculate(nextEnd,now);
    var nextSecond = nextObj.seconds;
    this.timeEndGap = nextObj;
    if(nextSecond<0){
        this.options.tagNextEnd = true;
    }
	
};
KillGoods.prototype.beforeSet = function(){
    var callback = this.options.beforeCallback;
    var that = this;
    typeof callback == 'function' && callback(that);
};
// 时间差
KillGoods.prototype.caculate = function(end,now){
    var date1= end;    // 结束时间
    var date2= now;    // 开始
    var date3=date1.getTime()-date2.getTime(); // 时间差秒
    // 计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));

    // 计算出小时数
    var leave1=date3%(24*3600*1000)  ;  // 计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));

    // 计算相差分钟数
    var leave2=leave1%(3600*1000);        // 计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    // 计算相差秒数
    var leave3=leave2%(60*1000) ;     // 计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    // console.log('时间差' + days + '天' + hours + '时' + minutes + '分' + seconds + '秒');
    var obj = {
        days:days,
        hours:hours,
        minutes:minutes,
        seconds:seconds
    };
    return obj;
};
KillGoods.prototype.rightNowSet = function(){
    var callback = this.options.doCallback;
    var that = this;
    typeof callback == 'function' && callback(that);
};
KillGoods.prototype.endSet = function(){
    this.timeEndGap = {
        days:0,
        hours:'0',
        minutes:'0',
        seconds:'0'
    };
    var callback = this.options.endCallback;
    var that = this;
    typeof callback == 'function' && callback(that);
    clearInterval(that.timer);
};
// 秒杀活动时间轮训时间动态显示
KillGoods.prototype.getPrizeByLeftTime = function(obj,$targetObj){
    var h = obj.hours<10?'0'+obj.hours:obj.hours;
    var m = obj.minutes<10?'0'+obj.minutes:obj.minutes;
    var s = obj.seconds<10?'0'+obj.seconds:obj.seconds;
    $targetObj.h.text(h);
    $targetObj.m.text(m);
    $targetObj.s.text(s);
};

// 当按钮状态发生更新如data-isleft 更改
KillGoods.prototype.updateBtnList = function(site){
    var selector = '.'+site+'-time';
    this.options.$listBtn = selector.children('.card-list').find('.btn');
};
// 不是当天日期
KillGoods.prototype.isNotTody = function(today){
    var callback = this.options.notTodayCallback;
    var that = this;
    if(!that.todayTimer){
        typeof callback == 'function' && callback(that,today);
    }
	
};
