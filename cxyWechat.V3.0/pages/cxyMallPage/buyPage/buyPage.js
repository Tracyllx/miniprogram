var util = require('../../../utils/util.js');
Page({
    data: {
        defaultImg: '../../img/cxyMallPage/defaultImg.png',//默认图片
        bannerImgs: ['0'],//头图
        showInput: false,//是否显示输入框
        inputFocus: false,//获取焦点
        showAllBtn: false,//显示“查看全部”
        searchTxt: '请输入价格/产品名称',
        searchVal: '',//搜索值
        productList: [],//产品列表
    },
    onLoad: function (options) {
        this.getBannerImg();
        this.getDataList();
    },

    // 预览图片
    previewImg: function (e) {
        // var imgUrls = this.data.swiperImg;
        // var index = e.currentTarget.dataset.index;
        // wx.previewImage({
        //     current: imgUrls[index], // 当前显示图片的http链接
        //     urls: imgUrls, // 需要预览的图片http链接列表
        // });
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
        this.getDataList();
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
            this.getDataList();
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
        this.getDataList();
    },

    // 进入详情
    gotoDetail: function (e) {
        var index = e.currentTarget.dataset.index;
        var productId = this.data.productList[index].productId;
        wx.navigateTo({
            url: '../productDetail/productDetail?id=' + productId + '&productTitle=buy',
        })
    },

    // 获取banner图片
    getBannerImg: function () {
        var that = this;
        util.HttpRequst(true, "ztc/banner/list", 1, wx.getStorageSync("sessionId"), {
            "type": 2
        }, "GET", false, function (res) {
            if (res.code == 200) {
                that.setData({ bannerImgs: res.list });
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

    // 获取列表
    getDataList: function () {
        var that = this;
        // console.log('搜索关键字：', this.data.searchVal);
        util.HttpRequst(true, "ztc/product/buyList", 1, wx.getStorageSync("sessionId"), {
            "keyword": this.data.searchVal,
        }, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({ productList: res.list });
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