var util = require('../../../utils/util.js');
Page({
    data: {
        agent_code: '',
        chooseDateTime: '',//日期
        useDate: '',
        noMoreDate: false,//是否有更多日期
        ticketPrice: '0.00',
        totalPrice: '0.00',
        count: 1,
        detail: {},
        priceList: [],
        btnActive: true,
    },
    onLoad: function (options) {
        this.setData({
            agent_code: wx.getStorageSync("agent_code"),
            useDate: wx.getStorageSync("GGCBUY").date,
            ticketPrice: wx.getStorageSync("GGCBUY").price,
            totalPrice: wx.getStorageSync("GGCBUY").price,
            detail: wx.getStorageSync("GGCBUY"),
        });
        this.getTimeData();
        this.getUserInfo();
    },
    onShow: function () {
        if (this.data.chooseDateTime) {
            var that = this;
            var list = this.data.priceList;
            var chooseDate = this.data.chooseDateTime;
            list.map(function (item, index, self) {
                if (item.priceDate == chooseDate) {
                    that.setData({
                        useDate: item.priceDate,
                        ticketPrice: item.price,
                        totalPrice: (item.price * Number(that.data.count)).toFixed(2),
                    });
                }
            });
        }
    },

    // 加减操作
    countOptionTap: function (e) {
        var count = 0;
        var theType = e.currentTarget.dataset.theType;
        if (theType === '+') {
            count = Number(this.data.count) + 1 < 1000 ? Number(this.data.count) + 1 : 999;
        }
        if (theType === '-') {
            count = Number(this.data.count) - 1 > 0 ? Number(this.data.count) - 1 : 1;
        }
        this.setData({
            count: count,
            totalPrice: (count * Number(this.data.ticketPrice)).toFixed(2),
        });
    },

    // 数量输入框监听
    countInput: function (e) {
        var val = e.detail.value;
        val = val === '0' ? 1 : val;
        this.setData({
            count: val,
            totalPrice: (Number(val) * Number(this.data.ticketPrice)).toFixed(2),
        });
    },

    // 数量输入框失去焦点
    countBlur: function (e) {
        var val = e.detail.value;
            val = (val.length == 0 || val === '0') ? 1 : val;
            this.setData({
                count: val,
                totalPrice: (Number(val) * Number(this.data.ticketPrice)).toFixed(2),
            });
    },

    // 更多日期
    moreDateTap: function (e) {
        wx.navigateTo({
            url: '../../common/theDay/theDay?productId=' + this.data.detail.id + '&orderLimitTime=' + this.data.limitTime,
        });
    },

    // 得到日期和价格
    getTimeData: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/productPriceList", 2, "", {
            "productId": this.data.detail.id
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.list.length == 0) {

                } else {
                    that.setData({ priceList: res.list });
                }
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        })
    },

    // 去支付
    toPay: function () {
        var that = this;
        var kkParams = {
            'agent_code': wx.getStorageSync('agent_code') ? wx.getStorageSync('agent_code') : '',
            'payMoney': this.data.totalPrice,
            'ticketNum': this.data.count,
            'productId': this.data.detail.id,
            'useDate': this.data.useDate,
        }
        if (this.data.userInfo.userName && this.data.userInfo.userPhone) {
            kkParams.userId = this.data.userInfo.userId;
            kkParams.userName = this.data.userInfo.userName;
            kkParams.userPhone = this.data.userInfo.userPhone;
        }
        // console.log(kkParams);return;
        this.setData({ btnActive: false });
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/createOrder", 3, wx.getStorageSync('sessionId'), kkParams, "POST", false, function (res) {
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
    },

    // 获取用户信息
    getUserInfo: function () {
        var that = this;
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, wx.getStorageSync('sessionId'), {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({ userInfo: res.userInfo });
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
})