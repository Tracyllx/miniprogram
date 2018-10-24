Page({
    data: {
        orderId: '',
        orderTime: '',//2018-03-07 16:55:21
        createTime: '',//2018-03-07
        detail: '',
        productList: [],
    },

    onLoad: function () {
        var result = wx.getStorageSync("CREATEORDERRESULT");
        // console.log(result);
        this.setData({
            orderId: result.orderId,
            orderTime: result.orderTime,
            createTime: (result.orderTime).split(' ')[0],
            detail: result.orderDetail,
            productList: result.products,
        });
    },

    onUnload: function () {
        wx.removeStorageSync('CREATEORDERRESULT');//删除缓存
    },

    //查看订单详情
    readOrderDetail: function () {
        var that = this;
        wx.setStorageSync("orderStatus", 2);
        var orderId = that.data.orderId;
        var orderTime = that.data.orderTime;
        wx.redirectTo({
            url: '../orderDetail/orderDetail?orderId=' + orderId + '&orderTime=' + orderTime,
        });
    },
})
