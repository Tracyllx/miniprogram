var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
    },
    callNumber: function () {
        wx.makePhoneCall({
            phoneNumber: '400 9690 196' //仅为示例，并非真实的电话号码
        })
    },
    onLoad: function (options) {

    },
    onShareAppMessage: function () {

    }
})