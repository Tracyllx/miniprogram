var util = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');
Page({
    data: {
        theCarImg: util.baseUrl + 'img/intelligentTraffic/zc_type.png',
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        minute1: 3,
        minute2: 0,
        second1: 0,
        second2: 0,
        orderTime: "", //得到下单日期
        price: 0, //得到价格
        remark: "", //得到门票的详情
        buyDetail: [], //得到产品名称列表（针对酒店）
        imgs: "", //得到
        orderId: "", //得到orderid
        currMethod: '', //选择支付方式
        isUse: false, //是否使用红包或优惠券
        redpackObj: {}, //已选择的红包
        couponObj: {}, //已选择的优惠券
        redpackNum: 0, //已减去的钱数
        couponNum: 0, //已减去的钱数
        showPsdModule: false, //是否显示支付密码弹窗
        payParams: '', //支付所需参数
        errorPsdTip: '', //密码框提示
        referralCode: '', //推荐码
        codeFocus: false,
    },

    referralCodeFocus: function() {
        this.setData({
            codeFocus: true
        });
    },

    referralCodeInput: function(e) {
        var val = e.detail.value;
        this.setData({
            codeFocus: true,
            referralCode: val
        });
    },

    onLoad: function(options) {
        this.setData({
            orderId: options.orderId
        });
        this.getOrderDetail(); //获取订单信息
    },

    onShow: function() {
        this.getUserInfo(); //获取用户信息
        if (JSON.stringify(this.data.redpackObj) != '{}') {
            var obj = this.data.redpackObj;
            console.log(obj);
            var total = (this.data.price - obj.coupon_value).toFixed(2);
            var totalTxt = ''; //优惠之后，应付价格为0时的提示语
            if (total <= 0) {
                totalTxt = '优惠后，价格不能小于等于¥0.00';
                total = '0.00';
            }
            this.setData({
                redpackNum: obj.coupon_value,
                totalTxt: totalTxt,
                totalPrice: total,
            });

        } else if (JSON.stringify(this.data.couponObj) != '{}') {
            var obj = this.data.couponObj;
            console.log(obj);
            var total = (this.data.price - obj.coupon_value).toFixed(2);
            var totalTxt = ''; //优惠之后，应付价格为0时的提示语
            if (total <= 0) {
                totalTxt = '优惠后，价格不能小于等于¥0.00';
                total = '0.00';
            }
            this.setData({
                couponNum: obj.coupon_value,
                totalTxt: totalTxt,
                totalPrice: total,
            });
        }
    },

    // 选择优惠
    gotoDiscount: function(e) {
        if (this.data.redpackListLen > 0) {
            var isType = e.currentTarget.dataset.theType;
            wx.navigateTo({
                url: '../../personalCenter/redPacket_coupon/redPacket_coupon?pageFrom=payResult&isType=' + isType + '&amount=' + this.data.price
            });
        }
    },

    // 选择支付方式
    clickPayMethod: function(e) {
        var method = e.currentTarget.dataset.method;
        this.setData({
            currMethod: method
        });
    },

    // 确认支付
    conformPay: function(e) {
        var couponId = '',
            redpackId = '';
        if (JSON.stringify(this.data.redpackObj) != '{}') {
            redpackId = (this.data.redpackObj).id;
        } else if (JSON.stringify(this.data.couponObj) != '{}') {
            couponId = (this.data.couponObj).id;
        }
        var param = {
            "redpackId": redpackId,
            "couponId": couponId,
            "orderId": this.data.orderId
        };
        this.setData({
            payParams: param
        });

        if (e.currentTarget.dataset.totalTxt) {
            return;
        }
        if (this.data.currMethod == '' || this.data.currMethod == undefined) {
            wx.showModal({
                title: '提示',
                content: '请选择支付方式！',
            });
            return;
        }
        if (this.data.currMethod == 1) { //余额支付
            var user = this.data.userInfo;
            if (user.pay_pass) {
                this.setData({
                    showPsdModule: true
                });
            } else {
                wx.navigateTo({
                    url: '../../personalCenter/setPSD/setPSD?isType=forgetPass',
                });
            }
        }
        if (this.data.currMethod == 2) { //微信支付
            this.tapToPay();
        }
    },

    // 输入密码
    psdInput: function(e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                payPsd: val
            });
        }
    },

    // 隐藏支付密码框
    hidePsdModule: function() {
        this.setData({
            showPsdModule: false
        });
    },

    // 余额支付 
    userMyWallet: function() {
        if (this.data.payPsd) {
            var param = this.data.payParams;
            param.payPass = md5.hex_md5(this.data.payPsd);
            param.rmdCode = this.data.referralCode;
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/wallet/toPay", 1, wx.getStorageSync("sessionId"), param, "GET", true, function(res) {
                // console.log(res);
                if (res.code == 200) {
                    wx.redirectTo({
                        url: '../payResultSuccess/payResultSuccess',
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
        } else {
            this.setData({
                errorPsdTip: '请输入支付密码！'
            });
        }
    },

    //   点击调起微信支付
    tapToPay: function() {
        var that = this;
        var param = this.data.payParams;
        param.rmdCode = this.data.referralCode;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/toPay", 3, wx.getStorageSync("sessionId"), param, "POST", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.content === 'PAY_FINISHED') {
                    wx.redirectTo({
                        url: '../payResultSuccess/payResultSuccess',
                    });
                } else if (res.content.appId) {
                    var shantimeStamp = res.content.timeStamp.toString();
                    wx.requestPayment({
                        'timeStamp': shantimeStamp,
                        'nonceStr': res.content.nonceStr,
                        'package': res.content.packageValue,
                        'signType': res.content.signType,
                        'paySign': res.content.paySign,
                        'success': function(rep) {
                            // console.log(rep)
                            if (rep.errMsg == "requestPayment:ok") {
                                // 添加微信卡包--我的票券
                                util.HttpRequst(true, "ztc/product/getAddCardParam", 3, that.data.sessionId, {
                                    "orderId": that.data.orderId
                                }, "POST", false, function(rep) {
                                    // console.log(rep);
                                    if (rep.code == 200) {
                                        var ext = {
                                            code: rep.content.code,
                                            openid: rep.content.openid,
                                            timestamp: rep.content.timestamp,
                                            nonce_str: rep.content.nonce_str,
                                            signature: rep.content.signature
                                        };
                                        var bb = [{
                                            "cardId": rep.content.card_id,
                                            "cardExt": JSON.stringify(ext)
                                        }]
                                        // console.log(bb);
                                        wx.addCard({
                                            cardList: bb,
                                            success: function(resp) {
                                                // console.log(resp);
                                                // 添加票券成功，返回
                                                wx.redirectTo({
                                                    url: '../payResultSuccess/payResultSuccess',
                                                });
                                            },
                                            fail: function(resp, error) {
                                                console.log(error);
                                            },
                                            complete: function(resp) {
                                                // console.log(resp);
                                            }
                                        });
                                    } else if (rep.code == 500) { //获取失败，改产品没有配置微信卡片信息
                                        wx.redirectTo({
                                            url: '../payResultSuccess/payResultSuccess',
                                        });
                                    }
                                })
                            }
                        },
                        'fail': function(res) {
                            wx.showModal({
                                title: '',
                                content: '调起支付失败，请重新点击支付',
                                confirmText: "重新支付",
                                success: function(res) {
                                    if (res.confirm) {
                                        that.tapToPay();
                                    } else if (res.cancel) {
                                        console.log('用户点击取消');
                                    }
                                }
                            })
                        }
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

    // 函数5：剩余时间
    areaTime: function(timeValue) {
        var that = this;
        var shanOrderTime = this.data.orderTime;
        var arr = shanOrderTime.split(/[- : \/]/);
        var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        var order_time = Date.parse(new Date(date));
        var nowTime = Date.parse(new Date());
        var differ_time = nowTime - order_time;
        var leftTime = 1800000 - differ_time;
        var d = new Date(leftTime);
        if (leftTime < 0) {
            console.log("该订单已超时");
        } else {
            var interval = setInterval(function() {
                var m = d.getMinutes();
                var s = d.getSeconds();
                that.setData({
                    "minute1": parseInt(m / 10)
                });
                that.setData({
                    "minute2": parseInt(m % 10)
                });
                that.setData({
                    "second1": parseInt(s / 10)
                });
                that.setData({
                    "second2": parseInt(s % 10)
                });
                if (m == 0 && s == 0) {
                    clearInterval(interval);
                    return;
                }
                d.setSeconds(s - 1);
            }, 1000);
        }
    },

    // 获取用户信息
    getUserInfo: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/info", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({
                    userInfo: res.userInfo
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

    // 查询订单信息
    getOrderDetail: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/continuePay", 1, wx.getStorageSync("sessionId"), {
            "orderId": this.data.orderId
        }, "GET", true, function(res) {
            if (res.code == 200) {
                // console.log(res);
                var orderDetail = res.orderDetail,
                    len1 = 0,
                    len2 = 0;
                const year = (orderDetail.createTime).substr(0, 4);
                const month = (orderDetail.createTime).substr(4, 2);
                const day = (orderDetail.createTime).substr(6, 2);
                const hour = (orderDetail.createTime).substr(8, 2);
                const min = (orderDetail.createTime).substr(10, 2);
                const sec = (orderDetail.createTime).substr(12, 2);
                const order_time = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
                if (res.redpackList.length != 0) {
                    res.redpackList.map(function(item, i, self) {
                        if (item.is_available == 1) {
                            len1++;
                        }
                    });
                }
                if (res.couponList.length != 0) {
                    res.couponList.map(function(item, i, self) {
                        if (item.is_available == 1) {
                            len2++;
                        }
                    });
                }
                that.setData({
                    orderTime: order_time,
                    price: orderDetail.amount,
                    imgs: orderDetail.photos ? orderDetail.photos.split(',')[0] : '',
                    orderDetail: res.orderDetail,
                    products: res.products,
                    redpackListLen: len1,
                    couponListLen: len2,
                    redpackList: res.redpackList,
                    couponList: res.couponList,
                });
                that.areaTime(order_time);
                // 保存信息以便支付成功页面使用
                wx.setStorageSync('CREATEORDERRESULT', {
                    "orderId": that.data.orderId,
                    "orderTime": order_time,
                    "orderDetail": orderDetail,
                    "products": res.products,
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
})