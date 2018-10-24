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
        productTitle: '', //哪一种产品：eat、live、tourism、buy
        bottomText: '按钮', //主页面最右下角按钮文字
        tabIndex: 1, // 1产品详情，2购买须知，3用户评价
        stars: [0, 1, 2, 3, 4], //评分数组
        currentID: '', //当前产品的ID
        detailObj: {}, //当前产品详情（对象）
        addressInfo: '', //产品的详细地址
        addressDistance: '', //当前位置与产品地址的距离
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
        // --------- 底部弹窗 ----------
        pickerBottomText: '按钮', //底部弹窗最右下角按钮文字
        isCollect: false, //是否收藏
        showPicker: false, //是否显示底部弹窗
        specList: [], //产品规格列表
        isChooseSpec: false, //是否选择了规格
        isChooseText: '', //选中的种类文字描述
        specItemIndex: null, //产品规格选中的item
        specPrice: '', //选择规格对应的价格
        specName: '', //选择规格的名称
        specCount: 1, //选择产品规格的购买数量
        specTotalPrice: 0, //选择产品规格显示的合计
    },
    onLoad: function(options) {
        // console.log(options);
        if (options.agent_code) {
            wx.setStorageSync("agent_code", options.agent_code); //将代理商编号存起来
        }
        this.setData({
            currentID: options.id,
            productTitle: options.productTitle,
        });

        var bottomText = this.data.bottomText;
        var pickerBottomText = this.data.pickerBottomText;

        if (options.productTitle === 'eat') {
            bottomText = '去 评 价';

        } else if (options.productTitle === 'live') {
            bottomText = '去 评 价';
            pickerBottomText = '下一步，填写信息';

        } else if (options.productTitle === 'tourism') {
            bottomText = '在线预订';

        } else if (options.productTitle === 'buy') {
            bottomText = '立即购买';
            pickerBottomText = '立即购买';
            this.getSpecList(); //获取产品规格
        }
        this.setData({
            bottomText: bottomText,
            pickerBottomText: pickerBottomText,
        });
        this.getDetail(options.productTitle); //获取详情
    },
    onShow: function() {
        this.getComments(); //获取用户评价
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

    // 打电话
    callPhone: function(e) {
        if (this.data.detailObj.hotline) {
            wx.makePhoneCall({
                phoneNumber: this.data.detailObj.hotline,
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
    },

    // 首页、收藏
    bottomTap: function(e) {
        var index = e.currentTarget.dataset.index;
        if (index == 0) {
            wx.reLaunch({ //关闭之前所有页面
                url: '../../cxtripHomePage/cxtripHomePage',
            });
        } else {
            var detailObj = this.data.detailObj;
            if (detailObj.isCollect == 0) {
                if (wx.getStorageSync('isNeedUserInfo') == true) { //从未授权
                    wx.navigateTo({
                        url: '../../authorization/authorization',
                    })
                } else {
                    this.collectionFun();
                }
            }
        }
    },

    // 主页面右下角绿色按钮
    mainBottomTap: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) { //从未授权
            wx.navigateTo({
                url: '../../authorization/authorization',
            })
        } else {
            if (this.data.productTitle === 'eat') {
                wx.navigateTo({
                    url: '../comment/comment?orgnId=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'live') {
                wx.navigateTo({
                    url: '../comment/comment?orgnId=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'tourism') {
                wx.navigateTo({
                    url: '../onlineBooking/onlineBooking?id=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'buy') {
                if (this.data.isChooseSpec) {
                    if (this.data.specItemIndex != null && this.data.specTotalPrice != 0) {
                        var obj = {
                            'imgUrl': this.data.swiperImg[0],
                            'productName': this.data.detailObj.name,
                            'productSpec': this.data.specName,
                            'productCount': this.data.specCount,
                            'productPrice': this.data.specPrice,
                            'productTotal': this.data.specTotalPrice,
                        }
                        wx.setStorageSync('SUBMITORDER', obj);
                        wx.navigateTo({
                            url: '../submitOrder/submitOrder?id=' + this.data.currentID,
                        });
                    } else {
                        wx.showToast({
                            title: '请选择种类',
                        })
                    }
                } else {
                    this.showPickerTap();
                }
            }
        }
    },

    // 选择房型
    chooseHouseType: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) { //从未授权
            wx.navigateTo({
                url: '../../authorization/authorization',
            })
        } else {
            wx.navigateTo({
                url: '../liveChooseType/liveChooseType?id=' + this.data.currentID,
            });
        }
    },

    // 显示底部弹窗
    showPickerTap: function(e) {
        this.setData({
            showPicker: true,
        });
    },

    // 隐藏底部弹窗
    hidePickerTap: function(e) {
        this.setData({
            showPicker: false
        });
        if (this.data.specTotalPrice && this.data.specTotalPrice != 0) {
            this.setData({
                isChooseSpec: true,
                isChooseText: this.data.specName + '    ×' + this.data.specCount,
            });
        }
    },

    // 弹窗中右下角绿色按钮
    pickerBottomTap: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) { //从未授权
            wx.navigateTo({
                url: '../../authorization/authorization',
            })
        } else {
            if (this.data.productTitle === 'eat') {
                wx.navigateTo({
                    url: '../comment/comment?orgnId=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'live') {
                wx.navigateTo({
                    url: '../confirmOrder/confirmOrder?id=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'tourism') {
                wx.navigateTo({
                    url: '../onlineBooking/onlineBooking?id=' + this.data.currentID,
                });
            } else if (this.data.productTitle === 'buy') {
                if (this.data.specItemIndex != null && this.data.specTotalPrice != 0) {
                    var obj = {
                        'imgUrl': this.data.swiperImg[0],
                        'productName': this.data.detailObj.name,
                        'productSpec': this.data.specName,
                        'productCount': this.data.specCount,
                        'productPrice': this.data.specPrice,
                        'productTotal': this.data.specTotalPrice,
                    }
                    wx.setStorageSync('SUBMITORDER', obj);
                    wx.navigateTo({
                        url: '../submitOrder/submitOrder?id=' + this.data.currentID,
                    });
                } else {
                    wx.showToast({
                        title: '请选择种类',
                    })
                }
            }
        }
    },

    // 弹窗中的选择规格
    specItemTap: function(e) {
        var specList = this.data.specList;
        var index = e.currentTarget.dataset.index;
        console.log('price:', specList[index].price);
        if (specList[index].price != 0) {
            this.setData({
                specItemIndex: index,
                specPrice: Number(specList[index].price),
                specName: specList[index].spec_name,
                specTotalPrice: (Number(specList[index].price) * this.data.specCount).toFixed(2),
            });
        }
    },

    // 弹窗中规格数量的input
    specIntput: function(e) {
        var val = e.detail.value;
        if (val.length < 0 || val == 0) {
            val = 1;
        }
        this.setData({
            specCount: Number(val),
            specTotalPrice: (Number(val) * this.data.specPrice).toFixed(2),
        });
    },

    // 弹窗中规格数量的加减
    specOptions: function(e) {
        var count = Number(this.data.specCount);
        var option = e.currentTarget.dataset.option;
        if (option < 0) {
            count = count - 1 > 0 ? count - 1 : 1;
        } else {
            count = count + 1;
        }
        this.setData({
            specCount: count,
            specTotalPrice: (count * this.data.specPrice).toFixed(2),
        });
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

    // 获取详情
    getDetail: function(theType) {
        var that = this;
        var detailObj = {},
            reqUrl = "",
            reqData = {},
            swiperImg = [0];

        if (theType === 'eat' || theType === 'live' || theType === 'tourism') {
            reqUrl = "ztc/product/orgnDetail";
            reqData = {
                "orgnId": this.data.currentID
            };

        } else if (theType === 'buy') {
            reqUrl = "ztc/product/productDetail";
            reqData = {
                "productId": this.data.currentID
            };
        }
        util.HttpRequst(false, reqUrl, 1, wx.getStorageSync("sessionId"), reqData, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.detail) {
                    var obj = res.detail;
                    if (theType === 'eat' || theType === 'live' || theType === 'tourism') { //机构
                        swiperImg = obj.imgUrls ? obj.imgUrls.split(',') : [0]; //轮播图：字符串转数组，[0] 是默认图片
                        detailObj.productCode = obj.product_code ? obj.product_code : '';
                        detailObj.name = obj.orgnName ? obj.orgnName : '';
                        detailObj.price = obj.price ? obj.price : '';
                        detailObj.isCollect = obj.isCollect ? obj.isCollect : '';
                        detailObj.isComment = obj.isComment ? obj.isComment : '';
                        detailObj.score = obj.score ? obj.score : '';
                        detailObj.location = obj.location ? obj.location : '';
                        detailObj.hotline = obj.hotline ? obj.hotline : '';
                        detailObj.opentime = obj.openTime ? obj.openTime : '';
                        detailObj.productDetail = obj.orgnDetail ? obj.orgnDetail : '<p class="nonedata">暂无更多数据~</p>';
                        detailObj.buyNotes = obj.buyNotes ? obj.buyNotes : '<p class="nonedata">暂无更多数据~</p>';

                    } else if (theType === 'buy') { //产品
                        swiperImg = obj.photos ? obj.photos.split(',') : [0]; //轮播图：字符串转数组，[0] 是默认图片
                        detailObj.productCode = obj.product_code ? obj.product_code : '';
                        detailObj.name = obj.product_name ? obj.product_name : '';
                        detailObj.price = obj.price ? obj.price : '';
                        detailObj.isCollect = obj.isCollect ? obj.isCollect : '';
                        detailObj.isComment = obj.isComment ? obj.isComment : '';
                        detailObj.score = obj.score ? obj.score : '';
                        detailObj.location = obj.product_addr ? obj.product_addr : '';
                        detailObj.hotline = obj.hotline ? obj.hotline : '';
                        detailObj.opentime = obj.openTime ? obj.openTime : '';
                        detailObj.productDetail = obj.product_detail ? obj.product_detail : '<p class="nonedata">暂无更多数据~</p>';
                        detailObj.buyNotes = obj.buy_notes ? obj.buy_notes : '<p class="nonedata">暂无更多数据~</p>';
                    }
                    if (detailObj.score) { //评分星星处理
                        detailObj.score = (detailObj.score).toFixed(1); //评分数保留一位小数
                        var scoreNum = (detailObj.score + '').split('.');
                        if (Number(scoreNum[1]) == 0) {
                            detailObj.starFull = Number(scoreNum[0]); //整星
                            detailObj.starHalf = ''; //半星
                            detailObj.starNo = 5 - Number(scoreNum[0]); //空星
                        } else if (Number(scoreNum[1]) > 0 && Number(scoreNum[1]) <= 5) {
                            detailObj.starFull = Number(scoreNum[0]); //整星
                            detailObj.starHalf = '0.5'; //半星
                            detailObj.starNo = 4 - Number(scoreNum[0]); //空星
                        } else if (Number(scoreNum[1]) > 5) {
                            detailObj.starFull = Number(scoreNum[0]) + 1; //整星
                            detailObj.starHalf = ''; //半星
                            detailObj.starNo = 4 - Number(scoreNum[0]); //空星
                        }
                    }
                    if (detailObj.location) { //地址处理，获取产品的详细地址，以及与当前位置的距离
                        that.getAddress(detailObj.location);
                        that.getLocationPiont(detailObj.location);
                    }
                    that.setData({
                        swiperImg: swiperImg, //轮播图
                        detailObj: detailObj, //产品详细内容
                        statusCode: 200,
                    });
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

    // 获取产品规格
    getSpecList: function() {
        var that = this;
        util.HttpRequst(true, "ztc/product/specList", 2, '', {
            "productId": this.data.currentID
        }, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.specList.length > 0) {
                    that.setData({
                        specList: res.specList,
                        // specPrice: res.specList[0].price,
                        // specTotalPrice: res.specList[0].price,
                    });
                } else {
                    that.setData({
                        specList: [{
                            'spec_name': '该产品还未设置规格',
                            'price': 0
                        }],
                        // specPrice: 0,
                        // specTotalPrice: 0,
                    });
                    console.log('没有规格');
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

    // 获取产品评论
    getComments: function() {
        var that = this;
        var theType = this.data.productTitle;
        var params = {
            "page": this.data.commentPage,
            "limit": this.data.commentLimit
        };
        if (theType === 'eat' || theType === 'live' || theType === 'tourism') {
            params.orgnId = this.data.currentID;

        } else if (theType === 'buy') {
            params.productId = this.data.currentID;
        }
        // console.log(params);
        util.HttpRequst(true, "ztc/product/commentList", 2, '', params, "GET", true, function(res) {
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

    // 收藏接口
    collectionFun: function() {
        var that = this;
        var theType = this.data.productTitle;
        var detailObj = this.data.detailObj;
        var params = {};
        if (theType === 'eat' || theType === 'live' || theType === 'tourism') {
            params.orgnId = this.data.currentID;
            params.type = (theType === 'eat') ? 1 : (theType === 'live') ? 2 : 3;

        } else if (theType === 'buy') {
            params.productCode = detailObj.productCode;
            params.type = 4;
        }
        util.HttpRequst(true, "ztc/user/collect", 1, wx.getStorageSync("sessionId"), params, "GET", true, function(res) {
            console.log(res);
            if (res.code == 200) {
                detailObj.isCollect = 1;
                that.setData({
                    detailObj: detailObj
                });
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