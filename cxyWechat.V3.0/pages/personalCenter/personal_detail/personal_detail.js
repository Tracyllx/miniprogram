var util = require('../../../utils/util.js');
function getMessage(that) {
    //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
    util.HttpRequst(true, "ztc/user/info", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
        if (res.code == 200) {
            // console.log(res);
            that.setData({
                list: res.userInfo,
                user_name: res.userInfo.user_name,//绑定联系人
                shanSignTure: res.userInfo.signature,//签名
            });

            //将签名缓存起来，方便更改签名页面获取原本的签名
            wx.setStorage({ key: 'signature', data: res.userInfo.signature });

            //将手机号码缓存起来，方便更改手机页面获取原本的手机号
            wx.setStorage({ key: 'user_phone', data: res.userInfo.user_phone });

            //将联系人缓存起来，方便更改联系人页面获取原本的联系人
            wx.setStorageSync('kkUserName', res.userInfo.user_name);

            var user_phone = res.userInfo.user_phone;
            if (user_phone == null || user_phone == "") {
                user_phone == null;
            } else {
                user_phone = user_phone.substr(0, 3) + "****" + user_phone.substr(7);
            }

            that.setData({
                user_phone: user_phone, //将手机号码中间四位数设为*
                pay_pass: res.userInfo.pay_pass, //将密码设置为*
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

const app = getApp()
Page({
    data: {
        hasUserInfo: false,
        list: {},
        pay_pass: '',//余额支付密码
        user_name: "",
        user_phone: "",
        head_url: '',
        shanSignTure: '',//得到当前的签名
    },
    //跳转到绑定手机号页面还是跳转到解绑手机号页面
    toBangding: function (e) {
        if (this.data.user_phone) {
            wx.navigateTo({
                url: '../change_phone/change_phone',
            });
        } else {
            wx.navigateTo({
                url: '../bangding_phone/bangding_phone',
            });
        }
        
    },
    //跳转到签名页面
    toQianming: function (e) {
        var isType = e.currentTarget.dataset.isType;
        wx.navigateTo({
            url: '../imageupload/imageupload?isType=' + isType,
        });
    },
    // 跳转设置密码
    gotoSetPSD: function (e) {
        var isType = e.currentTarget.dataset.isType;
        wx.navigateTo({
            url: '../setPSD/setPSD?isType=' + isType
        });
    },
    onLoad: function () {
        var that = this
        getMessage(that);
    },
    onShow: function () {

    },
})
