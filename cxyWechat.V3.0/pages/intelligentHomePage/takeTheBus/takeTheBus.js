// 全程线路站点-线路
const wholeLine = [
    { dire: ['down', 'null'], point: [20, 370] },//广承轩
    { dire: ['down', 'null'], point: [70, 370] },//香蜜山
    { dire: ['down', 'null'], point: [120, 370] },//古田村
    { dire: ['down', 'null'], point: [170, 370] },//听湖山居
    { dire: ['null', 'right'], point: [224, 240] },//五指山
    { dire: ['null', 'right'], point: [224, 54] },//溪头村
    { dire: ['up', 'null'], point: [140, 54] },//千泷沟瀑布
    { dire: ['down', 'null'], point: [60, 54] },//胜象竹海
    { dire: ['down', 'null'], point: [140, 54] },//千泷沟瀑布
    { dire: ['null', 'left'], point: [224, 54] },//溪头村
    { dire: ['null', 'left'], point: [224, 240] },//五指山
    { dire: ['down', 'null'], point: [340, 370] },//湖光山庄
    { dire: ['down', 'null'], point: [420, 370] },//流溪河
    { dire: ['down', 'null'], point: [500, 370] },//良口镇
    { dire: ['null', 'right'], point: [586, 240] },//卡丁车
    { dire: ['down', 'null'], point: [586, 54] },//人文蜡像馆
    { dire: ['up', 'null'], point: [530, 54] },//碧水云天
    { dire: ['up', 'null'], point: [474, 54] },//世外葡园
    { dire: ['up', 'null'], point: [420, 54] },//良平村
    { dire: ['up', 'null'], point: [364, 54] },//碧水峡漂流
    { dire: ['down', 'null'], point: [310, 54] },//影古驿站
    { dire: ['down', 'null'], point: [364, 54] },//碧水峡漂流
    { dire: ['down', 'null'], point: [420, 54] },//良平村
    { dire: ['down', 'null'], point: [474, 54] },//世外葡园
    { dire: ['down', 'null'], point: [530, 54] },//碧水云天
    { dire: ['null', 'left'], point: [586, 54] },//人文蜡像馆
    { dire: ['null', 'left'], point: [586, 240] },//卡丁车
    { dire: ['down', 'null'], point: [640, 370] },//碧水湾
    { dire: ['null', 'right'], point: [704, 240] },//碧水园农庄
    { dire: ['null', 'left'], point: [704, 54] },//六三市
    { dire: ['null', 'left'], point: [704, 240] },//碧水园农庄
    { dire: ['down', 'null'], point: [770, 370] },//文轩苑
    { dire: ['down', 'null'], point: [820, 370] },//都喜泰丽
    { dire: ['down', 'null'], point: [870, 370] },//卓思道
    { dire: ['down', 'null'], point: [920, 370] },//从都国际
    { dire: ['null', 'left'], point: [984, 480] },//耕山小寨
    { dire: ['null', 'right'], point: [984, 646] },//崴格诗
    { dire: ['null', 'right'], point: [984, 480] },//耕山小寨
    { dire: ['up', 'null'], point: [1050, 370] },//游船码头
];
// 每个站点的坐标：point-实际坐标点，site-在手机屏幕的位置[top,right]，name-站点名称 113.75514,23.678365
const location = [
    { "point": "113.927654,23.777935", "site": [20, 370], "name": "广承轩酒店", "mySite": [10, 450] },
    { "point": "113.90826,23.77019", "site": [70, 370], "name": "香蜜山果庄", "mySite": [65, 450] },
    { "point": "113.877992,23.763073", "site": [120, 370], "name": "古田村", "mySite": [115, 450] },
    { "point": "113.798233,23.755627", "site": [170, 370], "name": "听湖山居", "mySite": [165, 450] },
    { "point": "113.804101,23.73606", "site": [224, 240], "name": "五指山景区", "mySite": [190, 250] },
    { "point": "113.8573398,23.7199168", "site": [224, 54], "name": "溪头村", "mySite": [220, 130] },
    { "point": "113.8540350,23.7093415", "site": [140, 54], "name": "千泷沟瀑布", "mySite": [135, 130] },
    { "point": "113.8567328,23.7153919", "site": [60, 54], "name": "胜象竹海", "mySite": [55, 130] },
    { "point": "113.787631,23.741702", "site": [340, 370], "name": "湖光山庄", "mySite": [330, 450] },
    { "point": "113.782482,23.748237", "site": [420, 370], "name": "流溪河森林公园", "mySite": [410, 450] },
    { "point": "113.73466,23.718545", "site": [500, 370], "name": "良口镇政府", "mySite": [490, 450] },
    { "point": "113.729043,23.700344", "site": [586, 240], "name": "卡丁车", "mySite": [550, 250] },
    { "point": "113.729446,23.70037", "site": [586, 54], "name": "人文蜡像馆", "mySite": [576, 130] },
    { "point": "113.731753,23.697445", "site": [530, 54], "name": "碧水云天", "mySite": [525, 130] },
    { "point": "113.75514,23.678365", "site": [474, 54], "name": "世外萄园", "mySite": [470, 130] },
    { "point": "113.771713,23.676516", "site": [420, 54], "name": "良平村", "mySite": [415, 130] },
    { "point": "113.778797,23.676263", "site": [364, 54], "name": "碧水峡漂流", "mySite": [360, 130] },
    { "point": "113.790436,23.679734", "site": [310, 54], "name": "影古驿站", "mySite": [305, 130] },
    { "point": "113.716229,23.6989", "site": [640, 370], "name": "碧水湾", "mySite": [635, 450] },
    { "point": "113.630434,23.568853", "site": [704, 240], "name": "碧水园农庄", "mySite": [670, 250] },
    { "point": "113.720961,23.698853", "site": [704, 54], "name": "六三市美食", "mySite": [670, 65] },
    { "point": "113.713729,23.697544", "site": [770, 370], "name": "文轩苑", "mySite": [760, 450] },
    { "point": "113.716116,23.696148", "site": [820, 370], "name": "都喜泰丽", "mySite": [810, 450] },
    { "point": "113.708115,23.688081", "site": [870, 370], "name": "卓思道温泉", "mySite": [865, 450] },
    { "point": "113.679851,23.682032", "site": [920, 370], "name": "从都国际", "mySite": [915, 450] },
    { "point": "113.648283,23.69603", "site": [984, 480], "name": "耕山小寨", "mySite": [950, 490] },
    { "point": "113.641213,23.69578", "site": [984, 646], "name": "葳格诗温泉", "mySite": [950, 650] },
    { "point": "113.67611,23.65976", "site": [1050, 370], "name": "游船码头", "mySite": [1045, 450] },
];
// 路口站点：
const routeSite = [
    [224, 370],//路口0(五指山景区)
    [586, 370],//路口1(卡丁车)
    [704, 370],//路口2(碧水园农庄)
    [984, 370],//路口3(耕山小寨)
];
var util = require('../../../utils/util.js');
var amapFile = require('../../../utils/amap-wx.js');
var amapFun = new amapFile.AMapWX({ key: 'f387407e04361890eb004cafd1c4e523' });
Page({
    data: {
        carImg: util.baseUrl + 'img/direct_train/takeACar/tag_car.png',//车辆的图片
        mainCarImg: util.baseUrl + 'img/intelligentTraffic/mainLine.png',//背景图
        takeBusImg: util.baseUrl + 'img/intelligentTraffic/take_bus.jpg',//背景图
        myAddressImg: util.baseUrl + 'img/intelligentTraffic/take_add.png',//坐标点
        myAddressName: '',//我所在的站点
        myAddressSite: '',//我的位置
        piontGCX: 20,//终点站：广承轩酒店
        piontYCMT: 1050,//终点站：游船码头
        siteTime: 60000,//每个站点停车时间1分钟(除始发站外)：60000ms
        stationTime: 600000,//始发站停车时间10分钟：600000ms
        millisecond: 4000,//每 5476ms 车行走一次
        distance: 2,//每次行走 2rpx
        stationTimeout: '',//到站停车60s倒计时
        // ----------------------------------------------------------------------------
        mainDire: 'down',//主干线车辆方向：down-从广承轩酒店(首发站)出发 up-从游船码头出发
        mainTop: 20,//主干线车辆：20-从广承轩酒店出发 1050-从游船码头出发
        mainInterval: '',//主干线车辆的定时器 
        mainTimeout: '',//主干线到站停车倒计时
        mainStationOut: '',//主干线到终点站停车倒计时
        // ----------------------------------------------------------------------------
        lineDriving: 1,// 1-往游船码头方向，2-往广承轩酒店方向
        lineDirection: ['down', 'null'],//方向[垂直, 水平] 垂直：down-从广承轩酒店出发 up-从游船码头出发；水平：null(表示在主干线上)、left、right
        lineCoordinate: [20, 370],//坐标[top, right]
        lineInterval: '',//全程线车辆的定时器
        lineTimeout: '',//全程线车辆到站停车倒计时
        lineStationOut: '',//全程线车辆到终点站停车倒计时
    },
    onLoad: function (options) {

        // 获取我的位置
        this.getMyAddress();

        // ------------------------------------获取当前时间，格式：(2018-06-15 11:17:16)------------------------------------
        const currentTime = util.formatTime(new Date()).split(' ');
        const thisDate = currentTime[0].split('-');
        const thisTime = currentTime[1].split(':');
        // console.log('当前时间：', currentTime);

        this.onLoadMain(thisTime);
        this.onLoadLine(thisDate);
    },
    onUnload: function () {
        // 保存主干线车辆的位置，并清除该定时器
        // wx.setStorageSync('ZTCMAININFO', {
        //     mainTop: this.data.mainTop,
        //     mainDire: this.data.mainDire
        // });
        clearInterval(this.data.mainInterval);
        clearTimeout(this.data.mainTimeout);
        clearTimeout(this.data.mainStationOut);

        // 保存全程线车辆的位置，并清除该定时器
        // wx.setStorageSync('ZTCLINEINFO', {
        //     driving: this.data.lineDriving,
        //     direction: this.data.lineDirection,
        //     coordinate: this.data.lineCoordinate
        // });
        clearInterval(this.data.lineInterval);
        clearTimeout(this.data.lineTimeout);
        clearTimeout(this.data.lineStationOut);
    },

    // ------------------------------------主干线车辆------------------------------------
    onLoadMain: function (thisTime) {
        // this.setData({
        //     mainTop: wx.getStorageSync('ZTCMAININFO').top || 20,
        //     mainDire: wx.getStorageSync('ZTCMAININFO').dire || 'down',
        // });
        // this.mainFun();
        /**
         *                  理想情况下！！！
         * 每 4s 走 2rpx，得出速度 2s/rpx，总路程 1030rpx，得出总时间 1030*2=2060s，这是不停车情况下
         * 首发站停车10分钟，中间经过11个站，中间每个站停车1分钟，得到单程用的总时长：2060+10*60+11*60=3320s 约等于55分钟
         */
        var totalmillisecond = 1000 * (Number(thisTime[1]) * 60 + Number(thisTime[2]));// 计算总毫秒数
        var totalDistance = parseInt((this.data.distance / this.data.millisecond) * totalmillisecond);//已走的总路程=v*t，取整数
        console.log('总毫秒数：', totalmillisecond, '已走路程：', totalDistance);
        const downTime = [8, 10, 12, 14, 16];//时间点：小时，当天首班车8点发车，最后一班车16点发车
        const upTime = [9, 11, 13, 15, 17];//时间点：小时，17点最后一班返程
        if (downTime.indexOf(Number(thisTime[0])) >= 0) {
            console.log('主干线：当前车辆是往 - 游船码头 - 方向行驶')
            if (totalDistance > 1050) {
                totalDistance = 1050;
            } else if (totalDistance < 20) {
                totalDistance = 20;
            }
            this.setData({ mainTop: totalDistance, mainDire: 'down' });
            this.mainFun();

        } else if (upTime.indexOf(Number(thisTime[0])) >= 0) {
            console.log('主干线：当前车辆是往 - 广承轩酒店 - 方向行驶')
            if (1070 - totalDistance > 1050) {
                totalDistance = 1050;
            } else if (1070 - totalDistance < 20) {
                totalDistance = 20;
            }
            this.setData({ mainTop: totalDistance, mainDire: 'up' });
            this.mainFun();
        }
    },

    // ------------------------------------全程线车辆------------------------------------
    onLoadLine: function (thisDate) {
        // this.setData({
        //     lineDriving: wx.getStorageSync('ZTCLINEINFO').driving || 1,
        //     lineDirection: wx.getStorageSync('ZTCLINEINFO').direction || ['down', 'null'],
        //     lineCoordinate: wx.getStorageSync('ZTCLINEINFO').coordinate || [20, 370],
        // });
        // this.lineFun();
        /**
         *                  理想情况下！！！
         * 每 4s 走 2rpx，得出速度 2s/rpx，总路程 4364rpx，得出总时间 4364/2=2182s，这是不停车情况下，约平均每个站用时60s
         * 首发站停车10分钟，中间经过36个站，中间每个站停车1分钟，得到单程用的总时长：2182+10*60+36*60=4942s  约等于82.4分钟
         * 
         * 全部站点跑完一次需2182s，不算停车情况，每个站平均60s
         * 假设：8:00在第一个站，8:02在第二个站，8:04在第三个站，，，，，，8:56在第几个站？
         * 计算：56/2 取整得到第28个站
         */
        var index = 0;//数组wholeLine的下标
        var newStart = 0, newEnd = 0, newReturnStart = 0;
        const newCurrTime = new Date();//当前时间
        // const newCurrTime = new Date(Number(thisDate[0]), Number(thisDate[1]) - 1, Number(thisDate[2]), 10, 41, 52);//测试：当前时间
        const wholeLineDis = 4364;//全程线的总路程
        const wholeMillisecond = 1000 * 10320;// 计算总毫秒数
        const llkArr = [//单程用时1小时16分钟，即10320s，包括途经站点停车时间；到终点站停车10分钟
            { driving: 1, depart: '08:00', arrival: '09:16' },
            { driving: 2, depart: '09:26', arrival: '10:42' },
            { driving: 1, depart: '10:52', arrival: '12:08' },
            { driving: 2, depart: '12:18', arrival: '13:34' },
            { driving: 1, depart: '13:44', arrival: '15:00' },
            { driving: 2, depart: '15:10', arrival: '16:26' },
            { driving: 1, depart: '16:36', arrival: '17:52' },
            { driving: 2, depart: '18:02', arrival: '19:18' },
        ];
        // 还没到 8:00
        const theFirstTime = new Date(Number(thisDate[0]), Number(thisDate[1]) - 1, Number(thisDate[2]), 8, 0);
        if (newCurrTime.getTime() < theFirstTime.getTime()) {
            console.log('还没到 8:00');
            this.setData({
                lineDriving: 1,
                lineDirection: wholeLine[0].dire,
                lineCoordinate: wholeLine[0].point,
            });
        } else {
            for (var i = 0; i < llkArr.length; i++) {
                // 发车时间
                newStart = new Date(Number(thisDate[0]), Number(thisDate[1]) - 1, Number(thisDate[2]), Number(llkArr[i].depart.split(':')[0]), Number(llkArr[i].depart.split(':')[1]));
                // 到终点站时间
                newEnd = new Date(Number(thisDate[0]), Number(thisDate[1]) - 1, Number(thisDate[2]), Number(llkArr[i].arrival.split(':')[0]), Number(llkArr[i].arrival.split(':')[1]));
                // 返程的发车时间
                newReturnStart = llkArr[i + 1] ? new Date(Number(thisDate[0]), Number(thisDate[1]) - 1, Number(thisDate[2]), Number(llkArr[i + 1].depart.split(':')[0]), Number(llkArr[i + 1].depart.split(':')[1])) : 0;

                if (newCurrTime.getTime() >= newStart.getTime() && newCurrTime.getTime() < newEnd.getTime()) {// 在 depart 至 arrival 时间范围内
                    //当前时间 - 发车时间 = 车行时间，转化分钟，取整
                    const alreadyTime = parseInt((newCurrTime.getTime() - newStart.getTime()) / 1000 / 60);
                    if (alreadyTime % 2 == 0) {
                        if (llkArr[i].driving == 1) {// 游船码头方向
                            index = alreadyTime / 2;// wholeLine 数组正序
                            if (wholeLine[index].dire[0] == 'up') {
                                wholeLine[index].dire[0] = 'down';
                            }
                        } else {// 广承轩方向
                            index = wholeLine.length - 1 - alreadyTime / 2;// wholeLine 数组倒序
                            if (wholeLine[index].dire[0] == 'down') {
                                wholeLine[index].dire[0] = 'up';
                            }
                        }
                        // console.log(llkArr[i], wholeLine[index])
                        // console.log('刚好到下一个站，方向:', llkArr[i].driving, 'index:', index);
                        this.setData({
                            lineDriving: llkArr[i].driving,
                            lineDirection: wholeLine[index].dire,
                            lineCoordinate: wholeLine[index].point,
                        });
                        this.lineFun();
                    } else {
                        var that = this;
                        console.log('到站点了，停车1分钟==============', (new Date()).getSeconds())
                        clearInterval(that.data.lineInterval);//清除行车定时器
                        if (llkArr[i].driving == 1) {
                            index = parseInt(alreadyTime / 2);// wholeLine 数组正序
                            if (wholeLine[index].dire[0] == 'up') {
                                wholeLine[index].dire[0] = 'down';
                            }
                        } else {
                            index = wholeLine.length - 1 - parseInt(alreadyTime / 2);// wholeLine 数组倒序
                            if (wholeLine[index].dire[0] == 'down') {
                                wholeLine[index].dire[0] = 'up';
                            }
                        }
                        // console.log(llkArr[i], wholeLine[index])
                        // console.log('进入1分钟停车时间，方向:', llkArr[i].driving, 'index:', index);
                        this.setData({
                            lineDriving: llkArr[i].driving,
                            lineDirection: wholeLine[index].dire,
                            lineCoordinate: wholeLine[index].point,
                        });
                        //开启停车倒计时60s
                        clearTimeout(that.data.lineStationOut);//清除停车倒计时
                        this.data.lineStationOut = setTimeout(function () {
                            clearTimeout(that.data.lineStationOut);//清除停车倒计时
                            console.log('**************停车1分钟后继续行车**************', (new Date()).getSeconds())
                            that.data.lineInterval = setInterval(function () {
                                that.intervalFun2(that.data.millisecond, that.data.distance);
                            }, that.data.millisecond);
                            that.setData({ lineInterval: that.data.lineInterval });
                        }, that.data.siteTime);
                        that.setData({ lineStationOut: that.data.lineStationOut });
                    }
                } else if (llkArr[i + 1] && newCurrTime.getTime() >= newEnd.getTime() && newCurrTime.getTime() < newReturnStart.getTime()) {// 在终点站停车时间范围内
                    var that = this;
                    console.log('到达终点站：停车10分钟后返程==============', util.formatTime(new Date()).split(' ')[1])
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    if (Number(llkArr[i + 1].depart.split(':')[0]) == 9 || Number(llkArr[i + 1].depart.split(':')[0]) == 12 || Number(llkArr[i + 1].depart.split(':')[0]) == 15 || Number(llkArr[i + 1].depart.split(':')[0]) == 18) {
                        index = wholeLine.length - 1;//游船码头
                    } else if (Number(llkArr[i + 1].depart.split(':')[0]) == 10 || Number(llkArr[i + 1].depart.split(':')[0]) == 13 || Number(llkArr[i + 1].depart.split(':')[0]) || 16) {
                        index = 0;//广承轩酒店
                    }
                    this.setData({
                        lineDriving: llkArr[i + 1].driving,
                        lineDirection: wholeLine[index].dire,
                        lineCoordinate: wholeLine[index].point,
                    });
                    // 终点站停车10分钟后启动
                    clearTimeout(this.data.lineTimeout);//清除10分钟倒计时
                    const restTime = newReturnStart.getTime() - newCurrTime.getTime();//剩余倒计时
                    console.log('剩余倒计时，毫秒', restTime);
                    this.data.lineTimeout = setTimeout(function () {
                        clearTimeout(that.data.lineTimeout);//清除10分钟倒计时
                        console.log('返程启动==============', (new Date()).getSeconds());
                        that.data.lineInterval = setInterval(function () {
                            that.intervalFun2(that.data.millisecond, that.data.distance);
                        }, that.data.millisecond);
                        that.setData({ lineInterval: that.data.lineInterval });
                    }, restTime);
                    this.setData({ lineTimeout: this.data.lineTimeout });
                }
            }
        }
    },

    /**==========================================================================================================================================
     * ********************************************** 主干线 **********************************************
     ==========================================================================================================================================*/
    mainFun: function () {
        var that = this;
        var millisecond = this.data.millisecond, distance = this.data.distance;//每millisecond毫秒走distance
        // ******** 首次发车 ********
        clearInterval(this.data.mainInterval);
        this.data.mainInterval = setInterval(function () {
            that.intervalFun1(millisecond, distance);
        }, millisecond);
        this.setData({ mainInterval: this.data.mainInterval });
    },

    // ******** 行车处理 ********
    intervalFun1: function (millisecond, distance) {
        var that = this;
        var piontGCX = this.data.piontGCX, piontYCMT = this.data.piontYCMT;//两个终点站
        var dire = this.data.mainDire;//车辆的方向
        var top = this.data.mainTop;//车辆的top，即位置
        var tenMin = this.data.stationTime;//10分钟倒计时 10min=600000ms
        if (dire == 'down') {
            top = (Number(top) + distance).toFixed(2);
            if (top >= piontYCMT) {//到达终点站：游船码头
                top = piontYCMT;
                console.log('完成单程，停车10分钟后返程==============', util.formatTime(new Date()).split(' ')[1])
                clearInterval(this.data.mainInterval);//清除行车定时器
                dire = 'up';
                this.setData({ mainDire: 'up' });
                // 终点站停车10分钟后启动
                clearTimeout(this.data.mainTimeout);//清除10分钟倒计时
                this.data.mainTimeout = setTimeout(function () {
                    clearTimeout(that.data.mainTimeout);//清除10分钟倒计时
                    console.log('返程启动==============', (new Date()).getSeconds());
                    that.data.mainInterval = setInterval(function () {
                        that.intervalFun1(millisecond, distance);
                    }, millisecond);
                    that.setData({ mainInterval: that.data.mainInterval });
                }, tenMin);
                this.setData({ mainTimeout: this.data.mainTimeout });
            } else {//未到终点站
                this.stopInSite1(millisecond, distance, top);
            }
        } else {
            top = (Number(top) - distance).toFixed(2);
            if (top <= piontGCX) {//到达终点站：广承轩酒店
                top = piontGCX;
                console.log('完成单程，停车10分钟后返程==============', (new Date()).getSeconds())
                clearInterval(this.data.mainInterval);//清除行车定时器
                dire = 'down';
                this.setData({ mainDire: 'down' });
                // 终点站停车10分钟后启动
                clearTimeout(this.data.mainTimeout);//清除10分钟倒计时
                this.data.mainTimeout = setTimeout(function () {
                    clearTimeout(that.data.mainTimeout);//清除10分钟倒计时
                    console.log('返程启动==============', (new Date()).getSeconds());
                    that.data.mainInterval = setInterval(function () {
                        that.intervalFun1(millisecond, distance);
                    }, millisecond);
                    that.setData({ mainInterval: that.data.mainInterval });
                }, tenMin);
                this.setData({ mainTimeout: this.data.mainTimeout });
            } else {//未到终点站
                this.stopInSite1(millisecond, distance, top);
            }
        }
        console.log('主干线-车行位置 top:' + top, 'dire:' + dire)
        this.setData({ mainTop: top });
    },

    // ******** 站点停车处理 ********
    stopInSite1: function (millisecond, distance, top) {
        var that = this;
        var sitePionts = [20, 70, 120, 170, 340, 420, 500, 640, 770, 820, 870, 920, 1050];//每个站点的位置
        var sixtyS = this.data.siteTime;//60s停车倒计时 60s=60000ms
        sitePionts.map(function (item, index, self) {
            if (item == top) {
                console.log('到站点了，停车1分钟==============', (new Date()).getSeconds())
                clearInterval(that.data.mainInterval);//清除行车定时器
                //开启停车倒计时60s
                clearTimeout(that.data.mainStationOut);//清除停车倒计时
                that.data.mainStationOut = setTimeout(function () {
                    clearTimeout(that.data.mainStationOut);//清除停车倒计时
                    console.log('**************停车1分钟后继续行车**************', (new Date()).getSeconds())
                    that.data.mainInterval = setInterval(function () {
                        that.intervalFun1(millisecond, distance);
                    }, millisecond);
                    that.setData({ mainInterval: that.data.mainInterval });
                }, sixtyS);
                that.setData({ mainStationOut: that.data.mainStationOut });
            } else {
                // console.log('----------------循环----------------')
            }
        });
    },

    /**==========================================================================================================================================
     * ********************************************** 全程线 **********************************************
     ==========================================================================================================================================*/
    lineFun: function () {
        var that = this;
        var millisecond = this.data.millisecond, distance = this.data.distance;//每millisecond毫秒走distance
        // ******** 首次发车 ********
        clearInterval(this.data.lineInterval);
        this.data.lineInterval = setInterval(function () {
            that.intervalFun2(millisecond, distance);
        }, millisecond);
        this.setData({ lineInterval: this.data.lineInterval });
    },

    // ******** 行车处理 ********
    intervalFun2: function (millisecond, distance) {
        var that = this;
        var piontGCX = this.data.piontGCX, piontYCMT = this.data.piontYCMT;//两个终点站
        var driving = this.data.lineDriving;//1-往游船码头方向，2-往广承轩酒店方向
        var direction = this.data.lineDirection;//车辆的方向：[down, null]
        var linepiont = this.data.lineCoordinate;//车辆位置：[top, right]

        if (direction[0] == 'null') {//车辆正在分支线跑
            if (direction[1] == 'right') {
                linepiont[1] = Number((Number(linepiont[1]) - distance).toFixed(2));
                if (linepiont[0] == location[5].site[0] && linepiont[1] <= location[5].site[1]) {
                    linepiont[0] = location[5].site[0];
                    linepiont[1] = location[5].site[1];
                    direction = ['up', 'null'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：溪头村', linepiont, direction);
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == location[12].site[0] && linepiont[1] <= location[12].site[1]) {
                    linepiont[0] = location[12].site[0];
                    linepiont[1] = location[12].site[1];
                    direction = ['up', 'null'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：人文蜡像馆', linepiont, direction);
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == location[20].site[0] && linepiont[1] <= location[20].site[1]) {
                    linepiont[0] = location[20].site[0];
                    linepiont[1] = location[20].site[1];
                    direction = ['null', 'left'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：六三市美食', linepiont, direction);
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == routeSite[3][0] && linepiont[1] == routeSite[3][1]) {
                    linepiont[0] = routeSite[3][0];
                    linepiont[1] = routeSite[3][1];
                    console.log('到达交叉点，路口3-耕山小寨 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    if (driving == 1) {//往游船码头方向
                        direction = ['down', 'null'];
                    } else if (driving == 2) {//往广承轩酒店方向
                        direction = ['up', 'null'];
                    }
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else {
                    this.stopInSite2(millisecond, distance, linepiont, direction);
                }
            } else {
                linepiont[1] = Number((Number(linepiont[1]) + distance).toFixed(2));
                if (linepiont[0] == location[26].site[0] && linepiont[1] >= location[26].site[1]) {
                    linepiont[0] = location[26].site[0];
                    linepiont[1] = location[26].site[1];
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：崴格诗温泉');
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == routeSite[0][0] && linepiont[1] == routeSite[0][1]) {
                    linepiont[0] = routeSite[0][0];
                    linepiont[1] = routeSite[0][1];
                    console.log('到达交叉点，路口0-五指山景区 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    if (driving == 1) {//往游船码头方向
                        direction = ['down', 'null'];
                    } else if (driving == 2) {//往广承轩酒店方向
                        direction = ['up', 'null'];
                    }
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[1][0] && linepiont[1] == routeSite[1][1]) {
                    linepiont[0] = routeSite[1][0];
                    linepiont[1] = routeSite[1][1];
                    console.log('到达交叉点，路口1-卡丁车 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    if (driving == 1) {//往游船码头方向
                        direction = ['down', 'null'];
                    } else if (driving == 2) {//往广承轩酒店方向
                        direction = ['up', 'null'];
                    }
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[2][0] && linepiont[1] == routeSite[2][1]) {
                    linepiont[0] = routeSite[2][0];
                    linepiont[1] = routeSite[2][1];
                    console.log('到达交叉点，路口2-碧水园农庄 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    if (driving == 1) {//往游船码头方向
                        direction = ['down', 'null'];
                    } else if (driving == 2) {//往广承轩酒店方向
                        direction = ['up', 'null'];
                    }
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else {
                    this.stopInSite2(millisecond, distance, linepiont, direction);
                }
            }

        } else if (direction[1] == 'null') {//车辆正在主干线跑
            if (direction[0] == 'down') {
                linepiont[0] = Number((Number(linepiont[0]) + distance).toFixed(2));
                if (linepiont[0] == location[5].site[0] && linepiont[1] == location[5].site[1]) {//到达：溪头村
                    linepiont[0] = location[5].site[0];
                    linepiont[1] = location[5].site[1];
                    direction = ['null', 'left'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：溪头村')
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == location[12].site[0] && linepiont[1] == location[12].site[1]) {//到达：人文蜡像馆
                    linepiont[0] = location[12].site[0];
                    linepiont[1] = location[12].site[1];
                    direction = ['null', 'left'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：人文蜡像馆')
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == routeSite[0][0] && linepiont[1] == routeSite[0][1]) {
                    linepiont[0] = routeSite[0][0];
                    linepiont[1] = routeSite[0][1];
                    console.log('到达交叉点，路口0-五指山景区 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[1][0] && linepiont[1] == routeSite[1][1]) {
                    linepiont[0] = routeSite[1][0];
                    linepiont[1] = routeSite[1][1];
                    console.log('到达交叉点，路口1-卡丁车 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[2][0] && linepiont[1] == routeSite[2][1]) {
                    linepiont[0] = routeSite[2][0];
                    linepiont[1] = routeSite[2][1];
                    console.log('到达交叉点，路口2-碧水园农庄 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[3][0] && linepiont[1] == routeSite[3][1]) {
                    linepiont[0] = routeSite[3][0];
                    linepiont[1] = routeSite[3][1];
                    console.log('到达交叉点，路口3-耕山小寨 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'left'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == location[27].site[0] && linepiont[1] == location[27].site[1]) {
                    var tenMin = this.data.stationTime;//10分钟倒计时 10min=600000ms 
                    linepiont[0] = location[27].site[0];
                    linepiont[1] = location[27].site[1];
                    console.log('到达终点站：游船码头，停车10分钟后返程==============', util.formatTime(new Date()).split(' ')[1])
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['up', 'null'];
                    this.setData({ lineDirection: direction, lineDriving: 2 });
                    // 终点站停车10分钟后启动
                    clearTimeout(this.data.lineTimeout);//清除10分钟倒计时
                    this.data.lineTimeout = setTimeout(function () {
                        clearTimeout(that.data.lineTimeout);//清除10分钟倒计时
                        console.log('返程启动==============', (new Date()).getSeconds());
                        that.data.lineInterval = setInterval(function () {
                            that.intervalFun2(millisecond, distance);
                        }, millisecond);
                        that.setData({ lineInterval: that.data.lineInterval });
                    }, tenMin);
                    this.setData({ lineTimeout: this.data.lineTimeout });

                } else {//未到终点站
                    this.stopInSite2(millisecond, distance, linepiont, direction);
                }
            } else {
                linepiont[0] = Number((Number(linepiont[0]) - distance).toFixed(2));
                if (linepiont[0] == location[7].site[0] && linepiont[1] == location[7].site[1]) {
                    linepiont[0] = location[7].site[0];
                    linepiont[1] = location[7].site[1];
                    direction = ['down', 'null'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：胜象竹海')
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == location[17].site[0] && linepiont[1] == location[17].site[1]) {
                    linepiont[0] = location[17].site[0];
                    linepiont[1] = location[17].site[1];
                    direction = ['down', 'null'];
                    this.setData({ lineDirection: direction });
                    console.log('到达：影古驿站')
                    this.stopHandle(millisecond, distance);//到站停车

                } else if (linepiont[0] == routeSite[3][0] && linepiont[1] == routeSite[3][1]) {
                    linepiont[0] = routeSite[3][0];
                    linepiont[1] = routeSite[3][1];
                    console.log('到达交叉点，路口3-耕山小寨 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'left'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[2][0] && linepiont[1] == routeSite[2][1]) {
                    linepiont[0] = routeSite[2][0];
                    linepiont[1] = routeSite[2][1];
                    console.log('到达交叉点，路口2-碧水园农庄 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[1][0] && linepiont[1] == routeSite[1][1]) {
                    linepiont[0] = routeSite[1][0];
                    linepiont[1] = routeSite[1][1];
                    console.log('到达交叉点，路口1-卡丁车 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == routeSite[0][0] && linepiont[1] == routeSite[0][1]) {
                    linepiont[0] = routeSite[0][0];
                    linepiont[1] = routeSite[0][1];
                    console.log('到达交叉点，路口0-五指山景区 ===========================');
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['null', 'right'];
                    this.setData({ lineDirection: direction });
                    this.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    this.setData({ lineInterval: this.data.lineInterval });

                } else if (linepiont[0] == location[0].site[0] && linepiont[1] == location[0].site[1]) {
                    var tenMin = this.data.stationTime;//10分钟倒计时 10min=600000ms 
                    linepiont[0] = location[0].site[0];
                    linepiont[1] = location[0].site[1];
                    console.log('到达终点站：广承轩酒店，停车10分钟后返程==============', (new Date()).getSeconds())
                    clearInterval(this.data.lineInterval);//清除行车定时器
                    direction = ['down', 'null'];
                    this.setData({ lineDirection: direction, lineDriving: 1 });
                    // 终点站停车10分钟后启动
                    clearTimeout(this.data.lineTimeout);//清除10分钟倒计时
                    this.data.lineTimeout = setTimeout(function () {
                        clearTimeout(that.data.lineTimeout);//清除10分钟倒计时
                        console.log('返程启动==============', (new Date()).getSeconds());
                        that.data.lineInterval = setInterval(function () {
                            that.intervalFun2(millisecond, distance);
                        }, millisecond);
                        that.setData({ lineInterval: that.data.lineInterval });
                    }, tenMin);
                    this.setData({ lineTimeout: this.data.lineTimeout });

                } else {
                    this.stopInSite2(millisecond, distance, linepiont, direction);
                }
            }
        }
        console.log('全程线-车行位置:', linepiont, direction);
        this.setData({ lineCoordinate: linepiont });
    },

    // ******** 站点停车处理 1 ********
    stopInSite2: function (millisecond, distance, linepiont, direction) {
        var that = this;
        var sixtyS = this.data.siteTime;//60s停车倒计时 60s=60000ms
        location.map(function (item, index, self) {
            if (Number(item.site[0]) == Number(linepiont[0]) && Number(item.site[1]) == Number(linepiont[1])) {
                console.log('到站点了，停车1分钟==============', (new Date()).getSeconds())
                clearInterval(that.data.lineInterval);//清除行车定时器
                //开启停车倒计时60s
                clearTimeout(that.data.lineStationOut);//清除停车倒计时
                that.data.lineStationOut = setTimeout(function () {
                    clearTimeout(that.data.lineStationOut);//清除停车倒计时
                    console.log('**************停车1分钟后继续行车**************', (new Date()).getSeconds())
                    that.data.lineInterval = setInterval(function () {
                        that.intervalFun2(millisecond, distance);
                    }, millisecond);
                    that.setData({ lineInterval: that.data.lineInterval });
                }, sixtyS);
                that.setData({ lineStationOut: that.data.lineStationOut });
            } else {
                // console.log('----------------主干线站点：循环----------------')
            }
        });
    },

    // ******** 站点停车处理 2 ********
    stopHandle: function (millisecond, distance) {
        var that = this;
        var sixtyS = this.data.siteTime;//60s停车倒计时 60s=60000ms
        console.log('到站点了，停车1分钟==============', (new Date()).getSeconds())
        clearInterval(that.data.lineInterval);//清除行车定时器
        //开启停车倒计时60s
        clearTimeout(that.data.lineStationOut);//清除停车倒计时
        that.data.lineStationOut = setTimeout(function () {
            clearTimeout(that.data.lineStationOut);//清除停车倒计时
            console.log('**************停车1分钟后继续行车**************', (new Date()).getSeconds())
            that.data.lineInterval = setInterval(function () {
                that.intervalFun2(millisecond, distance);
            }, millisecond);
            that.setData({ lineInterval: that.data.lineInterval });
        }, sixtyS);
        that.setData({ lineStationOut: that.data.lineStationOut });
    },

    // 去预定
    gotoOrder: function () {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../common/authorization/authorization',
            });
        } else {
            wx.navigateTo({
                url: '../gotoOrder/gotoOrder?upSite=' + this.data.myAddressName,
            });
        }
    },

    // 获取我的位置
    getMyAddress: function () {
        // 测试
        // const curLocation = '113.729446,23.70037';
        // this.getCloseSite(curLocation);
        // 正式
        var that = this;
        wx.getLocation({
            type: "gcj02",
            success: function (res) {
                const curLocation = res.longitude + ',' + res.latitude;
                that.getCloseSite(curLocation);
            },
        });
    },

    // 获取用户最近站点
    getCloseSite: function (curLocation) {
        var that = this, curSite = this.data.myAddressSite;
        util.HttpRequst(true, "ztc/product/nearestStation", 2, "", {
            "type": 1, //1：从化直通车
            "userLocation": curLocation
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.station.distance <= 500) {//距离站点500米范围内显示游客位置
                    location.map(function (item, index, self) {
                        if (res.station.station_name == item.name) {
                            curSite = item.mySite;
                        }
                    });
                    that.setData({ myAddressName: res.station.station_name, myAddressSite: curSite });
                }
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});