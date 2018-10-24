var amapFile = require('../../../../utils/amap-wx.js');
var amapFun = new amapFile.AMapWX({
    key: 'f387407e04361890eb004cafd1c4e523'
});
var markersData = [{
    id: 0,
    latitude: '23.723673',
    longitude: '113.779234',
    name: '五指山充电站',
    address: '广东省广州市从化五指山景区',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 18,
    countFree: 4
}, {
    id: 1,
    latitude: '23.645052',
    longitude: '113.7719',
    name: '石门充电站',
    address: '广东省广州市石门国家森林公园',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 13,
    countFree: 3
}, {
    id: 2,
    latitude: '23.496451',
    longitude: '113.909664',
    name: '白江湖充电站',
    address: '广东省广州市从化白江湖森林公园',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 16,
    countFree: 6
}, {
    id: 3,
    latitude: '23.688081',
    longitude: '113.708115',
    name: '卓思道充电站',
    address: '广东省广州市从化卓思道温泉',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 6,
    countFree: 5
}, {
    id: 4,
    latitude: '23.765166',
    longitude: '113.915761',
    name: '香蜜山充电站',
    address: '广东省广州市从化香蜜山果庄',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 2,
    countFree: 2
}, {
    id: 5,
    latitude: '23.69603',
    longitude: '113.648283',
    name: '耕山小寨充电站',
    address: '广东省广州市从化耕山小寨',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 4,
    countFree: 3
}, {
    id: 6,
    latitude: '23.748237',
    longitude: '113.782482',
    name: '流溪河充电站',
    address: '广东省广州市从化流溪河国家森林公园',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 8,
    countFree: 8
}, {
    id: 7,
    latitude: '23.593248',
    longitude: '113.796064',
    name: '白水寨充电站',
    address: '广东省广州市增城白水寨风景名胜景区',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 6,
    countFree: 4
}, {
    id: 8,
    latitude: '22.955254',
    longitude: '113.365179',
    name: '港信商务充电站',
    address: '广东省广州市东环路186号',
    iconPath: "../imgs/marker.png",
    height: 32,
    width: 22,
    countAll: 20,
    countFree: 10
}];
Page({
    data: {
        dataList: markersData,
        distanceList: [],
    },
    onLoad: function(options) {
        var that = this; // 获取距离
        var new_list = [];
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                const currLoc = res.longitude + ',' + res.latitude;
                markersData.map(function(item, index, self) {
                    const itemLoc = item.longitude + ',' + item.latitude;
                    that.getTwoPointDistance(currLoc, itemLoc, function(result) {
                        new_list[index] = result;
                        that.setData({
                            distanceList: new_list
                        });
                    });
                });
            },
        });
    },

    // 高德地图获取两点间距离
    getTwoPointDistance: function(currLocation, destinationLocation, callBack) {
        var that = this;
        amapFun.getDrivingRoute({
            origin: currLocation,
            destination: destinationLocation,
            success: function(data) {
                //成功回调 获取当前点位到目的地的距离，单位km
                callBack((data.paths[0].distance * 0.001).toFixed(2) + 'km');
            },
            fail: function(info) {
                //失败回调
                callBack('获取距离失败');
            }
        });
    },

    // 跳转到详情
    gotoDetail: function (e) {
        var index = e.currentTarget.dataset.index;
        var thisItem = this.data.dataList[index];
        var obj = {
            name: thisItem.name,
            desc: thisItem.address,
            countAll: thisItem.countAll,
            countFree: thisItem.countFree,
            distance: this.data.distanceList[index]
        };
        wx.setStorageSync('CHARGEDATA', obj);
        wx.navigateTo({
            url: '../chargeDetail/chargeDetail',
        });
    },

    // 查看地图（导航）
    openTheMap: function (e) {
        var index = e.currentTarget.dataset.index;
        var thisItem = this.data.dataList[index];
        wx.openLocation({
            latitude: Number(thisItem.latitude),
            longitude: Number(thisItem.longitude),
            name: thisItem.address,
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})