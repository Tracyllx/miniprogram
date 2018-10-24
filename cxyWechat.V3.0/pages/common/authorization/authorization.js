var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        parth: '',//允许授权后的下一步
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({ parth: options.parth || '' });
    },

    onGotUserInfo: function (e) {
        var that = this;
        if (e.detail.errMsg == 'getUserInfo:ok') {
            util.newSaveUser(e.detail, function () {
                wx.setStorageSync('isNeedUserInfo', false);//已经授权，不需要再授权了
                wx.navigateBack();
            });
        } else {
            console.log('用户拒绝授权')
        }
    },

})