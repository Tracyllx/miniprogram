var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        ticketPower: [],//保存核票验票的权限
    },
    onLoad: function (options) {
        // console.log(wx.getStorageSync('TICKETPOWER'));
        this.setData({ ticketPower: wx.getStorageSync('TICKETPOWER') });
    },

    /**
     * 检票
     */
    checkTap: function (e) {
        var listType = e.currentTarget.dataset.listType;
        var orgnCode = e.currentTarget.dataset.orgnCode;
        wx.navigateTo({
            url: '../nuclearTickets/nuclearTickets?typeTxt=' + listType + '&orgnCode=' + orgnCode,
        });
    },
})