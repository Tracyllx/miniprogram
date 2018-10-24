var util = require('../../../utils/util.js');
Page({
    data: {
        showStep1: true,
        myWallet: 0,
        inputVal: '',
        focus: true,
        btnDisabled: false,//是否激活提现按钮
    },
    onLoad: function (options) {
        this.setData({ myWallet: options.myWallet });
    },

    bindInput: function (e) {
        var val = e.detail.value;
        // if (val.indexOf('.') == 0) {
        //     val = '0.'; // 小数点在第一位时，强制改为 0.；如：输入 .2，则结果显示 0.2
        // }
        // if ((val.slice(val.indexOf('.') + 1)).indexOf('.') >= 0) {
        //     val = val.slice(0, val.length - 1); // 有且仅有一个小数点；如：输入 2.3.，则结果显示 2.3
        // }
        // if (val.indexOf('.') > 0 && val.slice(val.indexOf('.') + 1).length > 2) {
        //     val = val.slice(0, val.indexOf('.') + 3); // 存在小数点时，保留小数点后两位
        // }
        if (val.indexOf('0') == 0) {
            val = ''; // 第一位数不能为 0 
        }
        this.setData({ inputVal: val });
    },

    getAll: function () {
        var num = this.data.myWallet;
        if (num.indexOf('.') > 0) {
            num = num.split('.')[0];
        }
        this.setData({ inputVal: num });
    },

    btnTap: function () {
        if (this.data.inputVal > 0 && this.data.btnDisabled == false) {
            var that = this;
            this.setData({ btnDisabled: true });
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/wallet/withdraw", 1, wx.getStorageSync("sessionId"), {
                "withdrawMoney": this.data.inputVal
            }, "GET", false, function (res) {
                if (res.code == 200) {
                    wx.setNavigationBarTitle({ title: '余额提现' });
                    that.setData({ showStep1: false });
                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            });
        } else {
            this.setData({ focus: true });
        }
    },

    finishTap: function () {
        wx.navigateBack();
    },
})