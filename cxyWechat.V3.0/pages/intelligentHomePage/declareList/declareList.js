var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        isApply: true,// true：故障申报列表，false：故障审批列表
        noData: false,//是否有列表数据
        dataList: [],
        lastLoadTime: 0,
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPage: 0,
        // status 1：未审批 2：审批通过 3：审批未通过 4：维修 5：换件 6：自主检修
        approvalStatus: ['', '未审批', '审批通过', '审批未通过', '维修', '换件', '自主检修'],//审批状态
    },
    onLoad: function (options) {
        if (options.isApply == 'true') {
            wx.setNavigationBarTitle({
                title: '故障申报列表',
            });
            this.setData({ isApply: true });
        } else {
            wx.setNavigationBarTitle({
                title: '故障审批列表',
            });
            this.setData({ isApply: false });
        }
    },
    onShow: function () {
        this.setData({ page: 1 });
        this.getDataList();
    },

    // 进入下一步操作：只有故障审批列表中，未审批状态、审批通过状态才有下一步操作
    gotoNext: function (e) {
        if (this.data.isApply == false) {
            var list = this.data.dataList;
            var index = e.currentTarget.dataset.index;
            if (list[index].status == 1) {
                wx.navigateTo({
                    url: '../declaring/declaring?titleText=approval&faultId=' + list[index].id,
                });
            } else if (list[index].status == 2) {
                wx.navigateTo({
                    url: '../declaring/declaring?titleText=followUp&faultId=' + list[index].id,
                });
            }
        }
    },

    // 故障申报
    applyTap: function () {
        wx.navigateTo({
            url: '../declaring/declaring?titleText=apply',
        });
    },

    // 获取列表数据
    getDataList: function () {
        var that = this;
        util.HttpRequst(true, "ztc/fault/faultList", 1, wx.getStorageSync('sessionId'), {
            'page': this.data.page,
            'limit': this.data.limit
        }, "GET", true, function (res) {
            if (res.code == 200) {
                // console.log(res);
                if (res.content.list.length > 0) {
                    that.setData({
                        dataList: res.content.list,
                        totalCount: res.content.totalCount,
                        totalPage: res.content.totalPage
                    });
                } else {
                    that.setData({
                        noData: true,
                    });
                }
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg,
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
            this.getDataList();
        }
    },
})