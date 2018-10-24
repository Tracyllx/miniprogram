var util = require('../../../utils/util.js');
Page({
    data: {
        isDisable: false,
        focus1: false,
        focus2: false,
        realName: '',
        idCard: '',
        errorMsg: '',
    },

    onLoad: function (options) {
        this.getAllInfo();
    },

    nameInput: function (e) {
        var val = e.detail.value;
        if (val.length != 0) {
            this.setData({ realName: val, errorMsg: '' });
        } else {
            this.setData({ focus1: true, errorMsg: '请输入您的真实姓名！' });
        }
    },

    idcardInput: function (e) {
        var val = e.detail.value;
        if (val.length == 18) {
            this.setData({ idCard: val, errorMsg: '' });
        }
    },

    idcardInputBlur: function (e) {
        var val = e.detail.value;
        // 校验身份证号
        var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (val.length == 18) {
            if (reg.test(val)) {
                this.setData({ idCard: val, errorMsg: '' });
            } else {
                this.setData({ focus2: true, errorMsg: '请输入正确的身份证号！' });
            }
        } else {
            this.setData({ focus2: true, errorMsg: '请输入正确的身份证号！' });
        }
    },

    confirm: function (e) {
        if (this.data.isDisable) {
            return;
        }
        var that = this;
        var name = this.data.realName;
        var idcard = this.data.idCard;
        if (name == '') {//信息为空，说明没有填完
            console.log('不通过！')
            return;
        }
        if (idcard == '') {
            console.log('不通过！')
            return;
        }
        // 校验身份证号
        var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (idcard.length == 18 && reg.test(idcard)) {
            // console.log(idcard.length)
        } else {
            console.log('不通过！')
            return;
        }
        console.log('通过！')
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/user/authenticate", 1, wx.getStorageSync("sessionId"), {
            "certId": idcard,
            "realName": name
        }, "GET", true, function (res) {
            if (res.code == 200) {
                wx.showToast({ title: '认证成功！', icon: 'success' });
                setTimeout(function () {
                    wx.navigateBack();
                }, 1600);
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

    getAllInfo: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/allInfo", 1, wx.getStorageSync("sessionId"), { sessionId: wx.getStorageSync("sessionId") }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var myInfo = res.userInfo;
                if (myInfo.real_name && myInfo.cert_id) {
                    var name = '*' + (res.userInfo.real_name).substr(1, (res.userInfo.real_name).length - 1);
                    var idC = (res.userInfo.cert_id).substr(0, 3) + '***********' + (res.userInfo.cert_id).substr(14, 4);
                    that.setData({
                        isDisable: true,
                        errorMsg: '您已实名认证！',
                        realName: name,
                        idCard: idC,
                    });
                }
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