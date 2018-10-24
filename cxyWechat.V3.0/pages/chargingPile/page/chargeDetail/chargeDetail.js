Page({
    data: {
        dataDetail: {}
    },
    onLoad: function (options) {
        this.setData({
            dataDetail: wx.getStorageSync('CHARGEDATA')
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})