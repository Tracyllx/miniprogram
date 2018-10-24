var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        defaultImg: '../../img/cxyMallPage/defaultImg.png',
        dataList1: [],
        dataList2: [],
    },
    onLoad: function (options) {
        this.getTourBus();
        this.getDirectTrain();
    },

    // 点击观光车、直通车、租车
    gotoUrl: function (e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../../intelligentHomePage/intelligentHomePage?hasTab=false&tabIndex=' + index,
        });
    },

    // 光观车产品
    getTourBus: function () {
        var that = this;
        var productList = [];
        util.HttpRequst(true, "ztc/product/list", 2, "", {
            "isTourBus": 1
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                res.list.map(function (item, index, self) {
                    item.product.map(function (item1, index1, self1) {
                        productList.push(item1);
                    });
                });
                that.setData({ dataList1: productList });
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

    // 直通车产品
    getDirectTrain: function () {
        var that = this;
        var productList = [];
        util.HttpRequst(true, "ztc/product/list", 2, "", {
            "isServe": 1
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                res.list.map(function (item, index, self) {
                    item.product.map(function (item1, index1, self1) {
                        productList.push(item1);
                    });
                });
                that.setData({ dataList2: productList });
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});