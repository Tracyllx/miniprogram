var util = require('../../../../utils/util.js');
var amapFile = require('../../../../utils/amap-wx.js');
Page({
    data: {
        lat: 0,
        lng: 0,
        List: [],//得到的列表
        distanceLsit: [],//用于装算出来的经纬度
        distance: [],//得到距离多远
        look: false,//点击查看其它产品时
        focusTo: false,  //是否得到焦点
        InputValue: "",  //装输入框的值的
        appearBlock: false,//用于显示或隐藏搜索块
        searchListShow: false,//得到搜索时返回首页
        params: {},//得到要传的参数
        page: 1,//得到当前的页数
        searchList: [],
        searchNoneReturn: false,//将是否没有数据显示
        lastLoadTime: 0,//得到上一次加载的时间
        newIndex: -1,//得到当前点击的是哪个的查看更多    
        myAmapFun: "",//高德的key
        isServe: "",//判断是否有直通车服务，1是，2否
        productType: '',//判断是否是：1门票，2酒店，6美食
        isMore: '',
        thisOrgnId: '',//哪一个机构的id
    },
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        if (options.isServe) {
            this.setData({ isServe: options.isServe });
            
            if (options.isServe == 1) {
                wx.setNavigationBarTitle({ title: "直通车" });

            } else if (options.isServe == 2) {
                this.setData({ productType: options.productType });

                if (options.productType == 1) {
                    wx.setNavigationBarTitle({ title: "门 票" });

                } else if (options.productType == 2) {
                    wx.setNavigationBarTitle({ title: "酒 店" });

                } else if (options.productType == 6) {
                    wx.setNavigationBarTitle({ title: "美 食" });
                }
            }
        } else {
            this.setData({ isServe: "" });
            wx.setNavigationBarTitle({ title: "搜索结果" });
        }

        var searchvalue = "";
        var shanAmapFun = new amapFile.AMapWX({ key: 'f387407e04361890eb004cafd1c4e523' });
        this.setData({
            myAmapFun: shanAmapFun,
            InputValue: wx.getStorageSync("searchValue")
        });
        if (wx.getStorageSync("searchValue") == undefined || wx.getStorageSync("searchValue") == "") {
            searchvalue = ""
        } else {
            searchvalue = wx.getStorageSync("searchValue");
        }
        this.setData({ isMore: options.isMore ? options.isMore : '' });//更多产品
        this.getData(searchvalue);//得到数据可以渲染上页面
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
    getDistance: function (lat1, lng1, lat2, lng2) {
        var that = this;
        this.data.myAmapFun.getDrivingRoute({
            // origin: '116.481028,39.989643',
            // destination: '116.434446,39.90816',
            origin: lng1 + ',' + lat1,
            destination: lng2 + ',' + lat2,
            success: function (data) {
                var points = [];
                var list = [];

                if (data.paths[0] && data.paths[0].distance) {
                    var s = ((data.paths[0].distance) / 1000).toFixed(1);
                    list.push(s)
                    that.setData({ distance: that.data.distance.concat(list) });
                    // console.log(data.paths[0].distance + '米')
                }
                if (data.taxi_cost) {
                    // console.log('打车约' + parseInt(data.taxi_cost) + '元')
                }

            },
            fail: function (info) {

            }
        })
    },
    /**
    * 得到后台加载过来的数据
    */
    getData: function (param) {
        var url = '';
        var that = this;
        this.data.params.isServe = this.data.isServe;
        this.data.params.productOrOrgnName = this.data.InputValue;
        if (this.data.productType) {
            this.data.params.productType = this.data.productType;
        }
        this.data.params.orgnId = this.data.thisOrgnId;//查询某个机构下的产品
        this.setData({ params: this.data.params });
        if (this.data.InputValue != "") {
            this.setData({ searchListShow: true });
        }
        if (this.data.isMore && this.data.isMore == 'true') {
            url = 'listWithoutHotel';//不包括没有直通车服务的酒店产品
        } else {
            url = 'list';//所有产品
        }
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/" + url, 2, "", that.data.params, "GET", false, function (res) {
            // console.log(res.list)
            if (res.code == 200) {
                that.setData({ List: [] })
                var list = that.data.List.concat(res.list);

                var theList = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    theList.push(item.location);
                    that.setData({ distanceLsit: theList });
                    if (that.data.distanceLsit.length == list.length) {
                        that.getLocation();//得到经纬度
                    }
                }
                for (var i = 0; i < list.length; i++) {
                    list[i].isLock = false;
                    if (list[i].product.length > 2) {
                        list[i].isLock = true;
                    }
                }
                that.setData({ List: list });
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
    /**
   * 点击查看其它产品
   */
    showAllProduct: function (e) {
        var index = e.currentTarget.dataset.productIndex;
        this.data.List[index].isLock = false;
        this.setData({ List: this.data.List });
        // console.log(this.data.look)
    },
    /**
    * 搜索输入框得到焦点
    */
    getFocus: function () {
        this.setData({ focusTo: true });
    },
    /**
     * 搜索得到输入框的值
     */
    getInputValue: function (e) {
        this.setData({ InputValue: e.detail.value });
        this.getData(e.detail.value);
    },
    // 搜索产品，得到产品列表
    searchProduct: function () {
        console.log("isServe：" + this.data.isServe)
        console.log("传给后台的值：" + this.data.InputValue);
        var showValue = this.data.InputValue;
        this.getData(showValue);

    },
    /**
     * 返回首页
     */
    toHomePage: function () {
        this.setData({ InputValue: "" });
        this.setData({ page: 1 });//将数据归为第一页的
        this.setData({ searchListShow: false });//将返回首页隐藏
        this.setData({ searchNoneReturn: false });//将没有数据这个页面隐藏，数据页面显示
        this.getData(this.data.InputValue);
    },
    /**
     * 得到定位
     */
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                // console.log(latitude);
                // console.log(longitude)
                that.setData({ lat: latitude });//lat
                that.setData({ lng: longitude });//lng
                that.getAddr();//得到当前的地址
            }
        })
    },
    /**
     * 得到地址
     */
    getAddr: function () {
        var that = this;
        var shanList = this.data.distanceLsit;
        // console.log(that.data.lat + "," + that.data.lng);
        if (shanList.length > 0 && that.data.lat != 0) {
            for (var i = 0; i < shanList.length; i++) {
                var item = shanList[i].split(",");
                var locationOne = item[0];
                var locationTwo = item[1];
                if (locationOne == null || locationTwo == null) {
                    // that.data.distance.push(" ");
                    that.data.distance = that.data.distance.concat(" ")
                    that.setData({ distance: that.data.distance })
                } else {
                    // that.getDistance(that.data.lat, that.data.lng, locationTwo, locationOne);
                    that.GetDistance(that.data.lat, that.data.lng, locationTwo, locationOne);
                }
            }
        }
    },
    /**
     * 根据经纬度转为三角函数
     */
    Rad: function (d) {
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },
    /**
     * 根据两个经纬度得到相应的距离
     */
    GetDistance: function (lat1, lng1, lat2, lng2) {
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
    /**
     * 得到票的种类及票属于的景区
     */
    getTicketCodeOrgn: function (e) {
        if (wx.getStorageSync('isNeedUserInfo') == true) {
            wx.navigateTo({
                url: '../../../common/authorization/authorization',
            });
        } else {
            var ticketcode = e.currentTarget.dataset.ticketcode;
            var productName = e.currentTarget.dataset.productName;
            wx.setStorageSync("imgUrls", e.currentTarget.dataset.imgUrls);
            console.log('ticketcode', ticketcode)
            wx.navigateTo({
                url: '../ticketDetail/ticketDetail?ticketcode=' + ticketcode + '&productName=' + productName + '',
            })
        }
    },
    /**
     * 加载更多
     */
    LoadMore: function (e) {
        var that = this;
        console.log(e.timeStamp)
        var currentTime = e.timeStamp;//得到当前加载的时间
        var lastTime = this.data.lastLoadTime;//得到上一次加载的时间
        if (currentTime - lastTime < 300) {
            console.log("时间间隔太短，不能算下拉加载");
            return;
        }
        if (that.length)
            var newPage = this.data.page + 1;
        this.setData({ page: newPage })
        console.log(this.data.page)
    },
    /**
     * 打开地图
     */
    openTheMap: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.List[index].location) {
            var location = (this.data.List[index].location).split(',');
            var locationName = this.data.List[index].orgnName;
            wx.openLocation({
                latitude: Number(location[1]),
                longitude: Number(location[0]),
                name: locationName,
            });
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})