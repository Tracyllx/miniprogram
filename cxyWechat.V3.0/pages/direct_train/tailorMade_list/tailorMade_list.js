var util = require('../../../utils/util.js');
Page({
    data: {
        list: [],
    },

    getHotelList: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/customizeProductList", 2, '', {
            "customizeType": that.data.isType
        }, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                var proList = res.productList;
                if (proList.length > 0) {
                    proList.map(function(item, i, a) {
                        item.imgUrl = item.photos ? (item.photos).split(',') : [];
                    });
                }
                that.setData({
                    list: proList
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

    // 点击产品进入详情
    gotoProductDetail: function(e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../common/authorization/authorization',
            });
        } else {
            var proID = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '../tailorMade_detail/tailorMade_detail?ticketcode=' + proID
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.isType == '1') {
            wx.setNavigationBarTitle({
                title: '团队拓展'
            });

        } else if (options.isType == '2') {
            wx.setNavigationBarTitle({
                title: '公司年会'
            });

        } else if (options.isType == '3') {
            wx.setNavigationBarTitle({
                title: '同学聚会'
            });

        } else if (options.isType == '4') {
            wx.setNavigationBarTitle({
                title: '亲子研学'
            });

        } else if (options.isType == '5') {
            wx.setNavigationBarTitle({
                title: '家庭聚会'
            });

        } else if (options.isType == '6') {
            wx.setNavigationBarTitle({
                title: '旅游交友'
            });

        } else if (options.isType == '7') {
            wx.setNavigationBarTitle({
                title: '特殊定制'
            });
        }
        this.setData({
            isType: options.isType
        });
        this.getHotelList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})