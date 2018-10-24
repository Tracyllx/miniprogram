var util = require('../../../../utils/util.js');
Page({
    data: {
        navActive: 1, //订单状态 1：预约中 2：服务中 3：已完成 4：已取消
        dataList: [], //列表
        page: 1, //当前页数
        limit: 10, //每页显示的条数
        totalPage: 0, //总页数
        totalCount: 0, //总条数
        lastLoadTime: 0, //上一次加载的时间
        loadMoreIs: false, //监控是否是下拉加载更多
    },
    onLoad: function(options) {
        this.getDataList();
    },

    // 点击导航栏
    navTap: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            navActive: index,
            page: 1,
            loadMoreIs: false,
            dataList: [],
        });
        this.getDataList();
    },

    // 获取列表数据
    getDataList: function() {
        var that = this;
        util.HttpRequst(true, "booksystem/orderInfo", 1, wx.getStorageSync("sessionId"), {
            'page': this.data.page,
            'limit': this.data.limit,
            'status': this.data.navActive
        }, "GET", false, function(res) {
            // console.log(res)
            if (res.code == 200) {
                var list = res.content.list;
                list.map(function(item, index, self) {
                    item.waiting = that.timeDef({
                        year: Number(item.orderDate.split('-')[0]),
                        month: Number(item.orderDate.split('-')[1]),
                        days: Number(item.orderDate.split('-')[2]),
                        hour: Number(item.timeRange.split('-')[0].split(':')[0]),
                        min: Number(item.timeRange.split('-')[0].split(':')[1])
                    });
                });
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
    loadMore: function(e) {
        var that = this;
        var currentTime = e.timeStamp; //得到当前加载的时间
        var lastTime = this.data.lastLoadTime; //得到上一次加载的时间
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
                loadMoreIs: true
            });
            this.getDataList();
        }
    },

    // 求一个时间距离现在的分钟数
    timeDef: function(dateTime) {
        var time1 = new Date();
        var time2 = new Date(dateTime.year, dateTime.month - 1, dateTime.days, dateTime.hour, dateTime.min);
        return parseInt((time2 - time1) / 1000 / 60); //两个时间相差的分钟数
    },

    // 取消排号
    cancelQueue: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '提示',
            cancelText: '确定',
            cancelColor: '#333',
            confirmText: '关闭',
            confirmColor: '#39b6a3',
            content: '确定要取消排号吗？',
            success: function(e) {
                if (e.confirm) {
                    console.log('用户点击了关闭')
                } else {
                    console.log('用户点击了确定')
                    that.cancelHttp(index);
                }
            }
        });
    },

    // 取消预约接口
    cancelHttp: function (index) {
        var that = this;
        var list = this.data.dataList;
        util.HttpRequst(true, "booksystem/cancelOrder", 1, wx.getStorageSync("sessionId"), {
            'orderId': list[index].orderId
        }, "GET", false, function(res) {
            if (res.code == 200) {
                list.slice(index, 1);//删除当前项
                that.setData({
                    dataList: list,
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})