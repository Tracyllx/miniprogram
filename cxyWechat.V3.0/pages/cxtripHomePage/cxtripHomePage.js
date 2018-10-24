var util = require('../../utils/util.js');
var amapFile = require('../../utils/amap-wx.js');
var amapFun = new amapFile.AMapWX({
    key: 'f387407e04361890eb004cafd1c4e523'
});
Page({
    data: {
        HTTPS: util.baseUrl,
        imgHome: true, //首页高亮
        imgPersonal: false, //个人中心灰色
        cooperationName: 'CXY',
        currentCity: '定位中...', //头部定位地点
        // -------------轮播图：广告栏-------------------
        indicatorDots: true,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        bannerImgs: [], //banner图片列表
    },
    onLoad: function (options) {
        this.getLocationPiont();//获取定位
        this.getBannerImg();//获取广告图
        
        util.newLogin(function (res) {//判断授权
            wx.setStorageSync('isNeedUserInfo', res);
            if (res == true) {
                wx.navigateTo({
                    url: '../common/authorization/authorization?parth=cxtripHomePage',
                });
            }
        });
    },

    // 点击城市
    gotoTraffic: function() {
        // wx.navigateTo({
        //     url: '../intelligentHomePage/intelligentHomePage?hasTab=true',
        // });
        // wx.navigateTo({
        //     // url: '../chuanloo/page/chuanlooHome/chuanlooHome',
        //     url: '../chuanloo/page/tiedCard/tiedCard',
        // })
    },

    // 定位当前位置
    getLocationPiont: function() {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                that.getAddress(res.longitude + ',' + res.latitude);
            },
        });
    },

    // 获取地址详细信息
    getAddress: function(location) {
        var that = this;
        amapFun.getRegeo({
            location: location,
            success: function(data) {
                //成功回调 获取详细地址
                var city = data[0].regeocodeData.addressComponent.city;
                that.setData({
                    currentCity: city
                });
            },
            fail: function(info) {
                //失败回调
                console.log(info)
            }
        });
    },

    // 点击搜索框
    gotoSearch: function(e) {
        wx.navigateTo({
            url: '../common/searchPage/searchPage',
            // url: '../direct_train/takeACar/takeACar',
        });
    },

    // 点击个人中心
    changePersonalActive: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../common/authorization/authorization?parth=personalCenter',
            });
        } else {
            wx.redirectTo({
                url: '../personalCenter/personalCenter',
            });
        }
    },

    // 点击业务进入详情
    gotoUrl: function(e) {
        var _url = '';
        var theType = e.currentTarget.dataset.theType;
        if (theType == 'tourism') {
            _url = '../cxyMallPage/tourismPage/tourismPage';

        } else if (theType == 'live') {
            _url = '../cxyMallPage/eatLivePage/eatLivePage?pageType=live';

        } else if (theType == 'traffic') {
            _url = '../cxyMallPage/trafficPage/trafficPage';
            // _url = '../direct_train/takeACar/takeACar';

        } else if (theType == 'buy') {
            _url = '../cxyMallPage/buyPage/buyPage';

        } else if (theType == 'eat') {
            _url = '../cxyMallPage/eatLivePage/eatLivePage?pageType=eat';

        } else if (theType == 'customMade') {
            _url = '../direct_train/tailorMade_travel/tailorMade_travel';

        } else if (theType == 'strategy') {
            _url = '../direct_train/raiders/raiders';
        }
        wx.navigateTo({
            url: _url,
        })
    },

    // 获取banner图片
    getBannerImg: function() {
        var that = this;
        util.HttpRequst(true, "ztc/banner/list", 2, '', {
            "type": 1
        }, "GET", false, function(res) {
            // console.log(res)
            if (res.code == 200) {
                if (res.list.length > 0) {
                    that.setData({
                        bannerImgs: res.list
                    });
                } else {
                    that.setData({
                        bannerImgs: ['../img/cxyMallPage/defaultImg.png']
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    // 战略合作
    cooperationTap: function(e) {
        var name = e.currentTarget.dataset.name;
        if (name === 'enshi') {
            wx.navigateTo({
                url: '../subPackages/page/ENSHIHomePage/ENSHIHomePage',
            });
        } else if (name === 'xiangmishan') {
            wx.navigateTo({
                url: '../subPackages/page/XMSHomePage/XMSHomePage',
            });
        }
    },
})