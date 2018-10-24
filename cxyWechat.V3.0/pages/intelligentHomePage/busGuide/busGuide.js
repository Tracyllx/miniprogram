var util = require('../../../utils/util.js');
var amapFile = require('../../../utils/amap-wx.js');
var amapFun = new amapFile.AMapWX({ key: 'f387407e04361890eb004cafd1c4e523' });
Page({
    data: {
        HTTPS: util.baseUrl,
        siteList: [
            { 'name': '游客中心取票点', 'distance': '0km', 'location': '113.796982,23.740578', 'searchName': '广州从化五指山景区游客中心' },
            { 'name': '青年山庄取票点', 'distance': '0km', 'location': '113.808731,23.724226', 'searchName': '广州从化五指山青年山庄' }
        ]
    },
    onLoad: function (options) {
        var that = this;
        wx.getLocation({
            success: function(res) {
                var list = that.data.siteList;
                const location = res.longitude + ',' + res.latitude;
                list.map(function(item, index, self) {
                    that.getTwoPointDistance(location, item.location, index);
                })
            },
        });
    },

    // 高德地图获取两点间距离
    getTwoPointDistance: function (currLocation, destination, index) {
        var that = this;
        var list = this.data.siteList;
        amapFun.getDrivingRoute({
            origin: currLocation,
            destination: destination,
            success: function (data) {
                //成功回调 获取当前点位到目的地的距离，单位km
                list[index].distance = (data.paths[0].distance * 0.001).toFixed(2) + 'km';
                that.setData({ siteList: list });
            },
            fail: function (info) {
                //失败回调
                console.log(info)
            }
        });
    },

    // 怎么去
    howToGo: function (e) {
        var list = this.data.siteList;
        var index = e.currentTarget.dataset.index;
        var locationPoint = (list[index].location).split(',');
        var locationName = list[index].searchName;
        wx.openLocation({
            latitude: Number(locationPoint[1]),
            longitude: Number(locationPoint[0]),
            name: locationName,
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})