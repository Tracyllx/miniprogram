// pages/direct_train/takeACar/takeACar.js
const testData = [{
    'distance': 0 * 182 + (50 + 182 * 0), // prevPercent * 172(每个站点之间的距离) + 50(始发站)
    'prevStation': '游客中心', //上个站点，月牙湖、游客中心、青年山庄等
    'prevPercent': 0, //上个站点距离百分数，0~100的整数

    'nextStation': '清音桥', //下个站点，月牙湖、游客中心、青年山庄等
    'nextPercent': 100, //下个站点距离百分数，0~100的整数

    'arriveTime': 6, //预计到达时间，status=3时有值
    'direction': 1, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
    'rideState': 1, //行驶状态，1：行驶 2：停止
    'status': 0, //车辆状态，1：未发车 2：已过站 3：将到站
    'vehicleNumber': 15, //车辆编号
}, {
    'distance': 0 * 182 + (50 + 182 * 0), // prevPercent * 172(每个站点之间的距离) + 50(始发站)
    'prevStation': '月牙湖', //上个站点，月牙湖、游客中心、青年山庄等
    'prevPercent': 0, //上个站点距离百分数，0~100的整数

    'nextStation': '茶园', //下个站点，月牙湖、游客中心、青年山庄等
    'nextPercent': 100, //下个站点距离百分数，0~100的整数

    'arriveTime': 30, //预计到达时间，status=3时有值
    'direction': 2, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
    'rideState': 1, //行驶状态，1：行驶 2：停止
    'status': 3, //车辆状态，1：未发车 2：已过站 3：将到站
    'vehicleNumber': 22, //车辆编号
}, {
    'distance': 1 * 182 + (50 + 182 * 5), // prevPercent * 172(每个站点之间的距离) + 50(始发站)
    'prevStation': '清音桥', //上个站点，月牙湖、游客中心、青年山庄等
    'prevPercent': 100, //上个站点距离百分数，0~100的整数

    'nextStation': '游客中心', //下个站点，月牙湖、游客中心、青年山庄等
    'nextPercent': 0, //下个站点距离百分数，0~100的整数

    'arriveTime': 14, //预计到达时间，status=3时有值
    'direction': 2, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
    'rideState': 1, //行驶状态，1：行驶 2：停止
    'status': 0, //车辆状态，1：未发车 2：已过站 3：将到站
    'vehicleNumber': 11, //车辆编号
}, {
    'distance': 1 * 182 + (50 + 182 * 5), // prevPercent * 172(每个站点之间的距离) + 50(始发站)
    'prevStation': '月牙湖', //上个站点，月牙湖、游客中心、青年山庄等
    'prevPercent': 0, //上个站点距离百分数，0~100的整数

    'nextStation': '茶园', //下个站点，月牙湖、游客中心、青年山庄等
    'nextPercent': 100, //下个站点距离百分数，0~100的整数

    'arriveTime': 0, //预计到达时间，status=3时有值
    'direction': 1, //行驶方向，1：游客中心-->月牙湖 2：月牙湖-->游客中心
    'rideState': 2, //行驶状态，1：行驶 2：停止
    'status': 0, //车辆状态，1：未发车 2：已过站 3：将到站
    'vehicleNumber': 18, //车辆编号
}];
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     * 车辆当前位置 往月牙湖方向bottom：游客中心60 -> 清音桥234 -> 观景长廊412 -> 青年山庄582 -> 茶园754 -> 月牙湖932
     * 车辆当前位置 往游客中心方向top：月牙湖68 -> 茶园242 -> 青年山庄412 -> 观景长廊582 -> 清音桥762 -> 游客中心932
     */
    data: {
        HTTPS: util.baseUrl,
        scenicSpot2: [{ "name": "游客中心" }, { "name": "清 音 桥" }, { "name": "青年山庄" }, { "name": "观景长廊" }, { "name": "茶    园" }, { "name": "月 牙 湖" }],
        scenicSpot: [{
            "name": "月 牙 湖", "icon": "YueyaLake", "style": "height: 61rpx; margin-top: 7%;", "location": "113.79815458362778,23.70636567918769", "bottom": 956
        }, {
            "name": "茶    园", "icon": "TeaGarden", "style": "height: 59rpx; margin-top: 7%;", "location": "113.80452696531889,23.71991793205981", "bottom": 784
        }, {
            "name": "观景长廊", "icon": "LongCorridor", "style": "height: 31rpx; margin-top: 12%;", "location": "113.80142984758442,23.729999299198653", "bottom": 612
        }, {
            "name": "青年山庄", "icon": "YouthVilla", "style": "height: 33rpx; margin-top: 12%;", "location": "113.81387305351896,23.721557897471563", "bottom": 442
        }, {
            "name": "清 音 桥", "icon": "VoicelessBridge", "style": "height: 29rpx; margin-top: 12.5%;", "location": "113.81213103619923,23.72983692179767", "bottom": 264
        }, {
            "name": "游客中心", "icon": "TouristCentre", "style": "height: 43rpx; margin-top: 10%;", "location": "113.80215372474972,23.7379252065355", "bottom": 88
        }],
        
        carToYueya: [], // 车辆的位置信息，往月牙湖方向
        carToCentre: [], // 车辆的位置信息，往游客中心方向

        myCurrPosition: null, // 当前哪一个站点的圆圈被替换：5游客中心，4清音桥，3青年山庄，2观景长廊，1茶园，0月牙湖
        myBottom: null, // 我距离页面底部的bottom值：游客中心-88，264清音桥，442青年山庄，612观景长廊，784茶园，956月牙湖
        myLocation: '', // 我当前的坐标位置：游客中心

        clickCarIndexUp: null,//点击了哪辆车，往月牙湖方向的车
        clickCarIndexDown: null,//点击了哪辆车，往游客中心方向的车

        moveInterval: '',//车辆行驶的定时器
        moveDistance: 0,//车辆行驶的距离
        passedSite: 0,//已过几个站点
        averageDistance: 182,//每个站点之间的距离
        startingStation: 50,//始发站的位置
        endingStation1: 890,//终点站的位置，iPhone 7 Plus
        endingStation2: 910,//终点站的位置，iPhone 7 Plus
    },

    /**
     * 跳到旅游直通车
     */
    directTrainActive: function () {
        wx.redirectTo({
            url: '../../riding/carList/carList',
        });
    },

    /**
     * 请求接口
     */
    getData: function (myLocation) {
        var that = this;
        var scenicSpot = this.data.scenicSpot;//景点站点坐标
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "calcBusArriveTime", 1, wx.getStorageSync('sessionId'), { "userLocation": myLocation }, "GET", true, function (res) {
            if (res.code == 200) {
                if (res.userStation && res.userStation != '') {
                    scenicSpot.map(function (item, i, arr) { // 处理我的位置信息
                        const name = (item.name).replace(/\s/g, "");//去掉空格
                        if (name == res.userStation) {
                            that.setData({ myCurrPosition: i, myBottom: scenicSpot[i].bottom });
                        }
                    });
                    if (res.list) { // 处理车辆信息
                        that.getCarInfo(res.list);
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '' + res.msg,
                        });
                        that.setData({ carToYueya: [], carToCentre: [] });
                    }
                    console.log('我的位置：', that.data.myCurrPosition)
                } else {
                    console.log('我的位置为空');
                    if (res.list) { // 处理车辆信息
                        that.getCarInfo(res.list);
                    } else {
                        if (res.msg != '当前无可用车辆') {
                            wx.showModal({
                                title: '提示',
                                content: '' + res.msg,
                            });
                        }
                        that.setData({ carToYueya: [], carToCentre: [] });
                    }
                }
            } else if (res.code == 500) {
                if (res.msg == "距离站点太远") {
                    wx.showModal({
                        title: '提示',
                        content: '您当前的位置距离站点太远，无法显示！',
                    });
                    that.setData({ myCurrPosition: null, myBottom: null });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg,
                    });
                }
                console.log(res);
            } else {
                console.log(res);
            }
        });
    },

    /**
     * 处理车辆信息
     */
    getCarInfo: function (allCarInfo) {
        var that = this;
        var upList = [], downList = [];
        var openInterval = false;//是否开启定时器
        var scenicSpot = this.data.scenicSpot;//景点站点坐标
        var scenicSpot2 = this.data.scenicSpot2;//景点站点坐标
        allCarInfo.map(function (item, i, arr) {
            if (item.direction == 1) { //往月牙湖方向的车辆
                upList.push(item);
                scenicSpot2.map(function (val, x, arry) {
                    const name = (val.name).replace(/\s/g, "");//去掉空格
                    if (item.prevStation == name) {
                        item.passedSite = x;
                    }
                });
            } else if (item.direction == 2) { //往游客中心方向的车辆
                downList.push(item); 
                scenicSpot.map(function (val, x, arry) {
                    const name = (val.name).replace(/\s/g, "");//去掉空格
                    if (item.nextStation == name) {
                        item.passedSite = x;
                    }
                });
            } else {
                item.passedSite = 0;
            }
            // console.log('----------------------------------', item.vehicleNumber, '号车已过', item.passedSite + 1, '个站 -----------------------------------')
            // console.log(item)
            const currDis = that.data.startingStation + item.passedSite * that.data.averageDistance;// 始发站的距离50 + 已过站点数 * 每个站点之间的距离182
            const prevDis = item.prevPercent / 100 * that.data.averageDistance; // 距离上一站的位置
            item.distance = prevDis + currDis; // 具体位置
            // console.log(currDis, prevDis)
            // console.log(item.vehicleNumber + '号', item.distance);
            if (item.rideState == 1) { // 有行驶的车辆，开启定时器
                openInterval = true;
            }
        });
        that.setData({ carToYueya: upList, carToCentre: downList });
        if (openInterval) {
            that.carPositionMove();//处理车辆行驶
        }
    },

    /**
     * 车的位置移动，每个站点间的距离：182rpx
     * 判断哪辆车行驶，若行驶则开启定时器，rideState--> 1：行驶 2：停止
     */
    carPositionMove: function () {
        var that = this;
        var s = 0; //记录当前行驶了多久，10s后清除定时器重新更新数据
        this.data.moveInterval = setInterval(function () {
            s++;
            that.data.moveDistance = that.data.moveDistance + 1;
            that.setData({ moveDistance: that.data.moveDistance });
            // console.log(that.data.moveDistance);
            if (s == 10) {
                clearInterval(that.data.moveInterval);
                that.setData({ moveDistance: 0 });
                that.getData(that.data.myLocation); //更新数据
                // that.getCarInfo(testData);
            }
        }, 1000);
    },

    /**
     * 点击车辆出现气泡
     */
    clickCar: function (e) {
        var isType = e.currentTarget.dataset.isType;
        var index = e.currentTarget.dataset.index;
        if (isType == 'up') {//点击的是上行车辆
            if (this.data.clickCarIndexUp == index) {
                index = null;
            }
            this.setData({ clickCarIndexUp: index, clickCarIndexDown: null });

        } else if (isType == 'down') {//点击的是下行车辆
            if (this.data.clickCarIndexDown == index) {
                index = null;
            }
            this.setData({ clickCarIndexUp: null, clickCarIndexDown: index });

        } else {//点击的不是车辆
            this.setData({ clickCarIndexUp: null, clickCarIndexDown: null });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.showLoading({ title: '正在获取定位...' });
        wx.getLocation({
            type: "gcj02",
            success: function (res) {
                wx.hideLoading();
                that.getData(res.longitude + ',' + res.latitude);//获取数据
                that.setData({ myLocation: res.longitude + ',' + res.latitude });//保存经纬度
            },
            fail: function (res) {
                wx.hideLoading();
                console.log('是否可以使用icon', wx.canIUse('showToast.object.icon'));
                wx.showToast({ title: '获取定位失败！', icon: 'none' });//如果icon显示打钩，则先更新微信到最新版本
            }
        });
        // this.getCarInfo(testData);// 测试
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.data.moveInterval);//清除车辆行驶定时器
        this.setData({ moveDistance: 0 });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})