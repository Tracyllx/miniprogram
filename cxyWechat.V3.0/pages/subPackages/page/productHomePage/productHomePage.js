var util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classify: [ //分类列表
            { 'name': '全部分类', 'value': 0 },
            { 'name': '热门推荐', 'value': 1 },
            { 'name': '直通车', 'value': 2 },
            { 'name': '景区', 'value': 3 },
            { 'name': '酒店', 'value': 4 },
            { 'name': '美食', 'value': 5 },
        ],
        list: [],
        scrollTop: 0,
        showClassify: false,//是否显示分类下拉菜单
        classifyName: '',//类别名
        classifyval: '',//类别名的value值
        isServe: '',//服务分类：1有直通车服务，2没有直通车服务
        productType: '',//产品类型：1景区（门票），2酒店，6美食
        searchVal: '',//搜索框的值
        focusTo: false,//获取搜索框焦点
        lookAll: false,//是否显示查看全部
        thisOrgnId: '',//哪一个机构的id
    },
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        if (options.isType == 'hot') {
            wx.setNavigationBarTitle({ title: "热门推荐" });
            this.setData({ classifyName: "热门推荐", classifyval: 1, });
            this.getHot();
        } else {
            if (options.isType == 'directTrain') {
                wx.setNavigationBarTitle({ title: "直通车" });
                this.setData({ classifyName: "直通车", classifyval: 2, isServe: 1 });
            }
            if (options.isType == 'scenicSpot') {
                wx.setNavigationBarTitle({ title: "景 区" });
                this.setData({ classifyName: "景区", classifyval: 3, isServe: 2, productType: 1 });
            }
            if (options.isType == 'hotel') {
                wx.setNavigationBarTitle({ title: "酒 店" });
                this.setData({ classifyName: "酒店", classifyval: 4, isServe: 2, productType: 2 });
            }
            if (options.isType == 'delicacy') {
                wx.setNavigationBarTitle({ title: "美 食" });
                this.setData({ classifyName: "美食", classifyval: 5, isServe: 2, productType: 6 });
            }
            this.getHotelList();
        }
    },

    /**
     * 点击分类菜单
     */
    clickClassify: function (e) {
        this.setData({ showClassify: !this.data.showClassify });
    },

    /**
     * 点击产品进入详情
     */
    gotoProductDetail: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            var proID = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '../hotelDetail/hotelDetail?isHotel=true&orgnId=' + proID
            })
        }
    },

    /**
     * 搜索输入框得到焦点
     */
    getFocus: function () {
        this.setData({ focusTo: true });
    },
    
    /**
     * 搜索得到输入框的值
     */
    searchInput: function (e) {
        this.setData({ searchVal: e.detail.value });
        this.getHotelList();
    },

    /**
     * 查看全部
     */
    allList: function () {
        this.setData({ searchVal: '', scrollTop: 0 });
        this.getHotelList();
    },

    /**
     * 获取酒店列表
     */
    getHotelList: function () {
        var that = this;
        var params = { "orgnName": this.data.searchVal, "orgnId": this.data.thisOrgnId };
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/hotelList", 2, '', params, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                const flag = that.data.searchVal ? true : false;
                that.setData({ list: res.list, lookAll: flag, scrollTop: 0 });
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
})