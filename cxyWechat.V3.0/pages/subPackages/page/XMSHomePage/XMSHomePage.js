var util = require('../../../../utils/util.js');
const thisOrgnId = util.xmsOrgnId; //香蜜庄园的机构ID
Page({
    data: {
        HTTPS: util.baseUrl,
        isHome: true,//首页高亮
        isMy: false,//个人中心灰色
        // --------- 头部轮播图 ----------
        indicatorDots: true,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        defaultImg: '../../../img/cxyMallPage/defaultImg.png',
        swiperImg: [],
        // -------------------------------
        mainBusiness: [//主营业务的路径
            // { 'title': '直通车', 'icon': 'train_car', 'url': '../directHomepage/directHomepage?isServe=1&thisOrgnId=' + thisOrgnId },
            { 'title': '门票', 'icon': 'ticket', 'url': '../directHomepage/directHomepage?isServe=2&productType=1&thisOrgnId=' + thisOrgnId },
            { 'title': '酒店', 'icon': 'hotel', 'url': '../productHomePage/productHomePage?isType=hotel&thisOrgnId=' + thisOrgnId },
            // { 'title': '定制旅游', 'icon': 'service', 'url': '../../../direct_train/tailorMade_travel/tailorMade_travel?thisOrgnId=' + thisOrgnId },
            { 'title': '美食', 'icon': 'delicacy', 'url': '../directHomepage/directHomepage?isServe=2&productType=6&thisOrgnId=' + thisOrgnId },
            { 'title': '特产', 'icon': 'specialty', 'url': '../specialHomePage/specialHomePage?thisOrgnId=' + thisOrgnId },
            // { 'title': '租车', 'icon': 'rental_car', 'url': '../../../intelligentHomePage/intelligentHomePage?hasTab=false&tabIndex=2' },
            // { 'title': '攻略', 'icon': 'raiders', 'url': '../../../direct_train/raiders/raiders?thisOrgnId=' + thisOrgnId },
        ],
    },
    onLoad: function (options) {
        this.getBannerImg();
        this.getHot();
        // this.getRaiders();
    },

    // 预览图片
    previewImg: function (e) {
        // var imgUrl = e.currentTarget.dataset.imgUrl;
        // var imgList = e.currentTarget.dataset.imgList;
        // wx.previewImage({
        //     current: imgUrl, // 当前显示图片的http链接
        //     urls: imgList, // 需要预览的图片http链接列表
        // });
    },

    // 跳转到我的
    changePersonalActive: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            wx.redirectTo({
                url: '../../../personalCenter/personalCenter?cooperationName=XMS',
            });
        }
    },

    // 获取banner图片
    getBannerImg: function () {
        var list = [];
        var that = this;
        util.HttpRequst(true, "ztc/banner/list", 2, '', {
            "type": 6,//香蜜庄园的头图
        }, "GET", false, function (res) {
            if (res.code == 200) {
                if (res.list.length > 0) {
                    res.list.map(function (item, index, self) {
                        list.push(item.photoUrl);
                    });
                    that.setData({ swiperImg: list });
                } else {
                    that.setData({ swiperImg: ['../../../img/cxyMallPage/defaultImg.png'] });
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
    getDataList: function () {
        var that = this;
        util.HttpRequst(true, "ztc/product2/list", 2, "", {
            'orgnId': thisOrgnId
        }, "GET", false, function (res) {
            console.log(res);
            if (res.code == 200) {
                var list = res.list[0].product;
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

    // 进入产品详情
    tapNavToWhere: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            var index = e.currentTarget.dataset.hotIndex;
            var list = this.data.list[index];
            // product_type  1:门票 2:酒店 3:特产 4:定制旅游 5:车辆租赁 6:美食
            if (list.productType == 2 && list.isServe == 2) {
                wx.navigateTo({
                    url: '../hotelDetail/hotelDetail?isHotel=true&orgnId=' + list.orgnId
                });
            } else {
                wx.navigateTo({
                    url: '../ticketDetail/ticketDetail?ticketcode=' + list.productId,
                });
            }
        }
    },

    // 热门推荐、攻略 - 更多
    gotoMore: function (e) {
        var pageType = e.currentTarget.dataset.pageType;
        if (pageType == 'hot') {
            wx.navigateTo({
                url: '../directHomepage/directHomepage?isMore=true&thisOrgnId=' + thisOrgnId,
            });
        }
        if (pageType == 'raider') {
            wx.navigateTo({
                url: '../../../direct_train/raiders/raiders?thisOrgnId=' + thisOrgnId,
            })
        }
    },

    // 攻略 - 详情
    gotoUrl: function (e) {
        var url = e.currentTarget.dataset.gotoUrl;
        if (url) {
            wx.navigateTo({
                url: '../../../direct_train/pageHtml/pageHtml?id=' + url,
            });
        }
    },

    // 热门推荐部分
    getHot: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/getRecommendProduct", 4, '', {
            "orgnId": thisOrgnId
        }, "POST", false, function (res) {
            // console.log('getRecommendProduct', res)
            if (res.code == 200) {
                that.setData({ list: res.list });
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

    // 查询攻略
    getRaiders: function () {
        var that = this;
        util.HttpRequst(true, "ztc/product2/homepageGuide", 2, '', {
            "limit": 2,
            "orgnId": thisOrgnId
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var data = res.result;
                data.map(function (item, i, arr) {
                    item.labelArr = item.labels.split('、');
                });
                that.setData({ raidersList: data });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})