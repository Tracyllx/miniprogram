var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        statusCode: 9,
        showModule: false,
        myWallet: 0,//用户余额
        baseName: '',//保存旧的用户名
        basePhone: '',//保存旧的手机号
        userName: '',//用户姓名
        userPhone: '',//用户手机号
        czAmount: '',//充值金额
        czLen: 9,//充值金额的位数
        focusIndex: '',//获取焦点的是哪个输入框
        canConform: false,//“确认”按钮是否是激活状态
        inputError: '',//输入框提示的错误信息
        orderId: '',//订单号
    },

    /**
     * 获取用户信息
     */
    getUserInfo: function () {
        var that = this, code = 0;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/getUserInfo", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            if (res.code == 200) {
                // console.log(res);
                that.setData({
                    baseName: res.userInfo.userName,
                    userName: res.userInfo.userName,
                    basePhone: res.userInfo.userPhone,
                    userPhone: res.userInfo.userPhone,
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

    /**
     * 查询余额
     */
    getMyWallet: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/wallet/balance", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            if (res.code == 200) {
                that.setData({
                    myWallet: res.result.avail_balance,
                    statusCode: 200,
                });
            } else {
                that.setData({ statusCode: (res.code + '')[0] });
                console.log(res);
            }
        });
    },

    /**
     * 绑定联系人
     */
    bindName: function () {
        if (this.data.userName == '' || this.data.userName == undefined || this.data.userName != this.data.baseName) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/bindName", 1, wx.getStorageSync("sessionId"), { userName: this.data.userName }, "GET", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },

    /**
     * 绑定电话号码
     */
    bindPhone: function () {
        if (this.data.userPhone == '' || this.data.userPhone == undefined || this.data.userPhone != this.data.basePhone) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/savePhone", 3, wx.getStorageSync("sessionId"), { userPhone: this.data.userPhone }, "POST", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },

    /**
     * 充值按钮
     */
    rechargeBtn: function (e) {
        this.setData({ showModule: !this.data.showModule });
    },

    /**
     * 获取输入框焦点
     */
    focusTap: function (e) {
        var isType = e.currentTarget.dataset.isType;
        this.setData({ focusIndex: isType });
    },

    /**
     * 监听输入框
     */
    bindInput: function (e) {
        var len = this.data.czLen;
        var val = e.detail.value;
        var isType = e.currentTarget.dataset.isType;
        if (isType == 1) {//充值金额
            if (val.indexOf('.') == 0) {
                val = '0.'; // 小数点在第一位时，强制改为 0.；如：输入 .2，则结果显示 0.2
            }
            if ((val.slice(val.indexOf('.') + 1)).indexOf('.') >= 0) {
                val = val.slice(0, val.length - 1); // 有且仅有一个小数点；如：输入 2.3.，则结果显示 2.3
            }
            if (val.indexOf('.') > 0 && val.slice(val.indexOf('.') + 1).length > 2) {
                val = val.slice(0, val.indexOf('.') + 3); // 存在小数点时，保留小数点后两位
            }
            this.setData({ czAmount: val });
        }
        if (isType == 2) {//联系人
            this.setData({ userName: val });
        }
        if (isType == 3) {//手机号
            var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
            if (regs.test(val)) {
                this.setData({ userPhone: val, inputError: '' });
            } else {
                const tip = val.length < 11 ? '' : '请输入正确的手机号！';
                this.setData({ canConform: false, inputError: tip });
            }
        }
        if (this.data.czAmount && this.data.czAmount != 0 && this.data.userName && this.data.userPhone) {
            this.setData({ canConform: true });
        } else {
            this.setData({ canConform: false });
        }
    },

    /**
     * 确认充值
     */
    conform: function (e) {
        if (this.data.canConform) {
            var that = this;
            var kkAmount = parseFloat(Number(this.data.czAmount).toFixed(2));
            var param = { 'userName': this.data.userName, 'userPhone': this.data.userPhone, 'chargeMoney': kkAmount };
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/wallet/createOrder", 1, wx.getStorageSync("sessionId"), param, "GET", true, function (res) {
                if (res.code == 200) {
                    that.setData({ orderId: res.orderId });
                    that.bindName();
                    that.bindPhone();
                    that.toPay();
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

    /**
     * 微信支付
     */
    toPay: function () {
        var that = this;
        var param = { 'orderId': this.data.orderId, 'type': 1 };// type:1 微信充值
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/wallet/toPayCharge", 1, wx.getStorageSync("sessionId"), param, "GET", true, function (res) {
            if (res.code == 200) {
                var theTimeStamp = res.content.timeStamp.toString();
                wx.requestPayment({
                    'timeStamp': theTimeStamp,
                    'nonceStr': res.content.nonceStr,
                    'package': res.content.packageValue,
                    'signType': res.content.signType,
                    'paySign': res.content.paySign,
                    'success': function (rep) {
                        that.setData({ showModule: false });
                        that.getUserInfo();
                        that.getMyWallet();
                    },
                    'fail': function (res) {
                        wx.showModal({
                            title: '提示',
                            content: '调起支付失败，请重新点击支付',
                            confirmText: "重新支付",
                            success: function (res) {
                                if (res.confirm) {
                                    that.toPay();
                                } else if (res.cancel) {
                                    console.log('用户点击取消');
                                }
                            }
                        })
                    }
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

    /**
     * 提现
     */
    withdrawals: function () {
        if (this.data.myWallet < 1) {// 小于1不能提现
            wx.showModal({
                title: '提示',
                content: '您的余额小于1元不能提现！',
            })
        } else {
            if (this.data.isValD && this.data.isValD == 'true') {//已实名
                wx.navigateTo({
                    url: '../withdrawals/withdrawals?myWallet=' + this.data.myWallet,
                });
            } else {//未实名
                wx.showModal({
                    title: '提示',
                    content: '请在“个人中心-实名认证”完成实名认证即可提现！',
                });
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ isValD: options.isValD });//是否实名认证
        this.getUserInfo();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getMyWallet();
    },
})