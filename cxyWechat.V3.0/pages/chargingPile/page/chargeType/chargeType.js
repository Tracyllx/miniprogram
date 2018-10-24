Page({
    data: {

    },
    onLoad: function(options) {
        
    },
    scanCodeCharge: function(e) {
        wx.scanCode({
            success: function(res) {
                console.log(res)
            }
        });
    },
    inputCharge: function(e) {
        wx.navigateTo({
            url: '../inputCode/inputCode',
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})