var util = require('../../../utils/util.js');
Page({
    data: {
        orderId: '',//订单id
        orderImg: '',//产品图片
        orderName: '',//产品名称
        orderCount: '',//购买数量
        orderTotal: '0.00',//订单总价
        message: '',
        disabled: false,
        tipText: '',
    },
    onLoad: function (options) {
        this.setData({
            orderId: wx.getStorageSync('REFUNDINFO').orderId,
            orderImg: wx.getStorageSync('REFUNDINFO').orderImg,
            orderName: wx.getStorageSync('REFUNDINFO').orderName,
            orderCount: wx.getStorageSync('REFUNDINFO').orderCount,
            orderTotal: wx.getStorageSync('REFUNDINFO').orderTotal,
        });
    },

    bindinput: function (e) {
        var val = e.detail.value;
        this.setData({
            message: val,
        });
        if (val.length > 0) {
            this.setData({
                disabled: false,
                tipText: ''
            });
        }
    },

    submitTap: function (e) {
        if (this.data.message == '') {
            this.setData({
                disabled: true,
                tipText: '退款原因不能为空！'
            });
        } else {
            var that = this;
            this.setData({ disabled: true });
            util.HttpRequst(false, "ztc/order/refundTicket", 1, wx.getStorageSync("sessionId"), {
                "orderId": this.data.orderId,
                "refundCause": this.data.message
            }, "GET", false, function (res) {
                console.log(res);
                if (res.code == 200) {
                    wx.showToast({ title: '申请退款成功', mask: true });
                    setTimeout(function () {
                        wx.navigateBack(); // 返回上一页
                        wx.setStorageSync('REFUNDSUCCESSID', that.data.orderId);
                    }, 1500);
                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            });
        }
    },
})