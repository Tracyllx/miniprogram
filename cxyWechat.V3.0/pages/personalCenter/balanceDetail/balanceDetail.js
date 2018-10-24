var util = require('../../../utils/util.js');
Page({
    data: {
        list: [],
        loadMoreIs: false,
        lastLoadTime: 0,
        page: 1,
        limit: 15,
        totalPage: 0,
        totalCount: 0,
        titleArr: ['', '充值', '后台充值', '红包', '支付订单', '退款', '提现', '提现手续费'],
    },
    onLoad: function (options) {
        this.getData();
    },

    /**
     * 获取列表
     */
    getData: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/wallet/balanceFlow", 1, wx.getStorageSync("sessionId"), { page: this.data.page, limit: this.data.limit }, "GET", true, function (res) {
            // console.log(res)
            if (res.code == 200) {
                var datas = res.content.list;
                for (var i = 0; i < datas.length; i++) {
                    datas[i].money = (datas[i].money).toFixed(2);
                }
                if (that.data.loadMoreIs == false) {
                    that.setData({
                        list: datas,
                        totalPage: res.content.totalPage,
                        totalCount: res.content.totalCount,
                    });
                } else {
                    that.setData({
                        list: that.data.list.concat(datas),
                        totalPage: res.content.totalPage,
                        totalCount: res.content.totalCount,
                    });
                }
            } else {
                console.log(res);
            }
        });
    },

    /**
     * 加载更多
     */
    loadMore: function (e) {
        var that = this;
        var currentTime = e.timeStamp;//得到当前加载的时间
        var lastTime = this.data.lastLoadTime;//得到上一次加载的时间
        if (currentTime - lastTime < 300) {
            console.log("时间间隔太短，不能算下拉加载");
            return;
        }
        var newPage = this.data.page + 1;
        if (that.data.totalPage >= newPage) {
            this.setData({
                page: newPage,
                lastLoadTime: e.timeStamp,
                loadMoreIs: true
            });
            this.getData();
        }
    },
})