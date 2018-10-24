var util = require('../../../utils/util.js');
Page({
    data: {
        dataList: [1, 2, 3, 4],
        page: 1,//当前页数
        limit: 10,//每页显示的条数
        totalPage: 0,//总页数
        totalCount: 0,//总条数
        lastLoadTime: 0,//上一次加载的时间
    },
    onLoad: function (options) {
        this.getCollections();
    },

    // 删除
    deleteTap: function (e) {
        var that = this;
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        util.HttpRequst(true, "ztc/user/deleteCollect", 1, wx.getStorageSync("sessionId"), {
            'collectId': list[index].id,
        }, "GET", true, function (res) {
            console.log(res);
            if (res.code == 200) {
                list.splice(index, 1);
                that.setData({ dataList: list });
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

    // 去下单
    gotoOrder: function (e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        var theId = list[index].thisID;
        var theTitle = '';
        if (list[index].type == 1) {
            theTitle = 'eat';
        } else if (list[index].type == 2) {
            theTitle = 'live';
        } else if (list[index].type == 3) {
            theTitle = 'tourism';
        } else if (list[index].type == 4) {
            theTitle = 'buy';
        }
        wx.navigateTo({
            url: '../productDetail/productDetail?id=' + theId + '&productTitle=' + theTitle,
        });
    },

    // 获取列表
    getCollections: function () {
        var that = this;
        util.HttpRequst(true, "ztc/user/collections", 1, wx.getStorageSync("sessionId"), {
            'page': this.data.page,
            'limit': this.data.limit,
        }, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var list = res.content.list;
                if (list.length > 0 && list[0]) {
                    list.map(function (item, i, self) {
                        if (item.type == 4) {//产品
                            item.thisID = item.productId ? item.productId : '';
                            item.thisCode = item.productCode ? item.productCode : '';
                            item.thisName = item.productName ? item.productName : '';
                            item.thisImg = item.productImg ? item.productImg : '';
                            item.thisPrice = item.price ? item.price : '0.00';
                            item.thisCount = item.count ? item.count : 0;
                        } else if (item.type == 1 || item.type == 2 || item.type == 3) {//机构
                            item.thisID = item.orgnId ? item.orgnId : '';
                            item.thisCode = item.orgnCode ? item.orgnCode : '';
                            item.thisName = item.orgnName ? item.orgnName : '';
                            item.thisImg = item.orgnImg ? item.orgnImg : '';
                            item.thisPrice = item.price ? item.price : '0.00';
                            item.thisCount = item.count ? item.count : 0;
                        }
                    });
                }
                if (res.content.totalPage > 1) {
                    list = that.data.dataList.concat(list);
                }
                that.setData({
                    dataList: list,
                    totalPage: res.content.totalPage,
                    totalCount: res.content.totalCount,
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

    // 加载更多
    loadMore: function (e) {
        var that = this;
        var currentTime = e.timeStamp;//得到当前加载的时间
        var lastTime = this.data.lastLoadTime;//得到上一次加载的时间
        if (currentTime - lastTime < 300) {
            console.log("时间间隔太短，不能算下拉加载");
            return;
        }
        var newPage = this.data.page + 1;
        console.log('当前页：', newPage);
        if (that.data.totalPage >= newPage) {
            this.setData({
                page: newPage,
                lastLoadTime: currentTime,
            });
            this.getCollections();
        }
    },
})