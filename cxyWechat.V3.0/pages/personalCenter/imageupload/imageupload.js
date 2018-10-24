
var util = require('../../../utils/util.js');
Page({
    data: {
        isType: '',//类型：签名，联系人
        imageList: [],//图片列表
        hidden: false,//是否隐藏image标签
        addhidden: true,//是否隐藏添加的图标
        textLength: 0,  //监听输入的文字长度
        tipShow: false, //提示是否出现
        content: "",  //装文本域的内容
        list: {},
    },
    getMessage: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/updateSig", 1, wx.getStorageSync("sessionId"), {
            "signature": that.data.content
        }, "GET", false, function (res) {
            console.log(res)
            if (res.code == 200) {
                that.setData({
                    list: res
                })
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];   //当前页面
                var prevPage = pages[pages.length - 2];  //上一个页面
                prevPage.setData({
                    shanSignTure: that.data.content //当前选择的好友名字赋值给编辑款项中的姓名临时变量
                })
                //直接调用上一个页面的setData()方法，把数据存到上一个页面即编辑款项页面中去 
                wx.setStorage({
                    key: 'signature',
                    data: that.data.content,
                })
                wx.navigateBack({})
            }
        })
    },
    // 监听文本域内容的输入
    showlength: function (e) {
        var val = e.detail.value;
        var isShow = false;
        if (val.length == 200) {
            isShow = true;
        }
        this.setData({ tipShow: isShow, textLength: val.length, content: val });
    },
    // 文本域失去鼠标焦点时得到长度
    getValue: function (e) {
        this.setData({ content: e.detail.value });
    },
    // 点击发送的时候进行图片的转换和文字的转换
    sendMessage: function (e) {
        console.log(this.data.content, this.data.isType)
        if (this.data.isType == 'autograph') {
            this.getMessage();
        }
        if (this.data.isType == 'contacts') {
            this.bindUserName();
        }
    },
    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function (options) {
        var that = this;
        this.setData({ isType: options.isType });
        if (options.isType == 'contacts') {
            wx.setNavigationBarTitle({ title: '绑定联系人' });// 动态修改标题
            that.setData({
                content: wx.getStorageSync('kkUserName'),
            })
        }
        if (options.isType == 'autograph') {
            wx.setNavigationBarTitle({ title: '签名' });// 动态修改标题
            wx.getStorage({
                key: 'signature',
                success: function (res) {
                    if (res.length != 0) {
                        that.setData({
                            content: res.data
                        })
                    }
                }
            });
        }
    },

    // 绑定联系人接口
    bindUserName: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/bindName", 1, wx.getStorageSync("sessionId"), {
            "userName": that.data.content
        }, "GET", false, function (res) {
            console.log(res);
            if (res.code == 200) {
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];   //当前页面
                var prevPage = pages[pages.length - 2];  //上一个页面
                prevPage.setData({
                    user_name: that.data.content //当前选择的好友名字赋值给编辑款项中的姓名临时变量
                });
                wx.navigateBack({})
            }
        })
    },
})