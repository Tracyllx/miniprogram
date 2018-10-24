var util = require('../../../utils/util.js');
var count1 = 0, count2 = 0; //产品评分数，服务评分数
Page({
    data: {
        HTTPS: util.baseUrl,
        stars: [0, 1, 2, 3, 4],//得分数组
        normalSrc: '../../img/cxyMallPage/no-star.png',
        selectedSrc: '../../img/cxyMallPage/full-star.png',
        halfSrc: '../../img/cxyMallPage/half-star.png',
        key1: 0, //产品评分
        key2: 0, //服务评分
        focus: true, //获取焦点
        contentVal: '', //评论内容
        chooseImgUrls: [], //选择的图片
        chooseCount: 5, //选择图片的数量
        chooseMax: 5, //最多上传的图片数
        isAno: 1, //是否匿名
        sendBtn: false, //是否激活发表按钮
        dataParams: {},//发表需要的参数对象
    },
    onLoad: function (options) {
        var dataParams = this.data.dataParams;
        
        if (options.orgnId) {//机构id
            dataParams.orgnId = options.orgnId;

        } else if (options.orderId) {//订单id
            dataParams.orderId = options.orderId;
        }
        this.setData({ dataParams: dataParams });
    },

    //点击左边,半颗星
    selectLeft: function (e) {
        var key = e.currentTarget.dataset.key;
        var theType = e.currentTarget.dataset.theType;

        if (theType == 'product') {
            if (this.data.key1 == 0.5 && e.currentTarget.dataset.key == 0.5) {
                key = 0;//只有一颗星的时候,再次点击,变为0颗
            }
            count1 = key;
            this.setData({ key1: key });
        }
        if (theType == 'service') {
            if (this.data.key2 == 0.5 && e.currentTarget.dataset.key == 0.5) {
                key = 0; //只有一颗星的时候,再次点击,变为0颗
            }
            count2 = key;
            this.setData({ key2: key });
        }
        if (count2 != 0) {
            this.setData({ sendBtn: true });
        } else {
            this.setData({ sendBtn: false });
        }
    },

    //点击右边,整颗星
    selectRight: function (e) {
        var key = e.currentTarget.dataset.key;
        var theType = e.currentTarget.dataset.theType;

        if (theType == 'product') {
            count1 = key;
            this.setData({ key1: key });
        }
        if (theType == 'service') {
            count2 = key;
            this.setData({ key2: key });
        }
        if (count2 != 0) {
            this.setData({ sendBtn: true });
        } else {
            this.setData({ sendBtn: false });
        }
    },

    // 获取分数
    startRating: function (e) {
        wx.showModal({
            title: '分数',
            content: "产品评分：" + count1 + "，服务评分：" + count2,
        });
    },

    // 监听编辑
    bindinput: function (e) {
        var val = e.detail.value;
        this.setData({ contentVal: val });
        // if (count2 != 0 && val != '') {
        //     this.setData({ sendBtn: true });
        // } else {
        //     this.setData({ sendBtn: false });
        // }
    },

    // 选择图片
    chooseImg: function (e) {
        var that = this;
        var num = this.data.chooseCount;
        var max = this.data.chooseMax;
        var imgUrls = that.data.chooseImgUrls;
        wx.chooseImage({
            count: num, // 默认9
            sizeType: ['compressed'], // 可以指定是原图('original')还是压缩图('compressed')，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                if (imgUrls.length + tempFilePaths.length <= max) {
                    that.setData({ chooseCount: max - tempFilePaths.length });
                    that.data.chooseImgUrls = that.data.chooseImgUrls.concat(tempFilePaths); // 使用concat()来把两个数组合拼起来
                } else {
                    wx.showToast({ title: '最多能上传' + max + '张图片！', icon: 'none' });
                }
                that.setData({ chooseImgUrls: that.data.chooseImgUrls }); // 修改了数据后，一定要再次执行`this.setData()，页面才会渲染数据的。
                // console.log(that.data.chooseImgUrls);
            }
        });
    },

    // 浏览图片
    previewImg: function (e) {
        var imgList = this.data.chooseImgUrls; // 图片http链接列表
        var thisIndex = e.currentTarget.dataset.index; // 被点击图片的下标
        wx.previewImage({
            current: imgList[thisIndex], // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        });
    },

    // 匿名
    anonymousTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ isAno: index });
    },

    // 发表评论
    sendTap: function () {
        if (this.data.sendBtn == false) {
            return;
        }
        var dataParams = this.data.dataParams;
        dataParams.content = this.data.contentVal;
        dataParams.imgUrls = this.data.chooseImgUrls;
        dataParams.isAnon = this.data.isAno;
        dataParams.score = count2;
        
        if (dataParams.imgUrls.length == 0) {
            dataParams.imgUrls = '';
            this.sendFun(dataParams);
        }
        if (dataParams.imgUrls.length > 0) {
            var that = this;
            this.unloadImg(function (urls) { // 逐个上传图片，完成后发表
                dataParams.imgUrls = urls.join(',');
                that.sendFun(dataParams);
            });
        }
    },

    // 逐个上传图片
    unloadImg: function (callBack) {
        var urls = [];//图片路径
        var list = this.data.chooseImgUrls;
        wx.showLoading({ title: '图片上传中...' });//显示加载
        for (var index = 0; index < list.length; index++) {
            wx.uploadFile({
                url: util.baseUrl + 'ztc/product/uploadCommentImg',
                filePath: list[index],
                name: 'file',
                header: { "content-type": "multipart/form-data" },
                success: function (res) {
                    var response = typeof res.data == "string" ? JSON.parse(res.data) : res.data;
                    if (response.code == 200) {
                        urls.push(response.imgUrl);
                        if (urls.length == list.length) {
                            wx.hideLoading();//隐藏加载
                            callBack(urls);//当图片全部上传完，则执行callBack();
                            console.log('上传完成！');
                        }
                    } else {
                        console.log(res);
                        if (response.msg) {
                            wx.showToast({ title: '' + response.msg, icon: 'none' });
                        }
                    }
                },
                fail: function (res) {
                    console.log(res);
                }
            });
        }
    },

    // 发表
    sendFun: function (params) {
        this.setData({ sendBtn: false });
        // console.log(params);return;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/addComment", 3, wx.getStorageSync("sessionId"), params, "POST", true, function (res) {
            if (res.code == 200) {
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //上一个页面
                prevPage.setData({
                    //当前页面的变量赋值给上一个页面中同一个变量
                    commentNum: 1
                });
                wx.navigateBack();
            } else if (res.code == 500) {
                wx.showToast({ title: '' + res.msg, icon: 'none' });
            } else {
                console.log(res);
            }
        });
    },
})