var util = require('../../../utils/util.js');
Page({
    data: {
        list: [],
        originList: [],//得到原始没有操作的数组
        distributionMessage: {},//得到传过来的数据
        carNum: "",//得到车的编号
        sortBy: "",//排序方式
        sortType: "",//得到升序还是降序
        sortList: [0, 1, 1, 1],//得到排序效果
    },

    /**  
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var car_details = JSON.parse(options.car_detail);
        this.setData({ distributionMessage: car_details });
        var car_no;
        if (car_no) {
            car_no = "";
        } else {
            car_no = car_details.car_no;
        }
        this.setData({ carNum: car_no });
        this.getUserData();
    },
    /**
     * 请求得到数据
     */
    getUserData: function () {
        var that = this;
        util.HttpRequst(true, "ztc/car/list", 1, wx.getStorageSync("sessionId"), {
            car_no: that.data.carNum,
            sort_by: that.data.sortBy,
            sort_type: that.data.sortType
        }, "GET", false, function (res) {
            if (res.code == 200) {
                // console.log(res)
                that.setData({ list: res.carList, originList: res.carList })
                that.getData();
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
    getData: function () {
        var that = this;
        var statusArray = [{ "status": "", "class": "ele_color1" },
        { "status": "闲", "class": "ele_color3" },
        { "status": "启", "class": "ele_color1" },
        { "status": "行", "class": "ele_color1" },
        { "status": "充", "class": "ele_color2" },
        { "status": "离", "class": "ele_color4" },
        { "status": "充", "class": "ele_color2" },]
        this.data.list.map(function (item, index) {
            var newStatus = item.status.substring(1, 2);
            item.color = statusArray[newStatus].class;
            item.shanStatus = statusArray[newStatus].status;
            if (item.energy >= 80) {
                item.eleColor = 'ele_color1';
            } else if (item.energy < 80 && item.energy >= 50) {
                item.eleColor = 'ele_color3';
            } else if (item.energy < 50 && item.energy >= 30) {
                item.eleColor = 'ele_color2';
            } else {
                item.eleColor = 'ele_color4';
            }
        })
        that.setData({ list: that.data.list, originList: that.data.list });
    },
    /**
     * 得到筛选的数据
     */
    getFilter: function (e) {
        var index = e.currentTarget.dataset.index;
        this.data.sortType = this.data.sortList[index];
        if (this.data.sortList[index] == 1) {
            this.data.sortList[index] = 0;
        } else {
            this.data.sortList[index] = 1;
        }
        this.setData({
            sortList: this.data.sortList,
            list: [],
            originList: [],
            sortBy: e.currentTarget.dataset.sort
        });
        this.getFliter();
    },
    getFliter: function () {
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        //ask是是否要进行询问授权，true为要，false为不要
        //sessionChoose为1,2,3,4,所以paramSession下标为0的则为空
        var that = this;
        console.log()
        util.HttpRequst(true, "ztc/car/list", 1, wx.getStorageSync("sessionId"), {
            car_no: that.data.carNum,
            sort_by: that.data.sortBy,
            sort_type: that.data.sortType
        }, "GET", false, function (res) {
            if (res.code == 200) {
                console.log(res)
                that.setData({ list: res.carList, originList: res.carList })
                that.getData();
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
     * 得到选中的车辆
     */
    chooseCar: function (e) {
        var index = e.currentTarget.dataset.index;
        var shanChooseStatus = this.data.list[index].selected;
        if (shanChooseStatus) {
            this.data.list[index].selected = 0;
        } else {
            this.data.list[index].selected = 1;
        }
        this.setData({ list: this.data.list })
    },
    /**
     * 确定提交选中的车辆
     */
    confirm: function () {
        var shanList = [];
        this.data.list.map(function (item, index) {
            if (item.selected == 1) {
                shanList.push(item.car_no)
            }
        })
        var lists = shanList.join(",");//转字符串
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        //ask是是否要进行询问授权，true为要，false为不要
        //sessionChoose为1,2,3,4,所以paramSession下标为0的则为空
        var that = this;
        util.HttpRequst(false, "ztc/car/allot", 3, wx.getStorageSync("sessionId"), { 
            "car_no": lists,
            "down_address_id": that.data.distributionMessage.down_address_id,
            "now_date": that.data.distributionMessage.now_date,
            "people_num": that.data.distributionMessage.total_num,
            "up_address_id": that.data.distributionMessage.up_address_id,
            "ride_time": that.data.distributionMessage.ride_time
         }, "POST", false, function (res) {
            if (res.code == 200) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.navigateBack({})
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
     * 点击取消
     */
    cancel: function () {
        this.setData({ list: this.data.originList });
        wx.navigateBack({})
    },
})