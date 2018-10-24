var util = require('../../../utils/util.js');
var amapFile = require('../../../utils/amap-wx.js');
var amapFun = new amapFile.AMapWX({
    key: 'f387407e04361890eb004cafd1c4e523'
});
Page({
    data: {
        HTTPS: util.baseUrl,
        statusCode: 100,
        statusDone: false,
        // --------- 头部轮播图 ----------
        indicatorDots: true,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        swiperImg: [0],
        // ---------- 主要内容部分 ---------
        getToday: '', //当前日期
        tabIndex: 1, // 1产品详情，2购买须知，3用户评价
        stars: [0, 1, 2, 3, 4], //评分数组
        currentID: '', //当前产品的ID
        detailObj: {}, //当前产品详情（对象）
        addressInfo: '', //产品的详细地址
        addressDistance: '', //当前位置与产品地址的距离
        btnActive: false, //是否激活预定按钮
        // --------- 导航栏的操作 ----------
        scrollT: 0,
        scrollTop: 0,
        navOffsetTop: 0, //导航栏距顶部的top
        navToTop: false, //导航栏是否置顶
        commentList: [], //用户评价数据
        commentPage: 1, //第几页评论
        commentLimit: 10, //每页几条评论
        commentTotalCount: 0, //总共几条评论
        lastLoadTime: 0, //上一次加载的时间
    },
    onLoad: function(options) {
        if (options.agent_code) {
            wx.setStorageSync("agent_code", options.agent_code); //将代理商编号存起来
        }
        this.getNewTimes();
        this.getProductId();
    },

    // 滚动时触发事件
    bindscroll: function(e) {
        var scrollT = e.detail.scrollTop;
        this.setData({
            scrollT: scrollT,
            navToTop: parseInt(scrollT) > this.data.navOffsetTop - 10
        });
    },

    // 预览图片
    previewImg: function(e) {
        var imgList = e.currentTarget.dataset.imgList;
        var imgUrl = e.currentTarget.dataset.imgUrl;
        if (imgList[0] != 0) { //图片列表第一张不等于 0 ，表示不是默认图片
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgList, // 需要预览的图片http链接列表
            });
        }
    },

    // 点击tab
    tabTap: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            tabIndex: index,
            scrollTop: this.data.navToTop ? this.data.navOffsetTop : this.data.scrollT
        });
        if (index == '3') {
            this.getComments();
        }
    },

    // 底部按钮
    btmTap: function(e) {
        var btm = e.currentTarget.dataset.btm;
        if (btm == 'guide') {
            wx.navigateTo({
                url: '../busGuide/busGuide',
            });
        } else if (btm == 'buy') {
            if (wx.getStorageSync('isNeedUserInfo') == true) {
                wx.navigateTo({
                    url: '../../common/authorization/authorization',
                });
            } else {
                if (this.data.btnActive) {
                    var obj = {
                        id: this.data.currentID,
                        name: this.data.detailObj.name,
                        date: this.data.detailObj.chooseDate,
                        price: this.data.detailObj.price,
                        limit: this.data.detailObj.limitTime
                    }
                    wx.setStorageSync('GGCBUY', obj);
                    wx.navigateTo({
                        url: '../ggcBuying/ggcBuying',
                    });
                }
            }
        }
    },

    // 定位当前位置
    getLocationPiont: function(location) {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                const currLocation = res.longitude + ',' + res.latitude;
                that.getTwoPointDistance(currLocation, location);
            },
        });
    },

    // 高德地图获取地址详细信息
    getAddress: function(location) {
        var that = this;
        amapFun.getRegeo({
            location: location,
            success: function(data) {
                //成功回调 获取详细地址
                that.setData({
                    addressInfo: data[0].regeocodeData.formatted_address
                });
            },
            fail: function(info) {
                //失败回调
                console.log(info)
            }
        });
    },

    // 高德地图获取两点间距离
    getTwoPointDistance: function(currLocation, destinationLocation) {
        var that = this;
        amapFun.getDrivingRoute({
            origin: currLocation,
            destination: destinationLocation,
            success: function(data) {
                //成功回调 获取当前点位到目的地的距离，单位km
                that.setData({
                    addressDistance: (data.paths[0].distance * 0.001).toFixed(2) + 'km'
                });
            },
            fail: function(info) {
                //失败回调
                console.log(info)
            }
        });
    },

    // 查看地图（导航）
    openTheMap: function() {
        if (this.data.detailObj.location) {
            var location = (this.data.detailObj.location).split(',');
            var locationName = this.data.addressInfo;
            wx.openLocation({
                latitude: Number(location[1]),
                longitude: Number(location[0]),
                name: locationName,
            });
        }
    },

    // 获取产品id
    getProductId: function() {
        var that = this;
        util.HttpRequst(false, "ztc/product/list", 2, "", {
            "productOrOrgnName": "五指山",
            "isTourBus": 1
        }, "GET", true, function(res) {
            if (res.code == 200) {
                if (res.list.length > 0 && res.list[0].product && res.list[0].product.length > 0) {
                    that.setData({
                        currentID: res.list[0].product[0].productId
                    });
                    that.getDetail(res.list[0].product[0].productId);
                } else {
                    console.log('没有机构产品！');
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

    // 获取详情
    getDetail: function(idCode) {
        var that = this;
        var detailObj = {},
            swiperImg = [0];
        util.HttpRequst(false, "ztc/product/productDetail", 2, "", {
            "productId": idCode
        }, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.detail) {
                    var obj = res.detail;
                    swiperImg = obj.photos ? obj.photos.split(',') : [0]; //轮播图：字符串转数组，[0] 是默认图片
                    detailObj.productCode = obj.product_code ? obj.product_code : '';
                    detailObj.name = obj.product_name ? obj.product_name : '';
                    detailObj.location = obj.product_addr ? obj.product_addr : '';
                    detailObj.limitTime = obj.order_time ? obj.order_time : '';
                    detailObj.opentime = obj.open_time ? obj.open_time : '';
                    detailObj.productDetail = obj.product_detail ? obj.product_detail : '<p class="nonedata">暂无更多数据~</p>';
                    detailObj.buyNotes = obj.buy_notes ? obj.buy_notes : '<p class="nonedata">暂无更多数据~</p>';
                    if (detailObj.location) { //地址处理，获取产品的详细地址，以及与当前位置的距离
                        that.getAddress(detailObj.location);
                        that.getLocationPiont(detailObj.location);
                    }
                    that.setData({
                        swiperImg: swiperImg, //轮播图
                        detailObj: detailObj, //产品详细内容
                        statusCode: 200,
                    });
                    that.getTimeData(idCode, obj.order_time); //获取日期价格
                    // ************* 获取 #nav-id 节点的 offsetTop 距离 *************
                    var query = wx.createSelectorQuery().in(that);
                    query.select('#nav-id').boundingClientRect(function(res) {
                        that.setData({
                            navOffsetTop: parseInt(res.top)
                        });
                    }).exec();
                } else {
                    console.log('没有内容！');
                    that.setData({
                        statusDone: true
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

    // 得到日期和价格
    getTimeData: function(idCode, limitTime) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/productPriceList", 2, "", {
            "productId": idCode
        }, "GET", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.list.length == 0) {
                    that.setData({
                        btnActive: false
                    });
                } else {
                    var detailObj = that.data.detailObj;
                    var currentPrice = '',
                        chooseDate = '';
                    var newTimer = new Date().getHours(); //得到当前的时间
                    var newMinus = new Date().getMinutes(); //得到当前的分钟
                    var newDate = that.data.getToday.substr(5, 10); //得到当前月+日
                    limitTime = limitTime ? limitTime.split(':') : '17:30'.split(':');
                    if (newTimer > limitTime[0] || (newMinus >= limitTime[1] && newTimer == limitTime[0])) { //超过五点半时限
                        currentPrice = res.list[1].price;
                        chooseDate = res.list[1].priceDate;
                    } else { //没有超出五点半
                        currentPrice = res.list[0].price;
                        chooseDate = res.list[0].priceDate;
                    }
                    detailObj.price = currentPrice;
                    detailObj.chooseDate = chooseDate;
                    that.setData({
                        btnActive: true,
                        detailObj: detailObj,
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

    // 获取产品评论
    getComments: function() {
        var that = this;
        util.HttpRequst(true, "ztc/product/commentList", 2, '', {
            "page": this.data.commentPage,
            "limit": this.data.commentLimit,
            "productId": this.data.currentID
        }, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                var list = res.content.list;
                if (list.length > 0) {
                    list.map(function(item, i, a) {
                        item.score = (item.score).toFixed(1); //评分数保留一位小数
                        var scoreNum = (item.score + '').split('.');
                        if (Number(scoreNum[1]) == 0) {
                            item.starFull = Number(scoreNum[0]); //整星
                            item.starHalf = ''; //半星
                            item.starNo = 5 - Number(scoreNum[0]); //空星
                        } else if (Number(scoreNum[1]) > 0 && Number(scoreNum[1]) <= 5) {
                            item.starFull = Number(scoreNum[0]); //整星
                            item.starHalf = '0.5'; //半星
                            item.starNo = 4 - Number(scoreNum[0]); //空星
                        } else if (Number(scoreNum[1]) > 5) {
                            item.starFull = Number(scoreNum[0]) + 1; //整星
                            item.starHalf = ''; //半星
                            item.starNo = 4 - Number(scoreNum[0]); //空星
                        }
                        if (item.photos) {
                            item.imgUrls = item.photos.split(',');
                        }
                    });
                    if (that.data.commentPage == 1) {
                        that.setData({
                            commentList: list
                        });
                    } else {
                        that.setData({
                            commentList: list.concat(list)
                        });
                    }
                    that.setData({
                        commentTotalCount: res.content.totalCount
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

    // 下拉加载评论
    scrolltolower: function(e) {
        if (this.data.tabIndex == 3) {
            // 300ms 内多次下拉的话仅算一次
            var curTime = e.timeStamp; // 获取点击当前时间
            var lastTime = this.data.lastLoadTime; // 上一次加载的时间
            if (curTime - lastTime < 300) {
                return;
            }
            if (this.data.commentList.length >= this.data.commentTotalCount) {
                console.log("到底了, data length: ", this.data.commentList.length);
            } else {
                console.log('当前页：', this.data.commentPage);
                this.data.commentPage++;
                this.setData({
                    commentPage: this.data.commentPage
                });
                this.getComments();
            }
            this.setData({
                lastLoadTime: curTime
            });
        }
    },

    // 格式化当前日期：2018-05-07
    getNewTimes: function() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var strings = year.toString() + "-" + month + "-" + day
        this.setData({
            getToday: strings
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})