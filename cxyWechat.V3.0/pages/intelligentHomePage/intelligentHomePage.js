var carResult = {
    "userStation": "游客中心",
    "list": [{
        "arriveTime": 1, //预计到达时间，status=3时有值
        "direction": 2, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
        "lastLocation": "113.807984,23.728504",
        "location": "113.809984,23.732504",
        "nextPercent": 80, //下个站点距离百分数，0~100的整数
        "nextStation": "月牙湖", //下个站点
        "prevPercent": 20, //上个站点距离百分数，0~100的整数
        "prevStation": "茶园", //上个站点
        "rideState": 1, //行驶状态，1：行驶 2：停止
        "status": 2, //车辆状态，1：未发车 2：已过站 3：将到站
        "vehicleNumber": 1, //车辆编号
    }, {
        "arriveTime": 2, //预计到达时间，status=3时有值
        "direction": 1, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
        "lastLocation": "113.799362,23.72257",
        "location": "113.795362,23.71557",
        "nextPercent": 100, //下个站点距离百分数，0~100的整数
        "nextStation": "清音桥", //下个站点
        "prevPercent": 0, //上个站点距离百分数，0~100的整数
        "prevStation": "游客中心", //上个站点
        "rideState": 1, //行驶状态，1：行驶 2：停止
        "status": 3, //车辆状态，1：未发车 2：已过站 3：将到站
        "vehicleNumber": 3, //车辆编号
    }],
    "code": 200
}
var util = require('../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        defaultImg: '../img/cxyMallPage/defaultImg.png',
        carImg: util.baseUrl + 'img/direct_train/takeACar/tag_car.png',
        carImgUp: util.baseUrl + 'img/direct_train/takeACar/up_car.png',
        carImgDown: util.baseUrl + 'img/direct_train/takeACar/down_car.png',
        personImg: util.baseUrl + 'img/direct_train/takeACar/tag_person.png',
        // ------------------------------
        hasTab: true,//是否需要头部 tab
        tabIndex: 1,//0观光车、1直通车、2租车
        // ------------ 观光车 ------------------
        ggcInterval: '',//观光车的定时器：10s请求一次数据，更新车辆位置信息
        myLocation: '113.798519,23.706707',//我的实际坐标
        personPoint: '',//我在屏幕的位置
        carList: [],//车辆数组
        clickIndex: 'null',//当前点击的车辆
        // ------------ 直通车 ------------------
        ztcTimeout: '',//直通车的定时器：6分钟车辆到下一个点
        ztcDire: 'up',//车辆方向
        ztcPosi: 'ztc-car-img-1',//车辆位置：class
    },
    onLoad: function (options) {
        if (options.hasTab == 'true') {
            this.setData({ hasTab: true });
        } else if (options.hasTab == 'false') {
            var titleArr = ['观光车', '直通车', '租 车'];
            wx.setNavigationBarTitle({ title: titleArr[options.tabIndex] });
            this.setData({ hasTab: false, tabIndex: options.tabIndex });
        }
    },
    onShow: function () {
        if (this.data.tabIndex == 0) {
            var that = this; // 观光车：车辆处理
            wx.showLoading({ title: '正在获取定位...' });
            wx.getLocation({
                type: "gcj02",
                success: function (res) {
                    wx.hideLoading();
                    that.setData({ myLocation: res.longitude + ',' + res.latitude });//保存经纬度
                    that.getDataGGC(res.longitude + ',' + res.latitude);//首次进入页面获取数据
                    that.data.ggcInterval = setInterval(function () {
                        that.getDataGGC(res.longitude + ',' + res.latitude);//没10s获取一次数据
                    }, 10000);
                },
                fail: function (res) {
                    wx.hideLoading();
                    console.log('是否可以使用icon', wx.canIUse('showToast.object.icon'));
                    wx.showToast({ title: '获取定位失败！', icon: 'none' });//如果icon显示打钩，则先更新微信到最新版本
                }
            });
        } else if (this.data.tabIndex == 1) {
            this.ztcCarInfo();//直通车：车辆处理
        }
    },
    onHide: function () {
        clearInterval(this.data.ggcInterval);
        clearTimeout(this.data.ztcTimeout);
    },
    onUnload: function () {
        clearInterval(this.data.ggcInterval);
        clearTimeout(this.data.ztcTimeout);
    },

    // 导航栏点击
    tabTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ tabIndex: index });
    },

    // 光观车:购票、指引
    navItemTap: function (e) {
        var ids = e.currentTarget.dataset.id;
        if (ids == 'buy') {
            wx.navigateTo({
                url: './buyTicket/buyTicket',
            });
        } else if (ids == 'guide') {
            wx.navigateTo({
                url: './busGuide/busGuide',
            });
        }
    },

    // 直通车:我要乘车
    takeTheBus: function () {
        wx.navigateTo({
            url: './takeTheBus/takeTheBus',
        });
    },

    // 租车
    gotoCarRenting: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../common/authorization/authorization',
            });
        } else {
            var theType = e.currentTarget.dataset.theType;
            wx.navigateTo({
                url: './carRenting/carRenting?theType=' + theType
            });
        }
    },

    // 观光车：点击车辆显示信息
    clickCar: function (e) {
        var list = this.data.carList;
        var index = e.currentTarget.dataset.index;
        this.setData({ clickIndex: index });
    },

    // 观光车：请求接口
    getDataGGC: function (myLocation) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "calcBusArriveTime", 2, '', {
            "userLocation": myLocation
        }, "GET", true, function (res) {
            // var res = carResult;//测试数据
            // console.log(res);
            if (res.code == 200) {
                // 处理我的位置
                if (res.userStation && res.userStation != '') {
                    console.log('我的位置:', res.userStation);
                    if (res.userStation == '月牙湖') {
                        that.setData({ personPoint: 'top:24%;left:45%;' });
                    } else if (res.userStation == '茶园') {
                        that.setData({ personPoint: 'top:40%;left:52%;' });
                    } else if (res.userStation == '观景长廊') {
                        that.setData({ personPoint: 'top:64%;left:50%;' });
                    } else if (res.userStation == '青年山庄') {
                        that.setData({ personPoint: 'top:48%;left:15%;' });
                    } else if (res.userStation == '清音桥') {
                        that.setData({ personPoint: 'top:72%;left:19%;' });
                    } else if (res.userStation == '游客中心') {
                        that.setData({ personPoint: 'top:91%;left:52%;' });
                    }
                } else {
                    console.log('我的位置与站点太远，无法显示');
                }
                // 处理车辆信息
                that.getCarInfo(res.list || []);
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg,
                });
            } else {
                console.log(res);
            }
        });
    },

    // 观光车：处理车辆信息
    getCarInfo: function (list) {
        if (list.length > 0) {
            console.log('有车辆信息');
            list.map(function (item, index, self) {
                if (item.direction == 1) { //往月牙湖方向
                    if (item.prevStation == '游客中心') {//游客中心->清音桥：35 ~ 23 十三个踩点(分12段)
                        if (item.prevPercent == 0) {
                            item.classNum = '35';//车在游客中心
                        } else if (item.prevPercent > 0 && item.prevPercent <= 8.33) {
                            item.classNum = '34';
                        } else if (item.prevPercent > 8.33 && item.prevPercent <= 16.66) {
                            item.classNum = '33';
                        } else if (item.prevPercent > 16.66 && item.prevPercent <= 24.99) {
                            item.classNum = '32';
                        } else if (item.prevPercent > 24.99 && item.prevPercent <= 33.32) {
                            item.classNum = '31';
                        } else if (item.prevPercent > 33.32 && item.prevPercent <= 41.65) {
                            item.classNum = '30';
                        } else if (item.prevPercent > 41.65 && item.prevPercent <= 49.98) {
                            item.classNum = '29';
                        } else if (item.prevPercent > 49.98 && item.prevPercent <= 58.31) {
                            item.classNum = '28';
                        } else if (item.prevPercent > 58.31 && item.prevPercent <= 66.64) {
                            item.classNum = '27';
                        } else if (item.prevPercent > 66.64 && item.prevPercent <= 74.97) {
                            item.classNum = '26';
                        } else if (item.prevPercent > 74.97 && item.prevPercent <= 83.3) {
                            item.classNum = '25';
                        } else if (item.prevPercent > 83.3 && item.prevPercent <= 91.63) {
                            item.classNum = '24';
                        } else if (item.prevPercent > 91.63 && item.prevPercent <= 100) {
                            item.classNum = '23';//车在清音桥
                        }
                    } else if (item.prevStation == '清音桥') {//清音桥->青年山庄：23 ~ 17 七个踩点(分6段)
                        if (item.prevPercent == 0) {
                            item.classNum = '23';//车在清音桥
                        } else if (item.prevPercent > 0 && item.prevPercent <= 16.67) {
                            item.classNum = '22';
                        } else if (item.prevPercent > 16.67 && item.prevPercent <= 33.34) {
                            item.classNum = '21';
                        } else if (item.prevPercent == 50) {
                            item.classNum = '20';
                        } else if (item.prevPercent > 50 && item.prevPercent <= 66.67) {
                            item.classNum = '19';
                        } else if (item.prevPercent > 66.67 && item.prevPercent <= 83.34) {
                            item.classNum = '18';
                        } else if (item.prevPercent > 83.34 && item.prevPercent <= 100) {
                            item.classNum = '17';//车在青年山庄
                        }
                    } else if (item.prevStation == '青年山庄') {//青年山庄->观景长廊：17 ~ 10 八个踩点(分7段)
                        if (item.prevPercent == 0) {
                            item.classNum = '17';//车在青年山庄
                        } else if (item.prevPercent > 0 && item.prevPercent <= 14.29) {
                            item.classNum = '16';
                        } else if (item.prevPercent > 14.29 && item.prevPercent <= 28.58) {
                            item.classNum = '15';
                        } else if (item.prevPercent > 28.58 && item.prevPercent <= 42.87) {
                            item.classNum = '14';
                        } else if (item.prevPercent > 42.87 && item.prevPercent <= 57.16) {
                            item.classNum = '13';
                        } else if (item.prevPercent > 57.16 && item.prevPercent <= 71.45) {
                            item.classNum = '12';
                        } else if (item.prevPercent > 71.45 && item.prevPercent <= 85.74) {
                            item.classNum = '11';
                        } else if (item.prevPercent > 85.74 && item.prevPercent <= 100) {
                            item.classNum = '10';//车在观景长廊
                        }
                    } else if (item.prevStation == '观景长廊') {//观景长廊->茶园：10 ~ 4 七个踩点(分6段)
                        if (item.prevPercent == 0) {
                            item.classNum = '10';//车在观景长廊
                        } else if (item.prevPercent > 0 && item.prevPercent <= 16.67) {
                            item.classNum = '9';
                        } else if (item.prevPercent > 16.67 && item.prevPercent <= 33.34) {
                            item.classNum = '8';
                        } else if (item.prevPercent == 50) {
                            item.classNum = '7';
                        } else if (item.prevPercent > 50 && item.prevPercent <= 66.67) {
                            item.classNum = '6';
                        } else if (item.prevPercent > 66.67 && item.prevPercent <= 83.34) {
                            item.classNum = '5';
                        } else if (item.prevPercent > 83.34 && item.prevPercent <= 100) {
                            item.classNum = '4';//车在茶园
                        }
                    } else if (item.prevStation == '茶园') {//茶园->月牙湖：4 ~ 0 五个踩点(分4段)
                        if (item.prevPercent == 0) {
                            item.classNum = '4';//车在茶园
                        } else if (item.prevPercent > 0 && item.prevPercent <= 25) {
                            item.classNum = '3';
                        } else if (item.prevPercent > 25 && item.prevPercent <= 50) {
                            item.classNum = '2';
                        } else if (item.prevPercent > 50 && item.prevPercent <= 75) {
                            item.classNum = '1';
                        } else if (item.prevPercent > 75 && item.prevPercent <= 100) {
                            item.classNum = '0';//车在月牙湖
                        }
                    } else if (item.prevStation == '月牙湖') { }
                } else if (item.direction == 2) { //往游客中心方向
                    if (item.nextStation == '月牙湖') {
                        if (item.nextPercent == 0) {
                            item.classNum = '0';//车在月牙湖
                        } else if (item.nextPercent > 0 && item.nextPercent <= 25) {
                            item.classNum = '1';
                        } else if (item.nextPercent > 25 && item.nextPercent <= 50) {
                            item.classNum = '2';
                        } else if (item.nextPercent > 50 && item.nextPercent <= 75) {
                            item.classNum = '3';
                        } if (item.nextPercent > 75 && item.nextPercent <= 100) {
                            item.classNum = '4';//车在茶园
                        }
                    } else if (item.nextStation == '茶园') {
                        if (item.nextPercent == 0) {
                            item.classNum = '4';//车在茶园
                        } else if (item.nextPercent > 0 && item.nextPercent <= 16.67) {
                            item.classNum = '5';
                        } else if (item.nextPercent > 16.67 && item.nextPercent <= 33.34) {
                            item.classNum = '6';
                        } else if (item.nextPercent == 50) {
                            item.classNum = '7';
                        } else if (item.nextPercent > 50 && item.nextPercent <= 66.67) {
                            item.classNum = '8';
                        } else if (item.nextPercent > 66.67 && item.nextPercent <= 83.34) {
                            item.classNum = '9';
                        } else if (item.nextPercent > 83.34 && item.nextPercent <= 100) {
                            item.classNum = '10';//车在观景长廊
                        }
                    } else if (item.nextStation == '观景长廊') {
                        if (item.nextPercent == 0) {
                            item.classNum = '10';//车在观景长廊
                        } else if (item.nextPercent > 0 && item.nextPercent <= 14.29) {
                            item.classNum = '11';
                        } else if (item.nextPercent > 14.29 && item.nextPercent <= 28.58) {
                            item.classNum = '12';
                        } else if (item.nextPercent > 28.58 && item.nextPercent <= 42.87) {
                            item.classNum = '13';
                        } else if (item.nextPercent > 42.87 && item.nextPercent <= 57.16) {
                            item.classNum = '14';
                        } else if (item.nextPercent > 57.16 && item.nextPercent <= 71.45) {
                            item.classNum = '15';
                        } else if (item.nextPercent > 71.45 && item.nextPercent <= 85.74) {
                            item.classNum = '16';
                        } else if (item.nextPercent > 85.74 && item.nextPercent <= 100) {
                            item.classNum = '17';//车在青年山庄
                        }
                    } else if (item.nextStation == '青年山庄') {
                        if (item.nextPercent == 0) {
                            item.classNum = '17';//车在青年山庄
                        } else if (item.nextPercent > 0 && item.nextPercent <= 16.67) {
                            item.classNum = '18';
                        } else if (item.nextPercent > 16.67 && item.nextPercent <= 33.34) {
                            item.classNum = '19';
                        } else if (item.nextPercent == 50) {
                            item.classNum = '20';
                        } else if (item.nextPercent > 50 && item.nextPercent <= 66.67) {
                            item.classNum = '21';
                        } else if (item.nextPercent > 66.67 && item.nextPercent <= 83.34) {
                            item.classNum = '22';
                        } else if (item.nextPercent > 83.34 && item.nextPercent <= 100) {
                            item.classNum = '23';//车在清音桥
                        }
                    } else if (item.nextStation == '清音桥') {
                        if (item.nextPercent == 0) {
                            item.classNum = '23';//车在清音桥
                        } else if (item.nextPercent > 0 && item.nextPercent <= 8.33) {
                            item.classNum = '24';
                        } else if (item.nextPercent > 8.33 && item.nextPercent <= 16.66) {
                            item.classNum = '25';
                        } else if (item.nextPercent > 16.66 && item.nextPercent <= 24.99) {
                            item.classNum = '26';
                        } else if (item.nextPercent > 24.99 && item.nextPercent <= 33.32) {
                            item.classNum = '27';
                        } else if (item.nextPercent > 33.32 && item.nextPercent <= 41.65) {
                            item.classNum = '28';
                        } else if (item.nextPercent > 41.65 && item.nextPercent <= 49.98) {
                            item.classNum = '29';
                        } else if (item.nextPercent > 49.98 && item.nextPercent <= 58.31) {
                            item.classNum = '30';
                        } else if (item.nextPercent > 58.31 && item.nextPercent <= 66.64) {
                            item.classNum = '31';
                        } else if (item.nextPercent > 66.64 && item.nextPercent <= 74.97) {
                            item.classNum = '32';
                        } else if (item.nextPercent > 74.97 && item.nextPercent <= 83.3) {
                            item.classNum = '33';
                        } else if (item.nextPercent > 83.3 && item.nextPercent <= 91.63) {
                            item.classNum = '34';
                        } else if (item.nextPercent > 91.63 && item.nextPercent <= 100) {
                            item.classNum = '35';//车在游客中心
                        }
                    } else if (item.nextStation == '游客中心') { }
                }
            });
            this.setData({ carList: list });
        } else {
            console.log('无车辆信息');
        }
    },

    // 直通车
    ztcCarInfo: function () {
        const baseTime = 1.5;//1.5 分钟到下一个点
        var classArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];//车辆位置点
        var currMinutes = new Date().getMinutes();//获取当前分钟
        var currSeconds = new Date().getSeconds();//获取当前秒钟
        var index = 0;//classArr 的下标
        var countDown = 0;//下一个点倒计时的时间 毫秒
        if (currMinutes < 30) {//0~30分钟是去程
            index = parseInt(currMinutes / baseTime);
            this.setData({
                ztcDire: 'up',
                ztcPosi: 'ztc-car-img-' + classArr[index],
            });
        } else {//30~59分钟是返程
            index = classArr.length - 1 - (parseInt(currMinutes / baseTime) - classArr[classArr.length - 1]);
            this.setData({
                ztcDire: 'down',
                ztcPosi: 'ztc-car-img-' + classArr[index],
            });
        }
        // 计算还有 countDown 毫秒到下一个点
        if ((baseTime * 60) - (currMinutes * 60 + currSeconds) >= 0) {
            countDown = (baseTime * 60) - (currMinutes * 60 + currSeconds) * 1000;
        } else {
            countDown = ((baseTime * 60) - (currMinutes * 60 + currSeconds) % (baseTime * 60)) * 1000;
        }
        console.log('index:', index, '开启倒计时', countDown);
        ztcIntervalFun(this, index, countDown);

        function ztcIntervalFun(that, newIndex, timeNum) {
            that.data.ztcTimeout = setTimeout(function () {
                clearTimeout(that.data.ztcTimeout);
                if (that.data.ztcDire == 'up') {
                    newIndex = newIndex + 1;
                } else {
                    newIndex = newIndex - 1 > 0 ? newIndex - 1 : 0;
                }
                console.log('直通车：倒计时结束，到下一个点，newIndex', newIndex);
                if (newIndex < classArr.length - 1 && newIndex > 0) {
                    that.setData({ ztcPosi: 'ztc-car-img-' + classArr[newIndex] });
                } else {
                    if (that.data.ztcDire == 'up') {
                        that.setData({ ztcDire: 'down', ztcPosi: 'ztc-car-img-' + classArr[classArr.length - 1] });
                    } else {
                        that.setData({ ztcDire: 'up', ztcPosi: 'ztc-car-img-' + classArr[0] });
                    }
                }
                ztcIntervalFun(that, newIndex, baseTime * 60 * 1000);
            }, timeNum);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})