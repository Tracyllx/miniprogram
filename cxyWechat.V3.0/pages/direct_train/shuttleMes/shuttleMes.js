var util = require('../../../utils/util.js');
Page({
    data: {
        List: [],//信息集合
        topNumb: 0,//得到哪条下面为止
        top: 0, //得到滑动到哪里
        list:[],//得到列表
        newDate: "", //得到每条数据是否核验完的颜色变化
        content:"",//得到点击时候的内容
    },
    onLoad: function (options) {

    },
    onShow: function () {
        this.getDate();
        this.getData();
    },
    getDate: function () {
        var month = new Date().getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var str = new Date().getFullYear() + "-" + month + "-" + new Date().getDate();
        this.setData({ newDate: str });
    },
    getData: function () {
        var that = this;
        this.setData({ list: [] });
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/order/pickUpList", 1, wx.getStorageSync('sessionId'), {}, "GET",false, function (res) {
            // console.log(res)
            if (res.code == 200) {
                that.setData({ list: res.pickUpList });
                // console.log(that.data.list)
                that.data.list.map(function (item, index) {
                    item.isBlock = false;
                    var strs
                    if (item.car_no == 0 || item.car_no ==""){
                        strs = "";
                    }else{
                        strs = item.car_no.split(",");
                    }
                    item.newCarNum = strs[0];
                })
                that.setData({ list: that.data.list });
                that.setData({ topNumb: res.locationNum });//设置一共滑动多少个
                var thisTop = 40 * res.locationNum
                that.setData({ top: thisTop });
                // console.log(that.data.list)
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
     * 点击看记录
     */
    touristDetail: function (e) {
        var thisIndex = e.currentTarget.dataset.index;
        var date = this.data.newDate;//得到今天的日期
        var hours = this.data.list[thisIndex].ride_time;//得到现在是多少点多少分
        var startDes = this.data.list[thisIndex].up_address_id;//开始乘车的地点id
        var endDes = this.data.list[thisIndex].down_address_id;//下车点的id
        this.data.list.map(function (item, index) {
            item.isBlock = false;
        })
        wx.navigateTo({
            url: '../touristInformation/touristInformation?date=' + date + '&hours=' + hours + '&startDes=' + startDes + '&endDes=' + endDes + '',
        })
    },
    /**
     * 得到名字全长
     */
    getName:function(e){
        var that = this;
        var nameIndex = e.currentTarget.dataset.nameIndex;
        var stationName = nameIndex == 1 ? this.data.list[e.currentTarget.dataset.index].up_address : this.data.list[e.currentTarget.dataset.index].down_address;
        var newBlock = that.data.list[e.currentTarget.dataset.index].isBlock;
        this.data.list.map(function (item, index) {
            item.isBlock = false;
        })
        if (stationName.length > 5) {
            if (newBlock == true) {
                that.data.list[e.currentTarget.dataset.index].isBlock = false;
            } else {
                that.data.list[e.currentTarget.dataset.index].isBlock = true;
            }
        }
        this.setData({
            content: stationName,
            list:this.data.list
        })
    },
    /**
     * 分配车号
     */
    getCarNumber:function(e){
        var that = this;
        var index = e.currentTarget.dataset.index;
        var carDetail = JSON.stringify(this.data.list[index]);
        wx.navigateTo({
            url: '../carMessage/carMessage?car_detail=' + carDetail,
        })
    },
    /**
     * 用于点击详细地址这个块不产生点击事件
     */
    getNone:function(){
        //  维护者别删除，删除有影响
    },
})