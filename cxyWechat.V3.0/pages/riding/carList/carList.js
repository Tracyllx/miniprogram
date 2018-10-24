// pages/riding/carList/carList.js
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        HTTPS: util.baseUrl,
        list: [],
        operList: ["", "车辆轨迹", "付款", "约车", "无法约车"],
        hour: null,//得到时间
        Minutes: null,//得到分钟
        clickOr: false,//判断是否是可以点的
        getLeday:0,//是否超过五点半，超了显示末班车，没有超显示约车
    },

    /**
     * 跳到观光车
     */
    sightseeingBusActive: function () {
        wx.redirectTo({
            url: '../../direct_train/takeACar/takeACar',
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 得到相应的信息
     */
    getData: function () {
        var that = this;
        var NewTime = this.getNewData();
        // console.log(NewTime)
        util.HttpRequst(true, "ztc/order/ongoingList", 1, wx.getStorageSync("sessionId"), {}, "GET", false, function (res) {
            // console.log(res);
            that.setData({ list: res.list });
            if (that.data.list) {
                that.data.list.map(function (item, index) {  
                    var limitTime = item.limit_time.split(":");
                    if (NewTime == item.order_date && (that.data.hour > Number(limitTime[0]) || that.data.hour == Number(limitTime[0]) && that.data.Minutes > Number(limitTime[1]))){
                        that.setData({ getLeday:1})
                    }
                    // console.log(index, 'getLeday', that.data.getLeday, 'isLate', item.isLate)
                    if (item.operate_type == 3 && NewTime == item.order_date) {
                        if (that.data.hour > Number(limitTime[0]) || that.data.hour == Number(limitTime[0]) && that.data.Minutes > Number(limitTime[1])) {
                            item.operateName = that.data.operList[4];
                            item.shanStatus = 4;
                            console.log("我已经超时了")
                        } else {
                            item.operateName = that.data.operList[item.operate_type];
                            item.shanStatus = item.operate_type
                        }
                    } else {
                        item.operateName = that.data.operList[item.operate_type];
                        item.shanStatus = item.operate_type
                    }
                });
                that.setData({ list: that.data.list });
                // console.log(that.data.list)
            }
        })
    },
    getNewData: function () {
        var date = new Date();
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day;
        }
        var time = year + "-" + month + "-" + day;
        this.setData({ hour: hour, Minutes: minute });
        return time;
    },
    /**
     * 得到具体跳转到哪个页面
     */
    getRouter: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var status = this.data.list[index].shanStatus;
        // console.log(status);

        if (status == 4) {
            return;
        } else if (status == 1) {//车辆轨迹
            wx.setStorageSync("orderStatus", 2);
            var pages = getCurrentPages();
            wx.navigateTo({
                url: '../carRiding/carRiding?order_id=' + this.data.list[index].order_id,
            })
        } else if (status == 2) {//付款
            wx.setStorageSync("orderStatus", 1)
            wx.navigateTo({
                url: '../../direct_train/orderDetail/orderDetail?orderId=' + that.data.list[index].order_id + '&orderTime=' + that.data.list[index].create_time,
            })
        } else {//约车
            wx.setStorageSync("orderStatus", 2)
            that.setData({ clickOr: true });
            wx.navigateTo({
                url: '../../direct_train/orderDetail/orderDetail?orderId=' + that.data.list[index].order_id + '&orderTime=' + that.data.list[index].create_time +"&scrollHeight=384.2",
            }) 
        }


    },
    /**
     * 得到订单详情
     */
    getOrderDetail: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (that.data.list[index].operate_type == 2){
            wx.setStorageSync("orderStatus", 1)
        }else{
            wx.setStorageSync("orderStatus", 2)
        }
        if (that.data.clickOr) {
            return;
        } else {
            wx.navigateTo({
                url: '../../direct_train/orderDetail/orderDetail?orderId=' + that.data.list[index].order_id + '&orderTime=' + that.data.list[index].create_time,
            })
        }
    },
    onShow: function () {
        this.getData();
        this.setData({ clickOr: false });
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({ clickOr: false });
    },
})