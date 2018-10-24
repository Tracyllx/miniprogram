var util = require('../../../utils/util.js');
Page({
    data: {
        currentID: '',
        dataInfo: '',
        concatIndex: '',//联系人下标
        concatId: '',//联系人 id
        concatName: '',//联系人名
        concatPhone: '',//联系人手机号
        ButtonActive: false,//去支付按钮是否可点击
    },
    onLoad: function (options) {
        this.setData({
            currentID: options.id,
            dataInfo: wx.getStorageSync('CONFIRMORDER'),
        });
    },
    onShow: function () {
        if (this.data.concatName && this.data.concatPhone) {
            // 存在联系人，可去支付
            this.setData({
                ButtonActive: true,
            });
        }
    },

    // 联系人
    concatNameTap: function (e) {
        wx.navigateTo({
            url: '../addConcats/addConcats?concatIndex=' + this.data.concatIndex,
        });
    },

    // 去支付
    gotoPay: function (e) {
        if (this.data.ButtonActive) {
            var that = this;
            var dataInfo = this.data.dataInfo;
            var buyDetail = [];//已选房型的列表
            dataInfo.list.map(function (item, i, self) {
                buyDetail.push({ "productId": item.id, "buyNum": item.count });
            });
            var params = {
                "userName": this.data.concatName,
                "userPhone": this.data.concatPhone,
                "payMoney": dataInfo.orderAmount,
                "startDate": dataInfo.startTime,
                "endDate": dataInfo.endTime,
                "buyDetail": buyDetail,
            }
            // console.log(params);return;
            this.setData({ ButtonActive: false });
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/product/createHotelOrder", 1, wx.getStorageSync("sessionId"), params, "GET", false, function (res) {
                // console.log(res);
                if (res.code == 200) {
                    wx.redirectTo({
                        url: '../../direct_train/payResult/payResult?orderId=' + res.orderId,
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
        }
    },
})