var util = require('../../../utils/util.js');
Page({
    data: {
        check_num: false,//是否触发发送验证码
        sendCodeTips: "发送验证码",
        s: 60,
        phoneTip: "",//手机号码错误提示
        phoneNumber: "",//手机号码
        code: ""//验证码
    },

    // 将输入的值赋值给phoneNumber
    phoneNumber: function (e) {
        var phoneNumber = e.detail.value//所输入的电话号码
        this.setData({
            phoneNumber: phoneNumber//失焦后将输入的值赋值给phoneNumber
        })

    },

    //发送验证码
    send_num: function () {

        var len = this.data.phoneNumber.length;
        console.log("长度" + len)
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
                console.log("号码格式正确");
                that.getCode()
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
        console.log("焦点状态")
        this.setData({
            phoneTip: ""
        })
    },

    //清除输入的手机号码内容
    clear: function () {
        this.setData({
            phoneNumber: ""
        })
    },
    /**
     * 得到手机号
     */
    finish: function () {
        var that = this;
        console.log(that.data.phoneNumber)
        util.HttpRequst(true, "ztc/user/bindPhone", 1, wx.getStorageSync('sessionId'), {
            "code": that.data.code,
            "userPhone": that.data.phoneNumber
        }, "GET", false, function (res) {
            console.log(res);
            if (res.code == 200) {
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];   //当前页面
                var prevPage = pages[pages.length - 2];  //上一个页面
                prevPage.setData({
                    user_phone: that.data.phoneNumber //当前选择的好友名字赋值给编辑款项中的姓名临时变量
                })
                wx.navigateBack({})
            }
        })
    },
    /**
   * 得到手机验证码
   */
    getCode: function () {
        var that = this;
        console.log(that.data.phoneNumber)
        util.HttpRequst(true, "ztc/product/sendMsgCode", 1, wx.getStorageSync('sessionId'), {
            "userPhone": that.data.phoneNumber
        }, "GET", false, function (res) {
            console.log(res)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
    },
})