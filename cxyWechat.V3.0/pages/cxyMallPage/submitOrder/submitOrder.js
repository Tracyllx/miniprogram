var util = require('../../../utils/util.js');
Page({
    data: {
        userInfo: '',//当前用户信息
        todayDate: '',//当前日期
        currentID: '',//产品id
        productInfo: '',//已选择的产品详情
        addressInfo: '',//选择收货地址返回的信息
        leavingMsg: '',//留言
        msgLength: 0,//留言长度
        postage: 0,//邮费
        orderTotal: '0.00',//订单合计
        btnActive: false,//提交订单按钮是否激活
    },
    onLoad: function (options) {
        this.setData({
            currentID: options.id,
            productInfo: wx.getStorageSync('SUBMITORDER'),
        });
        this.getNowDate();
        this.getUserInfo();
    },

    // 获取当前日期：2018-05-18
    getNowDate: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var strings = year.toString() + "-" + month + "-" + day
        this.setData({ todayDate: strings });
    },

    // 添加收货地址
    addAddress: function (e) {
        var that = this;
        wx.chooseAddress({
            success: function (res) {
                that.setData({ addressInfo: res });
                that.getCalcPostage();//计算邮费
            }
        });
    },

    // 留言
    textareaInput: function (e) {
        var val = e.detail.value;
        this.setData({
            leavingMsg: val,
            msgLength: val.length,
        });
    },

    // 提交订单
    submitBtn: function (e) {
        if (this.data.btnActive) {
            var that = this;
            var kkParams = {
                'agent_code': wx.getStorageSync('agent_code') ? wx.getStorageSync('agent_code') : '',
                'deliveryAddr': this.data.addressInfo.provinceName + this.data.addressInfo.cityName + this.data.addressInfo.countyName + this.data.addressInfo.detailInfo,
                'zipCode': this.data.addressInfo.postalCode,
                'deliveryName': this.data.addressInfo.userName,
                'deliveryPhone': this.data.addressInfo.telNumber,
                'province': this.data.addressInfo.provinceName,
                'specName': this.data.productInfo.productSpec,
                'payMoney': (Number(this.data.productInfo.productTotal) + Number(this.data.postage)).toFixed(2),
                'ticketNum': this.data.productInfo.productCount,
                'productId': this.data.currentID,
                'useDate': this.data.todayDate,
                'leaveMessage': this.data.leavingMsg,
            };
            if (this.data.userInfo.userName && this.data.userInfo.userPhone) {
                kkParams.userId = this.data.userInfo.userId;
                kkParams.userName = this.data.userInfo.userName;
                kkParams.userPhone = this.data.userInfo.userPhone;
            }
            // console.log(kkParams);
            this.setData({ btnActive: false });//提交按钮变灰
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
        }
    },

    // 计算邮费接口
    getCalcPostage: function () {
        var that = this;
        var total = this.data.productInfo.productTotal;
        var kkParams = {
            'productId': this.data.currentID,
            'province': this.data.addressInfo.provinceName,
            'specName': this.data.productInfo.productSpec,
            'buyNum': this.data.productInfo.productCount,
        }
        // console.log(kkParams);
        util.HttpRequst(false, "ztc/product/calcPostage", 1, wx.getStorageSync('sessionId'), kkParams, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({
                    postage: res.postage,
                    orderTotal: (Number(res.postage) + Number(total)).toFixed(2),
                    btnActive: true,
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