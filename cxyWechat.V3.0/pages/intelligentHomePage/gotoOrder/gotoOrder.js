var util = require('../../../utils/util.js');
Page({
    data: {
        upSite: '',
        downSite: '',
        peopleNum: 1,
        totalPrice: '0.00',
        btnActive: false,
        hasList: '',//是否有查询结果
        searchResult: [],//查询站点结果
        isUpSite: false,//是否显示上车点查询结果
        isDownSite: false,//是否显示下车点查询结果
    },
    onLoad: function (options) {
        this.setData({ upSite: options.upSite || '' });
    },

    upInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.searchSite(val);
            this.setData({ upSite: val, isUpSite: true, isDownSite: false });
        } else {
            this.setData({ btnActive: false, totalPrice: '0.00', searchResult: [], isUpSite: false, isDownSite: false, hasList: '' });
        }
    },

    downInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.searchSite(val);
            this.setData({ downSite: val, isUpSite: false, isDownSite: true });
        } else {
            this.setData({ btnActive: false, totalPrice: '0.00', searchResult: [], isUpSite: false, isDownSite: false, hasList: '' });
        }
    },

    numInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            val = val == '0' ? 1 : val;
            this.setData({ peopleNum: val });
            this.calcFare();
        }
    },

    numOption: function (e) {
        var num = 0;
        var option = e.currentTarget.dataset.option;
        if (option == '-') {
            num = Number(this.data.peopleNum) - 1;
            if (num == 0) {
                num = 1;
            } else {
                this.setData({ peopleNum: num });
                if (this.data.upSite && this.data.downSite) {
                    this.calcFare();
                }
            }

        } else if (option == '+') {
            num = Number(this.data.peopleNum) + 1;
            this.setData({ peopleNum: num });
            if (this.data.upSite && this.data.downSite) {
                this.calcFare();
            }
        }
    },

    // 选择站点
    chooseSite: function (e) {
        var name = e.currentTarget.dataset.name;
        var theType = e.currentTarget.dataset.theType;
        if (theType == 'up') {
            this.setData({ upSite: name, isUpSite: false });
            if (this.data.downSite) {
                this.calcFare();
            }
        } else if (theType == 'down') {
            this.setData({ downSite: name, isDownSite: false });
            if (this.data.upSite) {
                this.calcFare();
            }
        }
    },

    // 查询站点
    searchSite: function (value) {
        var that = this;
        util.HttpRequst(true, "ztc/product/searchStation", 2, "", {
            'type': 1, //1：从化直通车
            'stationName': value
        }, "GET", false, function (res) {
            if (res.code == 200) {
                that.setData({ searchResult: res.list, hasList: res.list.length > 0 });
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

    // 计算乘车费用 
    calcFare: function () {
        var that = this;
        var param = {
            "upAddr": this.data.upSite,
            "downAddr": this.data.downSite,
            "peopleNum": Number(this.data.peopleNum),
        }
        // console.log(param);
        util.HttpRequst(true, "ztc/product/calcFare", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            if (res.code == 200) {
                that.setData({
                    totalPrice: Number(res.fare).toFixed(2),
                    btnActive: true
                });
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

    // 生成乘车订单
    createRideOrder: function () {
        var that = this;
        var param = {
            "upAddr": this.data.upSite,
            "downAddr": this.data.downSite,
            "peopleNum": Number(this.data.peopleNum),
            "payMoney": Number(this.data.totalPrice)
        }
        // console.log(param);
        util.HttpRequst(true, "ztc/product/createRideOrder", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            if (res.code == 200) {
                wx.navigateTo({
                    url: '../../direct_train/payResult/payResult?orderId=' + res.orderId,
                });
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
});