// pages/direct_train/touristInformation/touristInformation.js
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        params:{},//得到需要传的参数
        list:[],//得到列表
    },
    /**
     * 得到乘客信息
     */
    getData: function () {
        var _this = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/order/pickUpDetail", 1, wx.getStorageSync("sessionId"), _this.data.params, "GET",false,function (res) {
            // console.log(res)
            if (res.code == 200) {
                _this.setData({ list: res.detailList });
            }
        })
    },
    bindPhone:function(e){
       var index = e.currentTarget.dataset.index;
       var phone = this.data.list[index].mobile_no;
       wx.makePhoneCall({
           phoneNumber: phone //仅为示例，并非真实的电话号码
       })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.params.date = options.date;
        this.data.params.rideTime = options.hours;
        this.data.params.upAddressId = options.startDes;
        this.data.params.downAddressId = options.endDes;
        this.setData({ params: this.data.params});
        this.getData();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})