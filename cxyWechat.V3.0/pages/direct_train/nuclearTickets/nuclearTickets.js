var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        currentIndex: 0,//0检票，1查票
        vertical: true,
        indicatorDots: false,
        autoplay: false,
        // --------------------------------------
        focusTo0: false,  //是否得到焦点
        focusTo1: false,  //是否得到焦点
        abled0: false,   //装是否可以点击的
        abled1: false,   //装是否可以点击的
        nuclearNum: "",//扫码得到的值
        InputValue: "",  //装输入框的值的
        tipAppear: "",    //提示错误码是否出现 
        orgnCode: '', //机构编号
        titleTxt: '检票', //检票名称
        // typeArr: ['查票', '检票上车', '检票入园', '检票', '检票', '检票'],//输入取票码时，按钮的名称
    },
    onLoad: function (options) {
        this.setData({
            titleTxt: options.typeTxt,
            orgnCode: options.orgnCode,
        });
        wx.setNavigationBarTitle({ title: options.typeTxt });// 动态修改标题
    },
    /**
     * 切换swiper
     */
    swiperChange: function (e) {
        if (e.detail.source == 'touch') {
            var index = e.detail.current;
            this.setData({ currentIndex:  index });
            if (index == 0) {
                wx.setNavigationBarTitle({ title: this.data.titleTxt });// 动态修改标题
            } else {
                wx.setNavigationBarTitle({ title: '查票' });// 动态修改标题
            }
        }
    },
    /**
     * 输入框得到焦点
     */
    getFocus0: function () {
        this.setData({ focusTo0: true });
    },
    getFocus1: function () {
        this.setData({ focusTo1: true });
    },
    /**
     * 监听输入框
     */
    bindInput: function (e) {
        var val = e.detail.value;
        this.setData({ nuclearNum: val });
        if (val.length == 8) {
            this.nuclearTicket();//满8位自查票
        }
    },
    /**
     * 输入框失去焦点
     */
    bindBlur: function (e) {
        var val = e.detail.value;
        if (val.length == 8) {
            this.setData({ nuclearNum: e.detail.value, tipAppear: '' });
        } else {
            this.setData({ tipAppear: "票号必须是八位数字组成" })
        }
    },
    /**
     * 扫码返回值
     */
    scanCode: function () {
        var that = this;
        wx.scanCode({
            success: (res) => {
                var titleTxt = '查票';
                if (that.data.currentIndex == 0) {
                    titleTxt = that.data.titleTxt;
                }
                var str = '?nuclearNum=' + res.result + '&orgnCode=' + that.data.orgnCode + '&titleTxt=' + titleTxt;
                wx.navigateTo({
                    url: '../checkTicketResult/checkTicketResult' + str
                });
            }
        })
    },
    /**
     * 点击核验票
     */
    nuclearTicket: function () {
        var ticketNumb = this.data.nuclearNum;
        var Len = ticketNumb.length;
        var reg = new RegExp("^[a-zA-Z0-9]*$");
        if (reg.test(ticketNumb)) {
            if (Len == 8) {
                this.setData({ tipAppear: '' });
                var titleTxt = '查票';
                if (this.data.currentIndex == 0) {
                    titleTxt = this.data.titleTxt;
                    this.setData({ abled0: true });
                } else {
                    this.setData({ abled1: true });
                }
                var str = '?nuclearNum=' + ticketNumb + '&orgnCode=' + this.data.orgnCode + '&titleTxt=' + titleTxt;
                wx.navigateTo({
                    url: '../checkTicketResult/checkTicketResult' + str
                });
            } else {
                this.setData({ tipAppear: "票号必须是八位数字组成" });
            }
        } else {
            this.setData({ tipAppear: "票号格式不正确" });
        }

    },
    onShow: function () {
        this.setData({
            abled0: false,
            abled1: false
        })
    }
})