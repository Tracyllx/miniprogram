Page({
    data: {
        codeNum: '',
        errorTxt: '',
    },
    onLoad: function(options) {

    },
    inputTap: function(e) {
        var val = e.detail.value;
        this.setData({
            codeNum: val
        });
        if (val.length == 8) {
            this.setData({
                errorTxt: ''
            })
        }
    },
    cancel: function () {
        wx.navigateBack()
    },
    comfirm: function() {
        var val = this.data.codeNum;
        if (val.length > 0 && val.length == 8) {
            wx.navigateTo({
                url: '../charge/charge',
            })
        } else {
            this.setData({
                errorTxt: '充电桩码必须是8位数字！'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})