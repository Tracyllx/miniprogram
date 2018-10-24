var util = require('../../../../utils/util.js');
Page({
    data: {
        detailInfo: '',//详细信息
        rowsNo: '',//第几排
        colsNo: '',//第几座
        confirmActive: true,//预约按钮是否可点击
    },
    onLoad: function (options) {
        this.setData({
            detailInfo: wx.getStorageSync('chuanlooOrder'),
            rowsNo: Math.floor(Math.random() * 15 + 1),//一共15排
            colsNo: Math.floor(Math.random() * 20 + 1),//一共20列
        });
    },
    confirmNow: function () {
        var that = this;
        this.setData({
            confirmActive: false
        });
        util.HttpRequst(true, "booksystem/book", 1, wx.getStorageSync("sessionId"), {
            'itemName': this.data.detailInfo.itemName,
            'cost': this.data.detailInfo.cost,
            'orderDate': this.data.detailInfo.orderDate,
            'timeRange': this.data.detailInfo.timeRange
        }, "GET", false, function (res) {
            // console.log(res)
            if (res.code == 200) {
                wx.redirectTo({
                    url: '../scheduleSuccess/scheduleSuccess',
                });
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
})