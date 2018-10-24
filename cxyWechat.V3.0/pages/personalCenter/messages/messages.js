var util = require("../../../utils/util.js")
Page({
    data: {
        msgType: 1,
        unreadNum: 0,//交易信息的未读数量
        unreadNum2: 0,//系统信息的未读数量
        list: [],
        page: 1,//得到当前的页数
        limit: 5,//得到当前的条数
        totalPage: 0,//总页数
        lastLoadTime: 0,//得到上一次加载的时间
        loadMoreIs: false,//监控是否是下拉加载更多
        noneData: false,//得到是否显示没有更多数据
        message_id: 0,//每一条交易信息的id
        howToLoad: false,//订单详情里是否修改了信息
    },
    /**
     * 点击获取当前的值
     */
    getMsgType: function (e) {
        this.setData({
            msgType: e.currentTarget.dataset.msgType,//得到类型
            loadMoreIs: false,//下拉加载显示
            page: 1,//页数归0
            list: [],//将数组归空
            noneData: false,//得到是否显示没有更多数据
        });
        this.getClickData();//将数据加载过来
    },
    getData: function () {
        var that = this
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/order/messageList", 1, wx.getStorageSync("sessionId"), {
            "msgType": 1,
            "limit": that.data.limit,
            "page": that.data.page
        }, "GET", false, function (res) {
            if (res.code == 200) {
                that.setData({
                    list: res.content.list,
                    totalPage: res.content.totalPage,
                    unreadNum: res.unreadNum
                })
                for (var i = 0; i < that.data.list.length; i++) {
                    if (that.data.list[i].title != '充值成功') {
                        that.data.list[i].content = that.data.list[i].content.substring(0, 32) + '...';
                    }
                }
                that.setData({ list: that.data.list })
            }
        })
        util.HttpRequst(true, "ztc/order/messageList", 1, wx.getStorageSync("sessionId"), {
            "msgType": 2,
            "limit": that.data.limit,
            "page": that.data.page
        }, "GET", false, function (res) {
            that.setData({ unreadNum2: res.unreadNum })
        })
    },
    /**
    * 点击得到数据或加载更多数据
    */
    getClickData: function () {
        var that = this;
        util.HttpRequst(true, "ztc/order/messageList", 1, wx.getStorageSync("sessionId"), {
            "msgType": that.data.msgType,
            "limit": that.data.limit,
            "page": that.data.page
        }, "GET", false, function (res) {
            if (res.code == 200) {
                var List = res.content.list;
                that.setData({ totalPage: res.content.totalPage })
                if (List.length == 0 || List.length < that.data.limit || (that.data.totalPage == that.data.page && List.length % that.data.limit == 0)) {
                    that.setData({ noneData: true });
                }
                if (that.data.loadMoreIs == false) {
                    that.setData({ list: res.content.list });
                } else {
                    that.setData({ list: that.data.list.concat(res.content.list) });
                }
                if (that.data.msgType == 1) {
                    for (var i = 0; i < that.data.list.length; i++) {
                        if (that.data.list[i].title != '充值成功') {
                            that.data.list[i].content = that.data.list[i].content.substring(0, 32) + '...';
                        }
                    }
                    that.setData({ list: that.data.list })
                }
            }
        })
    },
    /**
    * 加载更多
    */
    LoadMore: function (e) {
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
            this.getClickData();
        }
    },
    /**
     * 查看详情,显示已读和未读
     */
    getDetail: function (e) {
        var _this = this;
        var status = e.currentTarget.dataset.status;
        var index = e.currentTarget.dataset.index;
        this.setData({ message_id: e.currentTarget.dataset.id });
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/read", 1, wx.getStorageSync("sessionId"), {
            "message_id": _this.data.message_id,
        }, "GET", false, function (res) {
            if (res.code == 200) {
                if (_this.data.msgType == 1) {
                    if (_this.data.unreadNum > 0) {
                        if (status == 1) {
                            var minusNumb = _this.data.unreadNum - 1;
                            _this.data.list[index].status = "2";
                        }
                        _this.setData({ unreadNum: minusNumb });
                    } else {
                        _this.setData({ unreadNum: 0 })
                    }
                } else if (_this.data.msgType == 2) {
                    if (_this.data.unreadNum2 > 0) {
                        if (status == 1) {
                            var minusNumb = _this.data.unreadNum2 - 1;
                            _this.data.list[index].status = "2";
                        }
                    } else {
                        _this.setData({ unreadNum2: 0 })
                    }
                    _this.setData({ unreadNum2: minusNumb });
                }
                _this.setData({ list: _this.data.list });
                wx.setStorageSync("orderStatus", 2);
                if (_this.data.list[index].title == '充值成功') {
                    _this.setData({ page: 1, list: [], noneData: false })
                    if (_this.data.howToLoad == true) {
                        _this.getData();//重新获取数量及内容
                    }
                    _this.getClickData();
                } else {
                    wx.navigateTo({
                        url: '../../direct_train/orderDetail/orderDetail?orderId=' + _this.data.list[index].order_id + '&orderTime=" "',
                    });
                }
            }
        })
    },
    onLoad: function () {
        //  这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
        this.getData();
    },
    onShow: function () {
        this.setData({ page: 1, list: [], noneData: false })
        if (this.data.howToLoad == true) {
            this.getData();//重新获取数量及内容
        }
        this.getClickData();

    },
    onUnload: function () {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];//当前页面
        var prevPage = pages[pages.length - 2];//得到上一页
        var allCount = this.data.unreadNum2 + this.data.unreadNum
        prevPage.setData({
            noRead: allCount
        })
    }
})
