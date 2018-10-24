Page({
    data: {
        tabIndex: 'personal',
        navActive: 1,//1全部，2待付款，3已付款
        lastLoadTime: 0,//上一次加载的时间
        loadMoreIs: false,//监控是否是下拉加载更多
        dataList: [
            { status: '充电', time: '2018-07-25 15:00-17:00', cost: '60.00', balance: '120.00' },
            { status: '充值', time: '2018-07-25 14:00', cost: '60.00', balance: '50.00' },
            { status: '充电', time: '2018-07-25 08:00-10:00', cost: '60.00', balance: '116.00' },
            { status: '充值', time: '2018-07-25 16:00', cost: '60.00', balance: '126.00' },
            { status: '充值', time: '2018-07-25 19:00', cost: '65.00', balance: '145.00' },
            { status: '充电', time: '2018-07-25 12:00-14:00', cost: '60.00', balance: '116.00' },
        ],
        page: 1,//当前页数
        limit: 10,//每页显示的条数
        totalPage: 0,//总页数
        totalCount: 0,//总条数
    },
    onLoad: function (options) {

    },

    // 点击tabbar
    tabItemTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ tabIndex: index });
        if (index == 'chargingPile') {
            wx.redirectTo({
                url: '../chargingPileHome/chargingPileHome',
            });
        } else if (index == 'charge') {
            wx.redirectTo({
                url: '../chargeType/chargeType',
            });
        }
    },

    // 点击导航栏
    navTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            navActive: index,
            // page: 1,
            // loadMoreIs: false,
            // dataList: [],
        });
        // this.getDataList();
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
                loadMoreIs: true
            });
            // this.getDataList();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})