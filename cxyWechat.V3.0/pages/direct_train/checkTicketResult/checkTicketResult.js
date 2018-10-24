var util = require('../../../utils/util.js');
Page({
    data: {
        isValid: null, // 是否有效
        orgnCode: null, // 机构编号
        titleTxt: '', // 标题（类型）
        nuclearNum: 0, // 检票码
        peopleNum: 0, // 检票人数
        count: 0, // 检票次数
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({ title: options.titleTxt });// 动态修改标题
        this.setData({
            orgnCode: options.orgnCode,
            titleTxt: options.titleTxt,
            nuclearNum: options.nuclearNum,
        });
        this.getResult();
    },

    /**
     * 调接口，查结果 
     */
    getResult: function () {
        var that = this;
        var kkParams = { "voucher": this.data.nuclearNum };
        if (this.data.orgnCode && this.data.orgnCode != '') {
            kkParams.orgnCode = this.data.orgnCode;
        }
        var url = 'verifyTicketInto'; // 其他检票
        if (this.data.titleTxt == '查票') {
            url = 'checkTicketInto';//查票
        }
        if (this.data.titleTxt == '检票上车') {
            url = 'verifyTicket';//直通车检票上车
        }
        // console.log(this.data.titleTxt, url);
        // console.log(kkParams);
        util.HttpRequst(true, "ztc/order/" + url, 1, wx.getStorageSync("sessionId"), kkParams, "GET", false, function (res) {
            console.log(res);
            if (res.code == 200) {
                var count = res.checkCount || res.verifyCount;
                that.setData({ count: count, peopleNum: res.peopleNum, isValid: true });
                if (that.data.titleTxt == '查票') {
                    
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '核销成功！',
                        success: function (res) { }
                    });
                }
            } else if (res.code == 500) {
                that.setData({ isValid: false });
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                that.setData({ isValid: false });
            }
        });
    },

    /**
     * 返回
     */
    returnTap: function (e) {
        wx.navigateBack();
    },

    /**
     * 继续
     */
    continueTap: function (e) {
        var that = this;
        wx.scanCode({
            success: function (res) {
                that.setData({ nuclearNum: res.result });
                that.getResult();
            }
        });
    },
})