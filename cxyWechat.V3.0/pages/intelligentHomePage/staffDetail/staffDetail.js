var util = require('../../../utils/util.js');
Page({
    data: {
        checkDate: '',//当前选中的日期
        dataDetail: '',//选中的员工考勤详情
    },
    onLoad: function (options) {
        this.setData({
            checkDate: options.checkDate,
            dataDetail: wx.getStorageSync("STAFFDETAIL"),
        });
    },
})