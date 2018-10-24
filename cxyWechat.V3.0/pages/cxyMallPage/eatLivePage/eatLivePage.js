var util = require('../../../utils/util.js');
Page({
    data: {
        pageType: '',//eat、live
        showInput: false,//是否显示输入框
        inputFocus: false,//获取焦点
        showAllBtn: false,//显示“查看全部”
        searchTxt: '请输入价格/产品名称',
        searchVal: '',//搜索值
        navActive: 1,//1热门搜索，2附近，3价格
        stars: [0, 1, 2, 3, 4],//得分数组
        isSortUp: true,//是否升序
        currLocation: '',//当前定位坐标值
        distanceArr: [],//产品的距离数组
        productList: [],//产品列表
        dataParams: {
            "keyword": '',//搜索关键字（价格或名称）
            "productType": 2,//产品类型 2：住 6：吃
            "searchType": 1,//搜索类型： 1：推荐 2：附近 3：价格
            "sordType": 1,//排序类型 1：升序 2：降序
            "userLocation": '',//用户坐标
        },
    },
    onLoad: function (options) {
        var dataParams = this.data.dataParams;
        if (options.pageType === 'eat') {
            wx.setNavigationBarTitle({ title: '美 食' });
            dataParams.productType = 6;

        } else if (options.pageType === 'live') {
            wx.setNavigationBarTitle({ title: '酒 店' });
            dataParams.productType = 2;
        }
        this.setData({
            pageType: options.pageType,
            dataParams: dataParams,
        });
        //获取定位之后更新列表距离
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({ currLocation: res.longitude + ',' + res.latitude });
                that.getDistance();//获取产品距离
            },
        });
        this.getDataList(false);//获取列表（定位没有返回之前）
    },

    // 显示输入框
    searchBoxTap: function () {
        this.setData({
            showInput: true,
            inputFocus: true,
        });
    },

    // 监听输入框
    searchInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({ searchVal: val, showAllBtn: true });
        } else {
            this.setData({ searchVal: '', showAllBtn: false });
        }
        this.getDataList(true);
    },

    // 输入框失去焦点
    searchBlur: function (e) {
        var val = e.detail.value;
        this.setData({
            showInput: false,
            inputFocus: false,
            searchVal: val,
            searchTxt: val == '' ? '请输入价格/产品名称' : val,
        });
    },

    // 输入框确定
    searchConfirm: function (e) {
        var val = e.detail.value;
        this.setData({
            showInput: false,
            inputFocus: false,
            showAllBtn: true,
            searchVal: val,
            searchTxt: val == '' ? '请输入价格/产品名称' : val,
        });
        if (val != '') {
            this.getDataList(true);
        }
    },

    // 查看全部
    showAllTap: function () {
        this.setData({
            showInput: false,
            inputFocus: false,
            showAllBtn: false,
            searchTxt: '请输入价格/产品名称',
            searchVal: '',
        });
        this.getDataList(true);
    },

    // 点击导航栏
    navTap: function (e) {
        var dataParams = this.data.dataParams;
        var index = e.currentTarget.dataset.index;
        if (index != this.data.navActive) {
            this.setData({ isSortUp: true });
        } else {
            this.setData({ isSortUp: !this.data.isSortUp });
        }
        dataParams.searchType = Number(index);
        dataParams.sordType = this.data.isSortUp ? 1 : 2;
        this.setData({
            navActive: index,
            dataParams: dataParams,
        });
        this.getDataList(true);
    },

    // 评价
    gotoComment: function (e) {
        var index = e.currentTarget.dataset.index;
        var isComment = this.data.productList[index].isComment;
        var orgnId = this.data.productList[index].orgnId;
        if (isComment == 0) {//未评价
            if (wx.getStorageSync('isNeedUserInfo') == true) {//从未授权
                wx.navigateTo({
                    url: '../../authorization/authorization',
                });
            } else {
                wx.navigateTo({
                    url: '../comment/comment?orgnId=' + orgnId,
                });
            }
        }
    },

    // 进入详情
    gotoDetail: function (e) {
        var index = e.currentTarget.dataset.index;
        var orgnId = this.data.productList[index].orgnId;
        wx.navigateTo({
            url: '../productDetail/productDetail?id=' + orgnId + '&productTitle=' + this.data.pageType,
        });
    },

    // 获取产品的距离
    getDistance: function () {
        var arrs = [];
        var that = this;
        var kkParams = this.data.dataParams;
        kkParams.userLocation = this.data.currLocation;
        // console.log(kkParams);
        util.HttpRequst(false, "ztc/product/hotelList", 1, wx.getStorageSync("sessionId"), kkParams, "GET", true, function (res) {
            if (res.code == 200 && res.list.length > 0) {
                res.list.map(function (item, i, self) {
                    if (item.distance) {
                        arrs.push((item.distance * 0.001).toFixed(2) + 'km');//距离 1m = 0.001km
                    } else {
                        arrs.push('');
                    }
                });
                that.setData({ distanceArr: arrs });
            } else {
                console.log(res);
            }
        });
    },

    // 获取数据列表
    getDataList: function (kkFlag) {
        var that = this;
        var kkParams = this.data.dataParams;
        if (kkFlag) {//kkFlag: true有关键词，false没有关键词
            var arrs = [];//用于保存距离
            kkParams.keyword = this.data.searchVal;
            kkParams.userLocation = this.data.currLocation;
        }
        // console.log(kkParams);
        util.HttpRequst(true, "ztc/product/hotelList", 1, wx.getStorageSync("sessionId"), kkParams, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var list = res.list;
                if (list.length > 0) {
                    list.map(function (item, i, self) {
                        item.score = (item.score).toFixed(1);//评分数保留一位小数
                        var scoreNum = (item.score + '').split('.');
                        if (Number(scoreNum[1]) == 0) {
                            item.starFull = Number(scoreNum[0]);//整星
                            item.starHalf = '';//半星
                            item.starNo = 5 - Number(scoreNum[0]);//空星
                        } else if (Number(scoreNum[1]) > 0 && Number(scoreNum[1]) <= 5) {
                            item.starFull = Number(scoreNum[0]);//整星
                            item.starHalf = '0.5';//半星
                            item.starNo = 4 - Number(scoreNum[0]);//空星
                        } else if (Number(scoreNum[1]) > 5) {
                            item.starFull = Number(scoreNum[0]) + 1;//整星
                            item.starHalf = '';//半星
                            item.starNo = 4 - Number(scoreNum[0]);//空星
                        }
                    });
                    that.setData({ productList: list });
                    if (kkFlag) {
                        list.map(function (item, i, self) {
                            if (item.distance) {
                                arrs.push((item.distance * 0.001).toFixed(2) + 'km');//距离 1m = 0.001km
                            } else {
                                arrs.push('');
                            }
                        });
                        that.setData({ distanceArr: arrs });
                    }
                } else {
                    that.setData({ productList: [] });
                }
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
})