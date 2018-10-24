var util = require('../../../../utils/util.js');
Page({
    data: {
        dataList: [],
        checkCount: 0,
        showMain: true, //是否显示游乐卡列表
        buttonActive: false, //绑卡按钮是否可点
    },
    onLoad: function (options) {
        var that = this;
        // const sceneKey = '662bac8a90f0a72c13de63b76ede47d5'; // 测试
        const sceneKey = decodeURIComponent(options.scene); // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene

        if (wx.getStorageSync('isNeedUserInfo') === '' || wx.getStorageSync('isNeedUserInfo') === undefined) {
            console.log('没有缓存');
            util.newLogin(function (result) {//判断授权
                wx.setStorageSync('isNeedUserInfo', result);
                if (result === true) {
                    wx.navigateTo({
                        url: '../common/authorization/authorization',
                    });
                } else {
                    that.getCardsInfo(sceneKey);
                }
            });
        } else {
            if (wx.getStorageSync('isNeedUserInfo') === true) {
                wx.navigateTo({
                    url: '../common/authorization/authorization',
                });
            } else {
                that.getCardsInfo(sceneKey);
            }
        }
    },

    // 刷卡获取内容
    getCardsInfo: function (sceneKey) {
        var that = this;
        util.HttpRequst(true, "booksystem/getKeyValue", 1, wx.getStorageSync("sessionId"), {
            'sceneKey': sceneKey
        }, "GET", false, function (res) {
            if (res.code == 200) {
                var list = res.cardsInfo;
                list.map(function (item, index, self) {
                    item.check = false
                });
                that.setData({
                    dataList: list
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

    // 选择游乐卡
    checkTap: function(e) {
        var count = this.data.checkCount;
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        if (list[index].check == true) {
            count = count - 1;
            list[index].check = false;
        } else {
            count = count + 1;
            list[index].check = true;
        }
        this.setData({
            dataList: list,
            checkCount: count,
            buttonActive: count > 0
        });
    },

    // 确认绑定
    confirmBtn: function() {
        var that = this;
        var checkList = [];
        var list = this.data.dataList;
        list.map(function (item, index, self) {
            if (item.check == true) {
                checkList.push(item);
            }
        });
        if (checkList.length > 0) {
            // console.log(checkList);return;
            util.HttpRequst(true, "booksystem/bindCards", 1, wx.getStorageSync("sessionId"), {
                'cardsInfo': JSON.stringify(checkList)
            }, "GET", false, function (res) {
                if (res.code == 200) {
                    wx.setNavigationBarTitle({
                        title: '绑卡成功'
                    });
                    that.setData({
                        buttonActive: false,
                        showMain: false
                    });
                    // 3秒后跳转到首页
                    setTimeout(function () {
                        wx.redirectTo({
                            url: '../chuanlooHome/chuanlooHome',
                        });
                    }, 2000);
                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            })
        }
    },

    // 扫码进如页面
    onLoadData: function () {
        var that = this;
        const year = '' + new Date().getFullYear();
        const month = new Date().getMonth() + 1 >= 10 ? '' + (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1);
        const days = new Date().getDate() >= 10 ? '' + new Date().getDate() : '0' + new Date().getDate();
        const randomNum = new Date().getTime();
        const list = [{
            "cardNo": "10" + Math.floor(Math.random() * 10 + 1) + year + month + days + Math.floor(Math.random() * 10 + 1) + '' + Math.floor(Math.random() * 10 + 1),
            "balance": "1200.00",
            "validityEnd": "2018-08-31",
            "validityStart": "2018-07-26",
            "check": false
        }, {
            "cardNo": "10" + Math.floor(Math.random() * 10 + 1) + year + month + days + Math.floor(Math.random() * 10 + 1) + '' + Math.floor(Math.random() * 10 + 1),
            "balance": "310.00",
            "validityEnd": "2018-08-10",
            "validityStart": "2018-07-26",
            "check": false
        }, {
            "cardNo": "10" + Math.floor(Math.random() * 10 + 1) + year + month + days + Math.floor(Math.random() * 10 + 1) + '' + Math.floor(Math.random() * 10 + 1),
            "balance": "200.00",
            "validityEnd": "2018-07-29",
            "validityStart": "2018-07-26",
            "check": false
        }, {
            "cardNo": "10" + Math.floor(Math.random() * 10 + 1) + year + month + days + Math.floor(Math.random() * 10 + 1) + '' + Math.floor(Math.random() * 10 + 1),
            "balance": "60.00",
            "validityEnd": "2018-07-30",
            "validityStart": "2018-07-26",
            "check": false
        }];
        this.setData({
            dataList: list
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})