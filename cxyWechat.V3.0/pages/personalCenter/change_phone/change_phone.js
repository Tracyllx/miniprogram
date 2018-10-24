var util = require('../../../utils/util.js');
function getMessage(that) {
    //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
    util.HttpRequst(true, "ztc/user/bindPhone", 1, wx.getStorageSync("sessionId"), {
        "code": that.data.code,
        "userPhone": that.data.phoneNumber
    }, "GET", false, function (res) {
        console.log(res)
    })
}

function getCode(that) {
    //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
    util.HttpRequst(true, "ztc/product/sendMsgCode", 1, wx.getStorageSync("sessionId"), {
        "userPhone": that.data.phoneNumber
    }, "GET", false, function (res) {
        console.log(res)
    })
}

const app = getApp()

Page({
    data: {
        prevPhone: "",//得到之前的手机号
        check_num: false,//是否触发发送验证码
        sendCodeTips: "发送验证码",
        s: 60,
        phoneTip: "",//手机号码错误提示
        user_phone: "",//手机号码
        PrevPhoneTip: "",//得到绑定过手机号的提示
        code: ""//验证码
    },

    // 将输入的值赋值给phoneNumber
    phoneNumbers: function (e) {
        var phoneNumber = e.detail.value//所输入的电话号码
        console.log(phoneNumber)
        this.setData({
            phoneNumber: phoneNumber//失焦后将输入的值赋值给phoneNumber
        })
        if (phoneNumber.length == 11 && this.data.prevPhone == phoneNumber) {
            this.setData({
                PrevPhoneTip: "手机号已绑定，无需二次绑定！"
            })
        }
    },

    //发送验证码
    send_num: function () {
        if (!this.data.phoneNumber && this.data.user_phone) {
            this.setData({
                PrevPhoneTip: "手机号已绑定，无需二次绑定！"
            });
            return;
        }
        var len = this.data.phoneNumber.length;
        if (len == 0) {
            this.setData({
                phoneTip: "手机号不能为空"
            })
        } else if (len < 11 && len > 0) {
            this.setData({
                phoneTip: "手机号有误，请输入正确的手机号！"
            })
        } else {
            this.setData({
                phoneTip: ""
            })
            var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
            var phone = this.data.phoneNumber;
            var that = this
            if (!(regs.test(phone))) {
                that.setData({
                    phoneTip: "手机号有误，请输入正确的手机号！"
                })
            } else {
                if (this.data.prevPhone == phone) {
                    return;
                }
                getCode(that)//获取验证码
                this.fun()
            }
        }
    },

    /**
    * 得到倒计时
    */
    fun: function () {
        this.setData({ sendCodeTips: "重新发送(" + this.data.s + ")" });
        this.data.s--;
        var that = this;
        if (this.data.s < 0) {
            this.setData({ sendCodeTips: "发送验证码" });
            this.setData({ s: 60 });
            clearTimeout(function () {
                that.fun();
            });
        } else {
            setTimeout(function () {
                that.fun();
            }, 1000);
        }
    },

    //验证码格式
    check_num: function (e) {
        var code = e.detail.value//所输入的电话号码
        this.setData({
            code: code//失焦后将输入的值赋值给phoneNumber
        })
    },

    //输入手机号码框为焦点状态时，清除错误提示内容
    jiaodian: function () {
        this.setData({
            phoneTip: ""
        })
    },

    //清除输入的手机号码内容
    clear: function () {
        this.setData({
            user_phone: ""
        })
    },

    //完成，回到个人资料页
    finish: function () {
        var that = this
        getMessage(that)
        wx.navigateBack({})
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        //获取原本绑定的手机号
        var that = this
        wx.getStorage({
            key: 'user_phone',
            success: function (res) {
                that.setData({
                    user_phone: res.data,
                    prevPhone: res.data
                })
            },
        })
    },
    onUnload: function () {
        var that = this;
        clearTimeout(function () {
            that.fun();
        });
    },
})