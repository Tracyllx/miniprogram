var util = require('../../../../utils/util.js');
const thisOrgnId = util.enshiOrgnId; //恩施之旅的机构ID
Page({
    data: {
        HTTPS: util.baseUrl,
        isHome: true, //首页高亮
        isMy: false, //个人中心灰色
        // --------- 头部轮播图 ----------
        indicatorDots: true,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        defaultImg: '../../../img/cxyMallPage/defaultImg.png',
        swiperImg: [],
        // -------------------------------
        dataList: [],
        loadingTXT: '加载中~',
        showStrategy: false, //是否显示攻略模块
    },
    onLoad: function(options) {
        this.getBannerImg();
        this.getDataList();
    },

    // 预览图片
    previewImg: function(e) {
        // var imgUrl = e.currentTarget.dataset.imgUrl;
        // var imgList = e.currentTarget.dataset.imgList;
        // wx.previewImage({
        //     current: imgUrl, // 当前显示图片的http链接
        //     urls: imgList, // 需要预览的图片http链接列表
        // });
    },

    // 跳转到我的
    changePersonalActive: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            wx.redirectTo({
                url: '../../../personalCenter/personalCenter?cooperationName=ENSHI',
            });
        }
    },

    // 跳转到攻略
    gotoStrategy: function(e) {
        wx.navigateTo({
            url: '../../../direct_train/raiders/raiders?thisOrgnId=' + thisOrgnId,
        });
    },

    // 进入产品详情 product_type 1:门票 2:酒店 3:特产 4:定制旅游 5:车辆租赁 6:美食
    gotoDetail: function(e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        if (list[index].productType == 1) {
            wx.navigateTo({
                url: '../../../cxyMallPage/productDetail/productDetail?id=' + thisOrgnId + '&productTitle=tourism',
            });
        } else if (list[index].productType == 2) {
            wx.navigateTo({
                url: '../../../cxyMallPage/productDetail/productDetail?id=' + thisOrgnId + '&productTitle=eat',
            });
        } else if (list[index].productType == 3) {
            wx.navigateTo({
                url: '../../../cxyMallPage/productDetail/productDetail?id=' + thisOrgnId + '&productTitle=buy',
            });
        } else if (list[index].productType == 6) {
            wx.navigateTo({
                url: '../../../cxyMallPage/productDetail/productDetail?id=' + thisOrgnId + '&productTitle=live',
            });
        } else if (list[index].productType == 4) {
            wx.navigateTo({
                url: '../../../direct_train/tailorMade_detail/tailorMade_detail?ticketcode=' + list[index].productId
            });
        } else if (list[index].productType == 5) {
            wx.navigateTo({
                url: '../../../intelligentHomePage/intelligentHomePage?hasTab=false&tabIndex=2'
            });
        }
    },

    // 获取banner图片
    getBannerImg: function() {
        var list = [];
        var that = this;
        util.HttpRequst(true, "ztc/banner/list", 2, "", {
            "type": 5, //恩施之旅的头图
        }, "GET", false, function(res) {
            if (res.code == 200) {
                if (res.list.length > 0) {
                    res.list.map(function(item, index, self) {
                        list.push(item.photoUrl);
                    });
                    that.setData({
                        swiperImg: list
                    });
                } else {
                    that.setData({
                        swiperImg: ['../../../img/cxyMallPage/defaultImg.png']
                    });
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

    // 获取恩施之旅机构下的所有产品
    getDataList: function() {
        var that = this;
        util.HttpRequst(true, "ztc/product2/list", 2, "", {
            'orgnId': thisOrgnId
        }, "GET", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.list.length > 0) {
                    var list = res.list[0].product;
                    that.setData({
                        dataList: list,
                        showStrategy: true
                    });
                } else {
                    that.setData({
                        dataList: [],
                        showStrategy: true
                    });
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
    onShareAppMessage: function() {

    }
})