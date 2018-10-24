var util = require('../../../utils/util.js');
Page({
    data: {
        baseUrl: util.baseUrl,
        isType: '',//判断是红包还是优惠券
        unopened: true,//红包未拆
        opened1: false,//拆现金红包
        opened2: false,//拆购物红包
        thisType: '',//1：优惠券 2：现金红包 3：购物红包
        dataObj: {},//获得红包优惠券的数据
        isNull: false,//红包派完或优惠券发完了
    },

    // 拆红包
    openTheBag: function (e) {
        if (dataObj.coupon_type == 2) { // 现金红包
            this.setData({ opened1: true });
        }
        if (dataObj.coupon_type == 3) { // 购物红包
            this.setData({ opened2: true });
        }
        this.setData({ unopened: false }); // 红包已拆
    },

    // 跳转余额
    gotoMyWallet: function (e) {
        wx.navigateTo({
            url: '../myWallet/myWallet',
        });
    },

    // 跳转红包或优惠券列表
    gotoDataList: function (e) {
        wx.navigateTo({
            url: '../redPacket_coupon/redPacket_coupon?isType=redPacket',
        });
    },

    // 立即领券
    getCoupon: function (e) {
        console.log('立即领券');
    },

    // 关闭页面
    closePage: function () {
        wx.navigateBack();
    },

    // 获取红包/优惠券
    getData: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/wallet/getCoupon", 1, wx.getStorageSync("sessionId"), { "type": that.data.thisType }, "GET", true, function (res) {
            if (res.code == 200) {
                if (res.coupon) {
                    that.setData({ dataObj: res.coupon });
                } else {
                    that.setData({ isNull: true });
                    if (that.data.isType == 'coupon') { // 优惠券
                        wx.showModal({
                            title: '提示',
                            content: '抱歉！优惠券已发放完了！',
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '抱歉！红包已经派完了！',
                        });
                    }
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ isType: options.isType, thisType: options.typeNum });
        this.getData();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        // const name = this.data.activeName; // 活动名称
        const name = '畅享游邀您领取大礼包！';
        const isType = this.data.isType; // 活动类型：红包 or 优惠券
        var img = ''; // 每种类型对应的分享图片不同
        if (isType == 'redPacket') {
            img = 'share_img1.png';
        }
        if (isType == 'coupon') {
            img = 'share_img2.png';
        }
        if (res.from === 'button') { // 来自页面内转发按钮
            console.log(res.target);
        }
        var that = this;
        return {
            title: name,
            path: '/pages/personalCenter/activities/activities?isType=' + isType,
            imageUrl: that.data.baseUrl + 'img/personalCenter/activities/' + img,
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log('转发失败');
            }
        }
    }
})