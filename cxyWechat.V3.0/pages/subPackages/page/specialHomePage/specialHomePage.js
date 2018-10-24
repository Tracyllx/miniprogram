var util = require('../../../../utils/util.js');
var amapFile = require('../../../../utils/amap-wx.js');
Page({
    data: {
        focusTo: false,  //是否得到焦点
        InputValue: "",  //装输入框的值的
        dataList: [], // 列表
        distanceList: [],//用于装算出来的经纬度
        distance: [],//得到距离多远
        isAll: false, //是否显示“查看所有”
        thisOrgnId: '',//哪一个机构的id
    },
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        this.getDataList();
    },

    /**
     * 个人中心
     */
    personalCenter: function () {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            wx.navigateTo({
                url: '../../../personalCenter/personalCenter?cooperationName=XMS',//香蜜山
            });
        }
    },

    // 进入详情也页购买
    gotoDetail: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            var proId = e.currentTarget.dataset.proId;
            // console.log(proId);
            wx.navigateTo({
                url: '../ticketDetail/ticketDetail?ticketcode=' + proId
            });
        }
    },

    // 搜索输入框得到焦点
    getFocus: function () {
        this.setData({ focusTo: true });
    },

    // 搜索得到输入框的值
    getInputValue: function (e) {
        this.setData({ InputValue: e.detail.value });
        console.log(e.detail.value)
    },

    // 搜索产品，得到产品列表
    searchProduct: function () {
        this.setData({ isAll: true });//显示“查看所有”
        console.log("传给后台的值：" + this.data.InputValue);
        this.getDataList(this.data.InputValue);

    },

    // 查看所有
    showAll: function () {
        this.setData({ InputValue: '', isAll: false });
        this.getDataList(this.data.InputValue);
    },

    // 打开地图
    openTheMap: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.dataList[index].location) {
            var location = (this.data.dataList[index].location).split(',');
            var locationName = this.data.dataList[index].orgnName;
            wx.openLocation({
                latitude: Number(location[1]),
                longitude: Number(location[0]),
                name: locationName,
            });
        }        
    },

    // 获取当前位置
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                that.setData({ currLat: res.latitude });//纬度
                that.setData({ currLon: res.longitude });//经度
                that.getAddr();
            }
        });
    },

    // 获取每个机构的坐标地址
    getAddr: function () {
        var that = this;
        var shanList = this.data.distanceList;
        if (shanList.length > 0 && that.data.currLat != 0) {
            for (var i = 0; i < shanList.length; i++) {
                var item = shanList[i].split(",");
                if (item[0] == null || item[1] == null) {
                    that.data.distance = that.data.distance.concat(" ");
                    that.setData({ distance: that.data.distance })
                } else {
                    that.getDistance(that.data.currLat, that.data.currLon, item[1], item[0]);
                }
            }
        }
    },

    // 根据两个经纬度得到相应的距离
    getDistance: function (lat1, lng1, lat2, lng2) {
        var radLat1 = this.Rad(lat1);
        var radLat2 = this.Rad(lat2);
        var a = radLat1 - radLat2;
        var b = Math.abs(this.Rad(lng1) - this.Rad(lng2));
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        s = s.toFixed(1);
        // console.log("距离多少米" + s);
        var list = [];
        list.push(s)
        this.setData({ distance: this.data.distance.concat(list) });
        return s;
    },

    // 根据经纬度转为三角函数
    Rad: function (d) {
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },

    // 列表数据请求
    getDataList: function (inputVal) {
        var that = this;
        var params = { "productType": 3, "orgnId": this.data.thisOrgnId };
        if (inputVal) {
            params.productOrOrgnName = inputVal;
        }
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/list", 2, "", params, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({ dataList: [] });
                var list = that.data.dataList.concat(res.list);
                var theList = [];
                for (var i = 0; i < list.length; i++) {
                    theList.push(list[i].location);
                    that.setData({ distanceList: theList });
                    if (that.data.distanceList.length == list.length) {
                        that.getLocation();//得到经纬度
                    }
                }
                that.setData({ dataList: list });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})