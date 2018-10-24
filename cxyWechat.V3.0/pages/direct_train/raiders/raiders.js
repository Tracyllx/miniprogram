var util = require('../../../utils/util.js');
Page({
    data: {
        thisOrgnId: '',//哪一个机构的id，针对战略合作
        list: [],
    },
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        this.getData();
    },
    getData: function () {
        var that = this;
        var pathUrl = "ztc/product/moreGuide";
        var params = {};
        if (this.data.thisOrgnId) {
            pathUrl = "ztc/product2/moreGuide";
            params.orgnId = this.data.thisOrgnId;
        }
        util.HttpRequst(true, pathUrl, 2, '', params, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var data = res.result;
                data.map(function (item, i, arr) {
                    item.labelArr = item.labels.split('、');
                });
                that.setData({ list: data });
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        })
    },
    gotoUrl: function (e) {
        var url = e.currentTarget.dataset.gotoUrl;
        if (url) {
            var str0 = '', str1 = '';
            if (url.indexOf('?') > 0) {
                str0 = url.split('?')[0];
                str1 = url.split('?')[1];
                str1 = '&name=' + str1.split('=')[0] + '&value=' + str1.split('=')[1];
                wx.navigateTo({
                    url: '../pageHtml/pageHtml?id=' + str0 + str1,
                });
            } else {
                wx.navigateTo({
                    url: '../pageHtml/pageHtml?id=' + url,
                });
            }
        }
    },
})