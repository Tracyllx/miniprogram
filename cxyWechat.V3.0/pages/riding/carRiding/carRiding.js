// pages/riding/carRiding/carRiding.js
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lat: 23.099994,
        lng: 113.324520,
        markers: [],
        stationName: "",//得到上车站名
        orderId: "",//得到订单id
        getstatus:0,//如果为0则证明车不是因为超时进入的订单
        timer:"",//得到定时器
        locationTimer:"",//得到定时器
        scale:10
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.setData({ markers: [], orderId: options.order_id });
        this.getOnceData();//第一次加载数据
        this.getLocation();
        
        var newLocation = setInterval(that.getLocation, 600000);
        var data = setInterval(that.getData, 30000);//将数据进行定时刷新
        that.setData({ timer: data, locationTimer:newLocation});

    },
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({ lat: res.latitude, lng: res.longitude });
            }
        })
    },
    getData: function () {
        var that = this;
        util.HttpRequst(false, "ztc/car/rideInfo", 1, wx.getStorageSync("sessionId"), { "order_id": that.data.orderId }, "GET", false, function (res) {
            console.log(res)
            if (res.code == 200) {
                var location = res.result.location.split(",");
                that.setData({ stationName: res.result.upAddressName})
                var personMarker = {
                    iconPath: "../../img/direct_train/car.png", id: 0, latitude: location[1], longitude: location[0], width: 35, height: 30,
                    callout: { content: "距离接送点： " + res.result.distance + " km\n预计到达时间： " + res.result.arriveTime + " 分钟\n车牌号： " + res.result.licenseNo, color: "#ffffff", fontSize: "16", borderRadius: "15", bgColor: "#aee002", padding: "15", display: "ALWAYS" }
                };
                that.data.markers[0].callout.content = "距离接送点： " + res.result.distance + " km\n预计到达时间： " + res.result.arriveTime + " 分钟\n车牌号： " + res.result.licenseNo;
                if (res.result.upAddressName){
                    that.data.markers[1].callout.content = "上车点： " + res.result.upAddressName;
                }
                that.setData({ markers: that.data.markers });
                console.log(that.data.markers)
            }
        })
    },
    /**
     * 得到第一次加载的数据
     */
    getOnceData:function(){
        var that = this;
        util.HttpRequst(false, "ztc/car/rideInfo", 1, wx.getStorageSync("sessionId"), { "order_id": that.data.orderId }, "GET", false, function (res) {
            console.log(res)
            if (res.code == 200) {
                var location = res.result.location.split(",");
                that.setData({ stationName: res.result.upAddressName })
                var personMarker = {
                    iconPath: "../../img/direct_train/car.png", id: 0, latitude: location[1], longitude: location[0], width: 35, height: 30,
                    callout: { content: "距离接送点： " + res.result.distance + " km\n预计到达时间： " + res.result.arriveTime + " 分钟\n车牌号： " + res.result.licenseNo, color: "#ffffff", fontSize: "16", borderRadius: "15", bgColor: "#aee002", padding: "15", display: "ALWAYS" }
                };
                that.data.markers.push(personMarker);
                if (res.result.upAddressName) {
                    var  personMarkers = {
                        iconPath: "../../img/direct_train/person.png", id: 0, latitude: that.data.lat, longitude: that.data.lng, width: 25, height: 30,
                        callout: { content: "上车点： " + that.data.stationName, color: "#ffffff", fontSize: "16", borderRadius: "15", bgColor: "#aee002", padding: "15", display: "ALWAYS" }
                    };
                    that.data.markers.push(personMarkers);
                }
                that.setData({ markers: that.data.markers });
                console.log(that.data.markers)
            }else{
                var personMarkers = {
                    iconPath: "../../img/direct_train/person.png", id: 0, latitude: that.data.lat, longitude: that.data.lng, width: 25, height: 30,
                    callout: { content: "暂无车辆信息，请耐心等待发车！", color: "#ffffff", fontSize: "16", borderRadius: "15", bgColor: "#aee002", padding: "15", display: "ALWAYS" }
                }
                that.data.markers.push(personMarkers);
                that.setData({ markers: that.data.markers });
            }
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.data.timer);
        clearInterval(this.data.newLocation);
    },
})