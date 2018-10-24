var util = require('../../../../utils/util.js');
Page({
    data: {
        // -----------轮播图-----------
        swiperIndex: 0,
        swiperList: [],
        // -----------流水-----------
        dataList: [],
    },
    onLoad: function(options) {
        this.getCardsList();
    },

    // 轮播图触发
    swiperChange(e) {
        var index = e.detail.current;
        var list = this.data.swiperList;
        this.setData({
            swiperIndex: index
        });
        this.getDataList(list[index].cardNo);
    },

    // 查询游乐卡列表
    getCardsList: function () {
        var that = this;
        util.HttpRequst(true, "booksystem/getCards", 1, wx.getStorageSync("sessionId"), {}, "GET", false, function (res) {
            if (res.code == 200) {
                console.log(res)
                var list = res.list;
                list.map(function (item, index, self) {
                    item.balance = Number(item.balance).toFixed(2);
                });
                that.setData({
                    swiperList: list
                });
                if (list.length > 0) {
                    that.getDataList(list[0].cardNo);
                }
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        })
    },

    // 获取游乐卡流水
    getDataList: function (currentCardNo) {
        var that = this;
        util.HttpRequst(true, "booksystem/cardFlow", 1, wx.getStorageSync("sessionId"), {
            'cardNo': currentCardNo
        }, "GET", false, function (res) {
            if (res.code == 200) {
                var list = res.list;
                list.map(function(item, index, self) {
                    item.costTime = item.insertTime.substring(0, 4) + '-' + item.insertTime.substring(4, 6) + '-' + item.insertTime.substring(6, 8);
                    item.costTime = item.costTime + ' ' + item.insertTime.substring(8, 10) + ':' + item.insertTime.substring(10, 12) + ':' + item.insertTime.substring(12, 14);
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
        })
    },
})