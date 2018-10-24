var util = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');
Page({
    data: {
        isType: '',//进入本页面的是哪个页面
        phoneVal: '',//手机号
        phoneCode: '',//验证码
        phoneCodeTip: '发送验证码',
        old_psd: '',//旧密码
        new_psd: '',//新密码
        errrorTip: '',//错误提示
        canSendCode: true,//是否可以发送验证码
        count: 60,//倒计时60s
    },

    phoneInput: function (e) {
        var val = e.detail.value;
        var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
        if (val.length == 11) {
            if (!regs.test(val)) {
                this.setData({ errrorTip: '手机号有误，请输入正确的手机号！' });
            } else {
                this.setData({ phoneVal: val });
            }
        }
    },

    phoneBlur: function (e) {
        var val = e.detail.value;
        var tip = '';
        var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
        if (val.length == 0) {
            tip = '手机号不能为空！';
        } else if (val.length > 0 && val.length < 11) {
            tip = '手机号有误，请输入正确的手机号！';
        } else {
            if (!regs.test(val)) {
                tip = '手机号有误，请输入正确的手机号！';
            } else {
                this.setData({ phoneVal: val });
            }
        }
        this.setData({ errrorTip: tip });
    },

    clearPhoneval: function (e) {
        this.setData({ phoneVal: '', errrorTip: '' });
    },

    codeInput: function (e) {
        var val = e.detail.value;
        if (val.length == 6) {
            this.setData({ phoneCode: val });
        }
        if (val.length < 6) {
            this.setData({ PrevPhoneTip: "" });
        }
    },

    sendPhoneCode: function (e) {
        if (!this.data.canSendCode) {
            return;
        }
        var that = this;
        var phoneLen = this.data.phoneVal.toString().length;
        if (phoneLen < 11 && phoneLen > 0) {
            this.setData({ errrorTip: "手机号有误，请输入正确的手机号！" });

        } else if (phoneLen == 0) {
            this.setData({ errrorTip: "手机号不能为空！" });

        } else if (phoneLen == 11) {
            if (this.data.errrorTip == "") {
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/product/sendMsgCode", 3, wx.getStorageSync("sessionId"), { "userPhone": that.data.phoneVal }, "POST", true, function (res) {
                    if (res.code == 200) {
                        setTimeout(function () {
                            that.countDown();
                        }, 1000);//倒计时
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
        }
    },

    countDown: function () {
        var that = this;
        this.setData({
            canSendCode: false,
            phoneCodeTip: "重新发送(" + this.data.count + ")",
            count: this.data.count - 1
        });
        if (this.data.count < 0) {
            this.setData({
                canSendCode: true,
                phoneCodeTip: "发送验证码",
                count: 60
            });
            clearTimeout(function () {
                that.countDown();
            });
        } else {
            setTimeout(function () {
                that.countDown();
            }, 1000);
        }
    },

    finishTap: function (e) {
        if (this.data.isType == 'forgetPass') {
            if (this.data.newPSD && this.data.phoneVal && this.data.phoneCode) {
                this.setPSD();
            } else {
                wx.showModal({
                    title: '提示',
                    content: '请完善信息！',
                })
            }
        }
        if (this.data.isType == 'modifyPass') {
            if (this.data.oldPSD && this.data.newPSD) {
                this.modifyPSD();
            } else {
                wx.showModal({
                    title: '提示',
                    content: '请完善信息！',
                })
            }
        }
    },

    onLoad: function (options) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/info", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            if (res.code == 200) {
                if (options.isType == 'modifyPass') {
                    wx.setNavigationBarTitle({
                        title: '修改支付密码',
                    })
                }
                if (options.isType == 'forgetPass') {
                    wx.setNavigationBarTitle({
                        title: res.userInfo.pay_pass ? '重置密码' : '设置支付密码'
                    })
                }
                that.setData({
                    isType: options.isType,
                    phoneVal: res.userInfo.user_phone,
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

    onUnload: function () {
        var that = this;
        clearTimeout(function () {
            that.countDown();
        });
    },

    // 原密码
    oldPsdInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({ oldPSD: val });
        }
    },

    // 新密码
    newPsdInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({ newPSD: val });
        }
    },

    // 设置密码
    setPSD: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/user/setPayPass", 1, wx.getStorageSync("sessionId"), {
            "payPass": md5.hex_md5(that.data.newPSD),
            "userPhone": that.data.phoneVal,
            "code": that.data.phoneCode
        }, "GET", false, function (res) {
            if (res.code == 200) {
                that.showResult();
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

    // 修改密码
    modifyPSD: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/user/changePayPass", 1, wx.getStorageSync("sessionId"), {
            "oldPass": md5.hex_md5(that.data.oldPSD),
            "newPass": md5.hex_md5(that.data.newPSD),
        }, "GET", false, function (res) {
            if (res.code == 200) {
                that.showResult();
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

    showResult: function () {
        wx.showToast({
            title: '操作成功！',
            icon: 'success',
            duration: 1600
        });
        var that = this;
        setTimeout(function () {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.setData({
                //当前页面的变量赋值给上一个页面中同一个变量
                pay_pass: that.data.newPSD
            });
            wx.navigateBack();
        }, 1600);
    }
})