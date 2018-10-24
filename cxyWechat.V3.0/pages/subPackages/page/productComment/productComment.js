var util = require('../../../../utils/util.js');
Page({
    data: {
        dataList: [],
        productId: '',
        page: 1,
        limit: 10,
        totalCount: 0,
        lastLoadTime: 0,
        noData: false,
        stars: [0, 1, 2, 3, 4],//得分数组
    },
    onLoad: function (options) {
        this.setData({ productId: options.id });
        this.getComments();
    },

    // 预览banner图片
    previewImage: function (e) {
        var currImgUrl = e.currentTarget.dataset.imgUrl;
        var imgUrls = e.currentTarget.dataset.imgList;
        wx.previewImage({
            current: currImgUrl, // 当前显示图片的http链接
            urls: imgUrls, // 需要预览的图片http链接列表
        });
    },

    // 获取该产品评论
    getComments: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/commentList", 1, wx.getStorageSync("sessionId"), {
            "productId": this.data.productId,
            "page": this.data.page,
            "limit": this.data.limit,
        }, "GET", true, function (res) {
            if (res.code == 200) {
                // console.log(res);
                var list = res.content.list;
                if (list.length > 0) {
                    var stars = [0, 1, 2, 3, 4];//星星评分
                    list.map(function (item, i, a) {
                        var scoreNum = (item.score + '').split('.');
                        item.starFull = scoreNum[0];//整星
                        item.starHalf = scoreNum[1] ? '0.5' : '';//半星
                        item.starNo = scoreNum[1] ? 4 - scoreNum[0] : 5 - scoreNum[0];//空星
                        if (item.photos) {
                            item.imgUrls = item.photos.split(',');
                        }
                    });
                }
                if (that.data.page == 1) {
                    that.setData({ dataList: list });
                } else {
                    list = list.concat(list);
                    that.setData({ dataList: list });
                }
                that.setData({ totalCount: res.content.totalCount });
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        });
    },

    // 下拉加载
    scrolltolower: function (e) {
        // 300ms 内多次下拉的话仅算一次
        var curTime = e.timeStamp; // 获取点击当前时间
        var lastTime = this.data.lastLoadTime; // 上一次加载的时间
        if (curTime - lastTime < 300) {
            return;
        }
        if (this.data.dataList.length >= this.data.totalCount) {
            console.log("到底了, data length: ", this.data.dataList.length);
            this.setData({ noData: true });
        } else {
            this.data.page++;
            this.setData({ page: this.data.page, noData: false });
            this.getComments();
        }
        this.setData({ lastLoadTime: curTime });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})