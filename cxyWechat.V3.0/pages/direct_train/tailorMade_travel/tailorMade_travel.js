var util = require('../../../utils/util.js');
var imgPath = util.baseUrl + 'img/direct_train/tailorMade_travel/';
Page({
    data: {
        baseUrl: util.baseUrl,
        gridData: [
            { "id": 1, "title": "团队拓展", "icon": imgPath + "icon01.png" },
            { "id": 2, "title": "公司年会", "icon": imgPath + "icon02.png" },
            { "id": 3, "title": "同学聚会", "icon": imgPath + "icon03.png" },
            { "id": 4, "title": "亲子研学", "icon": imgPath + "icon04.png" },
            { "id": 5, "title": "家庭聚会", "icon": imgPath + "icon05.png" },
            { "id": 6, "title": "旅游交友", "icon": imgPath + "icon06.png" },
            { "id": 7, "title": "特殊定制", "icon": imgPath + "icon07.png" },
        ],
    },

    goto: function (e) {
        var itemId = e.currentTarget.dataset.id;
        if (itemId == 7) { //特殊定制
            var that = this, theId = ''; //特殊定制的id
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(false, "ztc/product/customizeProductList", 1, wx.getStorageSync("sessionId"), {
                "customizeType": 7
            }, "GET", true, function (res) {
                // console.log(res);
                if (res.code == 200) {
                    var proList = res.productList;
                    if (proList.length != 0) {
                        wx.navigateTo({
                            url: '../tailorMade_detail/tailorMade_detail?isSpecial=true&ticketcode=' + proList[0].product_id
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '该产品还未上架！',
                        });
                    }
                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            });
        } else {
            wx.navigateTo({
                url: '../tailorMade_list/tailorMade_list?isType=' + itemId,
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})