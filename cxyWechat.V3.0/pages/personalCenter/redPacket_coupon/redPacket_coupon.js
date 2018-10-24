var util = require('../../../utils/util.js');
Page({
    data: {
        isType: 'redPacket',//判断进入此页面是 红包-redPacket, 优惠券-coupon
        list: [],//列表数据
        isUse: false,//是否选择了使用
        currIndex: null,//当前选中的红包
        classify: '',//1：优惠券 3：红包
        userPhone: '',//用户手机号
        pageFrom: '',//从哪里进入当前页面
        redpackObj: {},//已选择的红包
        couponObj: {},//已选择的优惠券
        amountPrice: 0,//订单总价
    },

    // 是否使用
    isUseTap: function (e) {
        this.setData({ isUse: !this.data.isUse });
        console.log(this.data.isUse);
        if (this.data.isUse == true && this.data.pageFrom == 'payResult') {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            // 当前选择的好友名字赋值给编辑款项中的姓名临时变量
            prevPage.setData({
                isUse: this.data.isUse
            });
            wx.navigateBack({});
        }
    },

    // 点击红包
    clickBox: function (e) {
        if (!this.data.isUse) {
            var index = e.currentTarget.dataset.index;
            var isAvailable = this.data.list[index].is_available;//1：可用 2：未到使用日期 3：不可用
            
            if (isAvailable == 1) {
                var limitVal = this.data.list[index].limit_value;//使用限制金额
                if (this.data.amountPrice >= limitVal) {//订单总价达到使用限制金额时
                    this.setData({ currIndex: index });
                    if (this.data.pageFrom == 'payResult') {
                        if (this.data.classify == 1) {//优惠券
                            this.setData({ couponObj: this.data.list[index] });

                        } else if (this.data.classify == 3) {//红包
                            this.setData({ redpackObj: this.data.list[index] });
                        }
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2];  //上一个页面
                        // 当前选择的好友名字赋值给编辑款项中的姓名临时变量
                        prevPage.setData({
                            redpackObj: this.data.redpackObj,
                            couponObj: this.data.couponObj,
                        });
                        wx.navigateBack({});
                    } else {
                        wx.navigateTo({
                            url: '../../cxyMallPage/tourismPage/tourismPage',//购票页面
                        });
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '该订单未满¥' + limitVal + '不能使用！',
                    });
                }
            }
            if (isAvailable == 2) {
                wx.showModal({
                    title: '提示',
                    content: '该券未到使用日期！',
                });
            }
            if (isAvailable == 3) {
                wx.showModal({
                    title: '提示',
                    content: '该券不可用！',
                });
            }
        }
    },

    // 获取数据
    getData: function () {
        var that = this;
        var theDate = new Date();
        var y = theDate.getFullYear(),
            m = theDate.getMonth() + 1 < 10 ? '0' + (theDate.getMonth() + 1) : theDate.getMonth() + 1,
            d = theDate.getDate() < 10 ? '0' + theDate.getDate() : theDate.getDate();
        const theDateStamp = new Date(y, m - 1, d);//当前的时间戳
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/wallet/queryCoupon", 1, wx.getStorageSync("sessionId"), { "type": that.data.classify }, "GET", true, function (res) {
            if (res.code == 200) {
                // console.log(res)
                that.setData({ list: res.couponList });
                if (res.couponList.length == 0) {
                    return;
                }
                var datas = res.couponList;
                datas.map(function (item, i, self) {
                    // var endDate = '2018-03-05';
                    var endDate = item.validity_end;
                    const endStamp = new Date(endDate.split('-')[0], endDate.split('-')[1] - 1, endDate.split('-')[2]);
                    item.validity_differ = Math.floor((endStamp.getTime() - theDateStamp.getTime()) / (24 * 3600 * 1000));//有效期的天数
                });
                that.setData({ list: datas });
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

    // 获取用户数据
    getUserInfo: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({ userPhone: res.userInfo.userPhone });
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
        this.getUserInfo();
        this.setData({
            isType: options.isType,
            pageFrom: options.pageFrom,
            amountPrice: options.amount, // 从 payResult 页面过来的订单总价
        });
        if (options.isType == 'redPacket') {
            wx.setNavigationBarTitle({ title: '红 包' });
            this.setData({ classify: 3 });
        }
        if (options.isType == 'coupon') {
            wx.setNavigationBarTitle({ title: '优惠券' });
            this.setData({ classify: 1 });
        }
        this.getData();
    },
})