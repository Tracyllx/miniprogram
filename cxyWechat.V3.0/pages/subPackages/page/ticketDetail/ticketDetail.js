var util = require('../../../../utils/util.js');
var amapFile = require('../../../../utils/amap-wx.js');
var shanAmapFun = "";//得到高德地图
Page({
    data: {
        statusCode: 100,
        imgPaths: [],//得到图片路径
        userName: '',//绑定的联系人名
        contactsVal: '',//联系人名
        isEmptyName: false,//判断联系人名是否为空
        userPhone: "",//得到绑定的手机号
        sixCodeDisplay: false,//得到是否需要显示发送验证码
        List: [],//用于放最早可订明日票
        indicatorDots: true,
        index: 0,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        userId: "",//得到用户的userId
        remark: "",//票的中详细内容（五指山门票往返电动车成人票）
        sixCode: "",//得到六位验证码
        make: true,
        isChoose: true,//是否选中乘车
        scrollTop: 0,
        chooseDate: 0,   //选中日期
        isNoClick: false,//判断当天是否是超过17点。是则不可以点
        chooseDateTime: "",//得到选中使用时间(用于显示在页面，例12-28)
        chooseDateDetailTime: "",//得到选中的详细日期（例2017-12-11）
        dateList: [],//得到日期列表
        dataDateOne: null,//得到当天的日期
        dataDateTwo: null,//得到明天的日期
        moneyOne: 0,//第一个日期的钱数
        moneyTwo: 0,//第二个日期的钱数
        ticketNumber: 1, //得到票的数量
        passengersNumber: 1,//得到下车人数
        allMoney: 0,//得到总价格
        ticketPrice: 0,//得到票的单价
        focusTo: false,  //是否得到焦点
        isFalse: false, //是否可以点击发送验证码
        phoneValue: "",//得到电话号码
        phoneTip: "", //提示电话号码是否正确
        shanshanSessionId: "",//得到当前的sessionId
        sendCodeTip: "发送验证码", //发送验证码
        m: 60,// 倒计时
        shanProductCode: "",//得到票的编号
        chooseShultteList: [],//得到游客上下车的地方
        currentIndex: 0,//得到第一个下拉选择列表
        secondeIndex: 0,//得到第二个下拉选择列表
        thridIndex: 0,//得到第二个下拉选择列表
        fourthIndex: 0,//得到第四个下拉选择列表
        FiveIndex: 0,//得到第五个下拉选择列表
        toScenicList: [],//得到去程的上车点列表
        toAllScenicList: [],//得到上车的点所有的消息
        backToWhereList: ["沙滩公园", "德天瀑布", "通灵峡谷"],//得到下车点的数据
        backAllToWhereList: [],//得到下车点的所有信息
        toCarTime: [],//得到乘车时间
        backCarTime: [],//得到返程的时间
        showBackCarTime: [],//最终页面显示可选的日期
        fIndex: false,//得到是否选了index
        sIndex: false,
        tIndex: false,
        frIndex: false,
        ButtonActive: false,//是否将按钮设为打开
        backWhereList: false,//看看下面是否有时间选，如果有则为false没有则为true
        allNoChoose: false,//一开始上下车都可以选择
        getToday: "",//得到当前的日期
        shanDate: "",//得到更多日期选择的内容
        noChangeStops: [],//得到不变的去程下车点，返程上车点
        distanceLsit: [],//用于装算出来的经纬度
        distance: [],//得到距离多远
        isCustomTourism: false, // 定制旅游
        customizeDesc: '', // 定制旅游-事由/描述
        inputFocus: false,
        addressInfo: '',//收货地址信息
        noteIndex: 0,//购买须知、产品评价 tab index
        commentData: [],//产品评价列表
        stars: [0, 1, 2, 3, 4],//得分数组
    },
    /**
     * 预览banner图片
     */
    previewImage: function (e) {
        var imgUrls = [];
        var theType = e.currentTarget.dataset.theType;
        var currImgUrl = e.currentTarget.dataset.imgUrl;
        if (theType == 'banner') {
            imgUrls = this.data.imgPaths;
        }
        if (theType == 'comment') {
            imgUrls = e.currentTarget.dataset.imgList;
        }
        wx.previewImage({
            current: currImgUrl, // 当前显示图片的http链接
            urls: imgUrls, // 需要预览的图片http链接列表
        });
    },
    /**
     * 景区介绍
     */
    scenicIntro: function (e) {
        // console.log(this.data.goToUrl);
        if (this.data.goToUrl) {
            wx.navigateTo({
                url: '../../../direct_train/pageHtml/pageHtml?id=' + this.data.goToUrl
            });
        }
    },
    /**
     * 得到去程的上车点选择
     */
    bindPickerChange: function (e) {
        var getTapList = e.currentTarget.dataset.newIndex;//得到当前点击哪个输入框
        var currentValue = e.detail.value;//得到当前的选中值下标
        // console.log('picker发送选择改变，携带值为', e.detail.value);

        if (getTapList == 0) {//得到去程的上车地点
            if (currentValue == 0) {
                this.setData({ fIndex: false })
            } else {
                this.setData({
                    currentIndex: e.detail.value,
                    fIndex: true
                })
            }
            // console.log('得到去程的上车地点：currentIndex=', this.data.currentIndex, ',fIndex=', this.data.fIndex)
        }
        if (getTapList == 1) {//得到去程的乘车时间
            if (currentValue == 0) {
                this.setData({ sIndex: false })
            } else {
                this.setData({
                    secondeIndex: e.detail.value,
                    sIndex: true
                })
                var NewInex = Number(e.detail.value) + 1; //+ 1
                var shanlist = this.data.backCarTime.slice(NewInex, this.data.backCarTime.length);
                // console.log(shanlist);
                var list = [];
                if (shanlist.length == 0) {
                    list.push("无可选时间");
                    var shanlist = [];
                    var shanNoneList;
                    // shanlist = ["暂无可选地址"];还涉及到其他问题
                    shanNoneList = shanlist.concat(this.data.toScenicList);

                    this.setData({
                        backWhereList: true,
                        toScenicList: shanNoneList,
                        tIndex: false
                    });
                } else {
                    list.push("选择时间");
                    var shanNoneList = this.data.toScenicList;
                    if (shanNoneList[0] == "暂无可选地址") {
                        shanNoneList.splice(0, 1)
                        this.setData({ toScenicList: shanNoneList })
                    }
                    this.setData({ backWhereList: false });
                }

                var shanshanlist = list.concat(shanlist);
                this.setData({
                    showBackCarTime: shanshanlist,
                    fourthIndex: 0
                });
            }
            // console.log('得到去程的时间：secondeIndex=', this.data.secondeIndex, 'sIndex=', this.data.sIndex)
        }
        if (getTapList == 2) {//得到返程的下车地点
            if (currentValue == 0) {
                this.setData({ tIndex: false })
            } else {
                this.setData({
                    thridIndex: e.detail.value,
                    tIndex: true
                })
            }
            // console.log('得到返程的下车地点：thridIndex=', this.data.thridIndex, ',tIndex=', this.data.tIndex)
        }
        if (getTapList == 3) {//得到返程的乘车时间
            if (currentValue == 0) {
                this.setData({ frIndex: false })
            } else {
                this.setData({
                    fourthIndex: e.detail.value,
                    frIndex: true
                })
            }
            // console.log('得到返程的时间：fourthIndex=', this.data.fourthIndex, 'frIndex=', this.data.frIndex)
        }
    },
    /**
     * 得到上下车的内容
     */
    choose: function () {

        // console.log('是否选了去程地点：', this.data.fIndex, '，是否选择了去程时间：', this.data.sIndex)
        // console.log('是否选了返程地点：', this.data.tIndex, '，是否选择了返程时间：', this.data.frIndex)
        if (this.data.isChoose == false) {
            this.setData({ isChoose: true });
            // this.setData({ scrollTop: 650 });
            // console.log(this.data.toScenicList)
            if (this.data.toScenicList.length > 0) {

            } else {
                // this.goBackData();//请求得到上下车接口的数据

                var arr1 = []; // 去程-上车点、返程-下车点
                var goPointList = this.data.gUpList;
                arr1.push("选择乘车点");
                for (var i = 0; i < goPointList.length; i++) {
                    var juli = goPointList[i].distance ? goPointList[i].distance + 'km' : ''; // 判断是否有距离
                    arr1.push(goPointList[i].addrDetail + ' ' + juli);
                }
                this.setData({ toAllScenicList: goPointList });//得到上车点的所有数据
                this.setData({ toScenicList: arr1 });//得到上车乘车点列表
                // console.log('去程-上车点', this.data.toAllScenicList);

                var arr2 = [];
                var backPointList = this.data.gDownList;
                arr2.push("选择乘车点");
                for (var i = 0; i < backPointList.length; i++) {
                    var juli2 = backPointList[i].distance ? backPointList[i].distance + 'km' : ''; // 判断是否有距离
                    arr2.push(backPointList[i].addrDetail + ' ' + juli2);
                }
                this.setData({ backAllToWhereList: backPointList });//得到下车点的所有数据
                this.setData({ backToWhereList: arr2 });//得到下车乘车点列表
                // console.log('返程-下车点', this.data.backAllToWhereList);

                this.setData({ noChangeStops: backPointList });//得到不变的去程下车点，返程上车点

                //得到乘车时间
                this.getScheduleTime();//得到安排的乘车时间
            }
        } else {
            // this.setData({ scrollTop: 260 });
            this.setData({ isChoose: false });
        }
    },
    /**
     * 是否展开购票须知
     */
    showOrHide: function () {
        this.setData({ look: !this.data.look });
    },

    /**
     * 得到加减数目
     */
    changeNumber: function (e) {
        var clickIndex = Number(e.currentTarget.dataset.clickIndex);
        var plusAndminus = Number(e.currentTarget.dataset.minusPlus);
        if (plusAndminus > 0) {
            if (clickIndex == 0) {
                this.setData({ ticketNumber: this.data.ticketNumber + 1 });//得到票的数量
                this.setData({ passengersNumber: this.data.ticketNumber });//得到下车人数（一开始默认有多少张票就多少个人在终点站下车）
                var shanMoney = (this.data.ticketNumber * this.data.ticketPrice).toFixed(2);
                this.setData({ allMoney: shanMoney })
            } else {
                if (this.data.passengersNumber < this.data.ticketNumber) {
                    this.setData({ passengersNumber: this.data.passengersNumber + 1 });//得到下车人数
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '下车点人数不能多于购买的票数！',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        } else {
            if (clickIndex == 0) {
                this.setData({ ticketNumber: this.data.ticketNumber - 1 });//得到减数量
                this.setData({ passengersNumber: this.data.ticketNumber - 1 });//得到下车人数（一开始默认有多少张票就多少个人在终点站下车）
                if (this.data.ticketNumber < 1) {
                    this.setData({ ticketNumber: 1 });//得到票的数量  
                    this.setData({ passengersNumber: 1 });//得到下车人数（一开始默认有多少张票就多少个人在终点站下车）
                }
                var shanMoeny = ((this.data.ticketNumber) * this.data.ticketPrice).toFixed(2);
                this.setData({ allMoney: shanMoeny })
            } else {
                this.setData({ passengersNumber: this.data.passengersNumber - 1 });//得到下车人数
                if (this.data.passengersNumber < 1) {
                    this.setData({ passengersNumber: 1 });//得到票的数量
                }
            }
        }
    },
    /**
    * 输入框监听输入事件
    */
    changeInputValue: function (e) {
        var value = Number(e.detail.value);
        // console.log(value)
        if (e.detail.value.length > 0) {
            if (value > 0) {
                this.setData({ ticketNumber: value });

            } else if (value == 0) {
                this.setData({ ticketNumber: 1 });
            }

        }
        var shanMoeny = ((this.data.ticketNumber) * this.data.ticketPrice).toFixed(2);
        this.setData({ allMoney: shanMoeny })
    },
    getInputValue: function (e) {
        var shanValue = Number(e.detail.value);
        if (shanValue > 0) {
            this.setData({ ticketNumber: shanValue });
        } else {
            this.setData({ ticketNumber: 1 });
        }
        e.detail.value.length > 0 ? "" : this.setData({ ticketNumber: 1 });
        var shanMoeny = ((this.data.ticketNumber) * this.data.ticketPrice).toFixed(2);
        this.setData({ allMoney: shanMoeny })
    },
    // 失去焦点得到手机号码
    getBlurValue: function (e) {
        var Value = e.detail.value;
        this.setData({ phoneValue: Value });
    },
    /**
     * 得到输入电话号码的监听
     */
    getPhoneNumber: function (e) {
        var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
        var shanPhoneValue = Number(e.detail.value);
        var newValue = this.data.userPhone;//得到当前的phone
        if (shanPhoneValue == newValue) {
            this.setData({ sixCodeDisplay: true });
        } else {
            this.setData({
                sixCodeDisplay: false,
                ButtonActive: false
            });
        }
        if (e.detail.value.length == 11) {
            if (regs.test(shanPhoneValue)) {
                this.setData({ phoneTip: "" });
                this.setData({ phoneValue: shanPhoneValue });
                return;
            } else {
                this.setData({
                    phoneTip: "手机号有误，请输入正确的手机号",
                    sixCodeDisplay: false
                });
            }
        }
        if (e.detail.value.length < 11) {
            this.setData({ phoneTip: "" });
        }
    },
    /**
     * 得到点击发送验证码
     */
    sendCode: function () {
        //点击获取验证码
        var countdown = 60;
        var timer;
        var that = this;
        var phoneLen = this.data.phoneValue.toString().length;
        // console.log(this.data.phoneValue)
        if (phoneLen < 11 && phoneLen > 0) {
            this.setData({ phoneTip: "手机号有误，请输入正确的手机号" });
        } else if (phoneLen == 0) {
            this.setData({ phoneTip: "手机号不能为空" });
        } else if (phoneLen == 11) {
            if (this.data.phoneTip == "") {
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/product/sendMsgCode", 3, wx.getStorageSync("sessionId"), { "userPhone": that.data.phoneValue }, "POST", true, function (res) {
                    console.log(res)
                    if (res.code == 200) {
                        setTimeout(function () {
                            that.fun();
                        }, 1000);//倒计时
                    }
                })
            }
        }
    },
    /**
     * 得到倒计时
     */
    fun: function () {
        this.setData({ isFalse: true });
        this.setData({ sendCodeTip: "重新发送(" + this.data.m + ")" });
        this.data.m--;
        var that = this;
        if (this.data.m < 0) {
            this.setData({ isFalse: false });
            this.setData({ sendCodeTip: "发送验证码" });
            this.setData({ m: 60 });
            clearTimeout(function () {
                that.fun();
            });
        } else {
            setTimeout(function () {
                that.fun();
            }, 1000);
        }
    },
    /**
     * 校验验证码
     */
    geSixCkeckedNumber: function (e) {
        var checkNum = e.detail.value;
        var len = e.detail.value.length;
        var that = this;
        var regN = /^[0-9]$/;
        if (len == 6) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(false, "ztc/product/checkMsgCode", 4, "", { "userPhone": that.data.phoneValue, "code": checkNum }, "POST", false, function (res) {
                if (res.code == 200) {
                    that.setData({
                        sixCode: checkNum,
                        ButtonActive: true,
                        focusTo: false
                    });
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    return;
                } else {
                    var resp = res.msg;
                    wx.showToast({
                        title: resp,
                        icon: 'loading',
                        duration: 2000
                    })

                }
            })
        }
        if (len < 6) {
            this.setData({ phoneTip: "" });
        }
    },

    /**
     * 得到去程返程的数据
     */
    goBackData: function () {
        var that = this;
        //得到不可选去程的下车点和回程上车点
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/productAddr", 2, "", { "addrType": 1, "productId": that.data.shanProductCode }, "GET", false, function (res) {
            if (res.code == 200) {
                // console.log('不可选去程的下车点和回程上车点', res)
                var shanList = [];
                shanList.push("选择乘车点");
                for (var i = 0; i < res.list.length; i++) {
                    shanList.push(res.list[i].addrDetail);
                }
                that.setData({ toAllScenicList: res.list });//得到上车点的所有数据
                that.setData({ toScenicList: shanList });//得到上车乘车点列表
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        })
        //得到去程的下车点和回程上车点
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/productAddr", 2, "", { "addrType": 2, "productId": that.data.shanProductCode }, "GET", false, function (res) {
            if (res.code == 200) {
                // console.log('去程的下车点和回程上车点', res)
                var shanList = [];
                for (var i = 0; i < res.list.length; i++) {
                    shanList.push(res.list[i].addrDetail);
                }
                that.setData({ backToWhereList: shanList });//得到上车乘车点列表
                that.setData({ backAllToWhereList: res.list });//得到上车点的所有数据
            } else if (res.code == 500) {
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        })
        //得到乘车时间
        this.getScheduleTime();//得到安排的乘车时间
    },
    getScheduleTime: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/order/schedule", 2, "", { "orderDate": that.data.chooseDateDetailTime }, "GET", false, function (res) {
            if (res.code == 200) {
                // console.log('schedule', res)
                var mixList;
                if (res.times.length <= 0) {
                    that.setData({ allNoChoose: true });
                    mixList = ["无可选时间"];
                    var shanlist = ["暂无可选地址"];
                    var shanNoneList = shanlist.concat(that.data.toScenicList);
                    that.setData({ toScenicList: shanNoneList })
                } else {
                    that.setData({ allNoChoose: false });
                    mixList = ["选择时间"];
                    var shanNoneList = that.data.toScenicList;
                    if (shanNoneList[0] == "暂无可选地址") {
                        shanNoneList.splice(0, 1)
                        that.setData({ toScenicList: shanNoneList })
                    }

                }
                var list = mixList.concat(res.times);
                that.setData({
                    toCarTime: list,
                    backCarTime: list,
                    showBackCarTime: list
                });//得到乘车时间
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
    getNewTimes: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var strings = year.toString() + "-" + month + "-" + day
        this.setData({ getToday: strings });
    },
    bookTicket: function () {
        var that = this;
        var kkUserName = this.data.contactsVal;//联系人
        var phoneNumb = this.data.phoneValue;//电话号码
        var useDate;
        if (this.data.chooseDate < 1) {
            useDate = this.data.chooseDateDetailTime
        } else {
            useDate = wx.getStorageSync("ChoosDate");
        }
        var productId = that.data.shanProductCode;//得到产品的id
        var ticketNum = this.data.ticketNumber;//得到票的总数
        var payMoney = this.data.allMoney;//得到总钱数
        var userId = this.data.userId;//得到用户的id
        var goAddrId = "";//上车点的id
        var goTime = "";//得到上车点时间
        var returnAddrId = "";//得到下车点
        var returnTime = "";//得到下车点时间
        var destination = "";//得到上车的目的地
        var origin = "";//得到始发地
        var imgs = "";
        var agent_code = wx.getStorageSync("agent_code");//将代理商编号存起来
        var newTimer = new Date().getHours();//得到当前的时间
        var newMinus = new Date().getMinutes();//得到当前的分钟
        // console.log(payMoney)
        // console.log(wx.getStorageSync("ChoosDate"))
        if (this.data.imgPaths.length > 0) {
            imgs = this.data.imgPaths[0];
        }
        if (that.data.fIndex == true && that.data.sIndex == true) { // 选择了去程的地点和时间
            goAddrId = this.data.toAllScenicList[this.data.currentIndex - 1].addrId;//上车点的id
            goTime = this.data.toCarTime[this.data.secondeIndex];//得到上车点时间
            destination = this.data.backAllToWhereList[0].addrId
        } else {
            if (that.data.fIndex == false && that.data.sIndex == false) { // 没有选择去程的地点和时间

            } else { // 只选择了去程的时间，或只选择了去程的地点
                wx.showModal({
                    title: '提示',
                    content: '需要同时选择乘车时间和乘车地点才能预约电动车成功哦！',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                return;
            }
        }
        if (that.data.tIndex == true && that.data.frIndex == true) { // 选择了返程的地点和时间
            // returnAddrId = this.data.backAllToWhereList[this.data.thridIndex - 1].addrId;//得到下车点
            returnAddrId = this.data.toAllScenicList[this.data.thridIndex - 1].addrId;//得到下车点
            returnTime = this.data.showBackCarTime[this.data.fourthIndex];//得到下车点时间
            origin = this.data.backAllToWhereList[0].addrId;//得到返回的始发地 
        } else {
            if (that.data.tIndex == false && that.data.frIndex == false) { // 没有选择返程的地点和时间

            } else { // 只选择了返程的时间，或只选择了返程的地点
                wx.showModal({
                    title: '提示',
                    content: '需要同时选择乘车时间和乘车地点才能预约电动车成功哦！',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                return;
            }
        }

        // console.log('预约限制时间', this.data.gOrderTime);
        var gOrderTime = this.data.gOrderTime ? this.data.gOrderTime.split(':') : '17:30'.split(':'); // 预约限制时间 
        if (newTimer > gOrderTime[0] && this.data.getToday == useDate || (newTimer == gOrderTime[0] && newMinus > gOrderTime[1] && this.data.getToday == useDate)) {
            wx.showModal({
                title: '提示',
                content: '不可预订当天' + this.data.gOrderTime + '之后的票，请选择其他时间或票种',
                success: function (res) { }
            });
            return;
        }

        // 定制旅游
        var pathUrl = this.data.isCustomTourism ? 'createCustomizeOrder' : 'createOrder';
        if (this.data.isCustomTourism && this.data.customizeDesc == '') {
            wx.showModal({
                title: '提示',
                content: '请填写定制事由/项目描述！',
            });
            return;
        }
        // 联系人
        if (kkUserName == '' || kkUserName == undefined) {
            wx.showModal({
                title: '提示',
                content: '请填写联系人姓名！',
            });
            return;
        }
        if ((phoneNumb != "" && that.data.sixCodeDisplay == true) || (phoneNumb != "" && that.data.sixCode != "")) {
            var llkParam = {
                "userName": kkUserName,
                "userPhone": phoneNumb,
                "userId": userId,
                "useDate": useDate,
                "ticketNum": ticketNum,
                "productId": productId,
                "payMoney": payMoney,
                "goAddrId": goAddrId,
                "goTime": goTime,
                "goEndAddr": destination,
                "returnEndAddr": origin,
                "returnAddrId": returnAddrId,
                "returnTime": returnTime,
                "agent_code": agent_code,
                "customizeDesc": that.data.customizeDesc,
                "totalNum": ticketNum,
            };
            if (that.data.productType == 3) {//特产
                var addres = that.data.addressInfo;
                if (addres) {
                    llkParam.deliveryName = addres.userName;
                    llkParam.deliveryPhone = addres.telNumber;
                    llkParam.deliveryAddr = addres.allAdd;
                    llkParam.zipCode = addres.postalCode;
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请填写收货地址！',
                    });
                    return;
                }
            }
            // console.log(llkParam); return;
            console.log(useDate);
            that.setData({ ButtonActive: false });
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/product/" + pathUrl, 3, that.data.shanshanSessionId, llkParam, "POST", false, function (res) {
                // console.log('createOrder', res);
                if (res.code == 200) {
                    that.bindName();//得到绑定的联系人
                    that.bindPhone();//得到绑定的手机号
                    that.setData({
                        sixCode: "",
                        ButtonActive: true,
                        sendCodeTip: "发送验证码",
                        sixCodeDisplay: true,
                    });
                    wx.setStorageSync("ChoosDate", useDate);
                    wx.navigateTo({
                        url: '../../../direct_train/payResult/payResult?orderId=' + res.orderId,
                    });

                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            }, function () {
                if (phoneNumb != "" && that.data.sixCodeDisplay == true) {
                    that.setData({
                        ButtonActive: true
                    });
                }
            })
        }
    },
    /**
     * 得到电话号码
     */
    getUserPhone: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, that.data.shanshanSessionId, {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var userId = res.userInfo.userId;//得到用户的userId
                that.setData({ userId: userId });
                var shanid = res.userInfo.list;
                if (res.userInfo == null || res.userInfo == "") {

                } else {
                    if (res.userInfo.userPhone == undefined || res.userInfo.userPhone == "") {
                        that.setData({
                            userPhone: res.userInfo.userPhone,
                            sixCodeDisplay: false,
                        });
                    } else {
                        that.setData({
                            userName: res.userInfo.userName,
                            contactsVal: res.userInfo.userName,
                            phoneValue: res.userInfo.userPhone,
                            userPhone: res.userInfo.userPhone,
                            sixCodeDisplay: true,
                            ButtonActive: true,
                        });
                    }
                }
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
    bindName: function () {
        var that = this;
        if (this.data.userName == "" || this.data.userName == null) {
            console.log('name')
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/bindName", 1, that.data.shanshanSessionId, { userName: that.data.contactsVal }, "GET", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },
    bindPhone: function () {
        var that = this;
        if (this.data.userPhone == "" || this.data.userPhone == null) {
            console.log('phone')
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/savePhone", 3, that.data.shanshanSessionId, { userPhone: that.data.phoneValue }, "POST", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },
    /**
     * 得到日期和价格
     */
    getTimeData: function (gOrderTime) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/productPriceList", 2, "", { "productId": that.data.shanProductCode }, "GET", false, function (res) {
            if (res.code == 200) {
                // console.log(res)
                var List = res.list;
                var newTimer = new Date().getHours();//得到当前的时间
                var newMinus = new Date().getMinutes();//得到当前的分钟
                var newDate = that.data.getToday.substr(5, 10);//得到当前月+日
                var chooseTime;
                if (res.list.length == 0) {
                    that.setData({
                        ButtonActive: false, // 暂无游玩日期，不可在线预订
                    })
                } else {
                    that.setData({
                        dateList: List,
                        ticketPrice: res.list[0].price,
                        chooseDateTime: res.list[0].priceDate.substr(5, 10),//第一个日期的钱数
                        allMoney: (res.list[0].price).toFixed(2),
                        chooseDateDetailTime: res.list[0].priceDate
                    });
                    // console.log(newTimer)
                    // console.log('预约限制时间', gOrderTime);
                    let shanChooseTime = res.list[0].priceDate.substr(5, 10);
                    gOrderTime = gOrderTime ? gOrderTime.split(':') : '17:30'.split(':'); // 预约限制时间 后台传回的时间
                    if (newDate == shanChooseTime) {//如果当天是选中的时间
                        if (newTimer > gOrderTime[0] || (newMinus >= gOrderTime[1] && newTimer == gOrderTime[0])) {//超过五点半时限
                            chooseTime = res.list[1].priceDate.substr(5, 10);
                            that.setData({
                                chooseDateTime: chooseTime,
                                chooseDateDetailTime: res.list[1].priceDate,
                                chooseDate: 0,
                                ticketPrice: res.list[1].price,
                                allMoney: (res.list[1].price).toFixed(2),
                                isNoClick: true
                            });
                        } else {//没有超出五点半
                            chooseTime = res.list[0].priceDate.substr(5, 10);
                            that.setData({
                                chooseDateTime: chooseTime,
                                chooseDateDetailTime: res.list[0].priceDate,
                                ticketPrice: res.list[0].price,
                                allMoney: (res.list[0].price).toFixed(2)
                            });
                        }
                    }
                }
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
    // 得到更多日期
    chooseMoreDate: function (e) {
        this.setData({
            currentIndex: 0,//得到第一个下拉选择列表
            secondeIndex: 0,//得到第二个下拉选择列表
            thridIndex: 0,//得到第二个下拉选择列表
            fourthIndex: 0,//得到第四个下拉选择列表
            index: 0
        })
        wx.navigateTo({
            url: '../../../common/theDay/theDay?productId=' + this.data.shanProductCode + '&orderLimitTime=' + this.data.gOrderTime,
        })
    },

    /**
     * 得到当前选中的日期
     */
    getMineChooseDate: function () {
        var newTimer = new Date().getHours();//得到当前的时间
        var newMinus = new Date().getMinutes();//得到当前的分钟
        for (var i = 0; i < this.data.dateList.length; i++) {
            var priceDate = this.data.dateList[i].priceDate;
            this.setData({ shanDate: priceDate })
            if (priceDate == this.data.chooseDateDetailTime) {
                var chooseTime = this.data.dateList[i].priceDate.substr(5, 10);
                // console.log('预约限制时间', this.data.gOrderTime);
                var gOrderTime = this.data.gOrderTime ? this.data.gOrderTime.split(':') : '17:30'.split(':'); // 预约限制时间
                if (newTimer > gOrderTime[0] || newTimer == gOrderTime[0] && newMinus > gOrderTime[1]) {
                    this.setData({
                        chooseDate: 0,
                    })//得到当前选中的日期
                }
                this.setData({
                    chooseDateTime: chooseTime,
                    ticketPrice: this.data.dateList[i].price,
                    allMoney: (this.data.dateList[i].price * this.data.ticketNumber).toFixed(2)
                })
                if (this.data.isChoose) {
                    this.getScheduleTime();
                }
            }
        }
    },

    /**
     * 查询产品详情
     */
    searchProductDetail: function (localPoint) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product2/productDetail", 1, wx.getStorageSync('sessionId'), {
            "productId": that.data.shanProductCode,
            "location": localPoint
        }, "GET", true, function (res) {
            // console.log('searchProductDetail', res);
            if (res.code == 200) {
                var repDetail = res.detail;
                if (repDetail.is_serve == 2 && repDetail.product_type == 2) {
                    wx.setNavigationBarTitle({ title: '酒店详情' });// 动态修改标题
                } else if (repDetail.product_type == 3) {
                    wx.setNavigationBarTitle({ title: '特产详情' });// 动态修改标题
                } else {
                    wx.setNavigationBarTitle({ title: '门票详情' });// 动态修改标题
                }
                var note_arr = [];
                if (repDetail.validity) {
                    note_arr.push({ 'detailTitle': '有效期：', 'content': repDetail.validity });
                }
                if (repDetail.preordain_desc) {
                    note_arr.push({ 'detailTitle': '预定说明：', 'content': repDetail.preordain_desc });
                }
                if (repDetail.fee_detail) {
                    note_arr.push({ 'detailTitle': '费用包含：', 'content': repDetail.fee_detail });
                }
                if (repDetail.instructions) {
                    note_arr.push({ 'detailTitle': '使用方法：', 'content': repDetail.instructions });
                }
                if (repDetail.open_time) {
                    note_arr.push({ 'detailTitle': '换票时间：', 'content': repDetail.open_time });
                }
                if (repDetail.get_ticket_addr) {
                    note_arr.push({ 'detailTitle': '换票地址：', 'content': repDetail.get_ticket_addr });
                }
                if (repDetail.refund_desc) {
                    note_arr.push({ 'detailTitle': '退款说明：', 'content': repDetail.refund_desc });
                }
                if (repDetail.remark) {
                    note_arr.push({ 'detailTitle': '备  注：', 'content': repDetail.remark });
                }
                if (repDetail.consumer_hotline) {
                    note_arr.push({ 'detailTitle': '客服电话：', 'content': repDetail.consumer_hotline });
                }
                that.setData({
                    goToUrl: res.detail.goto_url ? res.detail.goto_url : '', // 简介
                    productType: repDetail.product_type ? repDetail.product_type : '', // 产品类型
                    isServe: repDetail.is_serve ? repDetail.is_serve : '', // 是否需要直通车服务，1：需要 2：不需要
                    remark: repDetail.product_name ? repDetail.product_name : '', //得到产品的描述
                    imgPaths: repDetail.photos ? repDetail.photos.split(',') : [], //得到图片列表
                    gProductDesc: repDetail.product_desc ? repDetail.product_desc : '',
                    gProductAddr: repDetail.product_addr ? repDetail.product_addr : '',
                    gOpenTime: repDetail.open_time ? repDetail.open_time : '',
                    gProductAttr: repDetail.product_attr ? JSON.parse(repDetail.product_attr) : [],
                    gBuyTicketNote: note_arr, // 购票须知
                    gConsumerHotline: repDetail.consumer_hotline ? repDetail.consumer_hotline : '', // 客服电话
                    gOrderTime: res.detail.order_time ? res.detail.order_time : '', // 预约限制时间
                    gUpList: res.upList ? res.upList : [], // 去程-上车点
                    gDownList: res.downList ? res.downList : [], // 返程-下车点
                })
                that.choose(); // 上下车点处理函数
                that.getTimeData(res.detail.order_time || '');//得到日期列表
                that.getDetailedAddress(repDetail.product_addr || ''); // 根据返回的坐标获取详细地址
                console.log('产品详情中的时间限制：', repDetail.order_time)
                that.setData({ statusCode: res.code });
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
     * 定位之后加载的数据
     */
    getLocationProductData: function (location) {
        var that = this;
        util.HttpRequst(false, "ztc/product2/productDetail", 1, wx.getStorageSync('sessionId'), {
            "productId": that.data.shanProductCode,
            "location": location
        }, "GET", true, function (res) {
            // console.log('getLocationProductData')
            if (res.code == 200) {
                that.setData({
                    gUpList: res.upList ? res.upList : [], // 去程-上车点
                    gDownList: res.downList ? res.downList : [], // 返程-下车点
                })
                that.choose(); // 上下车点处理函数
                if (res.detail.product_addr != '' || res.detail.product_addr != undefined) {
                    that.getTwoPointDistance(location, res.detail.product_addr); // 根据返回的坐标计算两点间的距离
                }
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
     * 查询定制旅游详情
     */
    searchCustomizeProduct: function (localPoint) {
        var that = this;
        util.HttpRequst(false, "ztc/product/customizeProduct", 1, that.data.shanshanSessionId, {}, "GET", false, function (res) {
            // console.log('searchCustomizeProduct', res);
            if (res.code == 200) {
                that.setData({
                    goToUrl: res.detail.goto_url ? res.detail.goto_url : '', // 简介
                    remark: res.detail.product_name ? res.detail.product_name : '', //得到产品的描述
                    imgPaths: res.detail.photos ? res.detail.photos.split(',') : [], //得到图片列表
                    gProductAddr: res.detail.product_addr ? res.detail.product_addr : '',
                    gOpenTime: res.detail.open_time ? res.detail.open_time : '',
                    gProductAttr: res.detail.product_attr ? JSON.parse(res.detail.product_attr) : [],
                    gBuyTicketNote: [{
                        'detailTitle': '',
                        'content': res.detail.product_desc ? res.detail.product_desc : ''
                    }],
                    ticketPrice: res.detail.orig_price ? res.detail.orig_price : '', // 价格
                    shanProductCode: res.detail.product_id ? res.detail.product_id : '', // 商品 ID
                    gOrderTime: res.detail.order_time ? res.detail.order_time : '', // 预约限制时间
                })
                that.getTimeData(res.detail.order_time || '');//得到日期列表
                that.getDetailedAddress(res.detail.product_addr || ''); // 根据返回的坐标获取详细地址
                console.log('产品详情中的时间限制：', res.detail.order_time)
                that.setData({ statusCode: res.code });
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
     * 定位之后加载的数据
     */
    getLocationCustomizeData: function (location) {
        var that = this;
        util.HttpRequst(false, "ztc/product/customizeProduct", 1, that.data.shanshanSessionId, {}, "GET", false, function (res) {
            // console.log('getLocationCustomizeData');
            if (res.code == 200) {
                if (res.detail.product_addr != '' || res.detail.product_addr != undefined) {
                    that.getTwoPointDistance(location, res.detail.product_addr); // 根据返回的坐标计算两点间的距离
                }
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

    // 定制旅游-事由/描述
    textareaInput: function (e) {
        this.setData({ customizeDesc: e.detail.value });
    },

    // 获取地理位置
    getCurrLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (wxres) {
                if (wxres.longitude && wxres.latitude) {
                    if (that.data.isCustomTourism) {
                        that.getLocationCustomizeData(wxres.longitude + ',' + wxres.latitude); // 得到坐标，查询定制旅游详情
                    } else {
                        that.getLocationProductData(wxres.longitude + ',' + wxres.latitude); // 得到坐标，查询产品详情 
                    }
                }
            },
            fail: function (wxres) {
                console.log('定位失败！！！', wxres);
            }
        })
    },

    /**
     * 高德地图--获取详细地址
     */
    getDetailedAddress: function (wuzhishanLocation) {
        if (wuzhishanLocation == '' || wuzhishanLocation == undefined) {
            this.setData({ gProductAddrName: '暂无详细地址' });
            return;
        }
        var that = this;
        shanAmapFun.getRegeo({
            location: wuzhishanLocation,
            success: function (data) {
                //成功回调 获取详细地址
                that.setData({
                    gProductAddrName: data[0].regeocodeData.formatted_address,
                });
            },
            fail: function (info) {
                //失败回调
                console.log(info)
            }
        });
    },

    /**
     * 高德地图--获取两点间距离
     */
    getTwoPointDistance: function (currLocation, destinationLocation) {
        var that = this;
        shanAmapFun.getDrivingRoute({
            origin: currLocation,
            destination: destinationLocation,
            success: function (data) {
                //成功回调 获取当前点位到目的地的距离，单位km
                var points = [];
                var list = [];
                if (data.paths[0] && data.paths[0].distance) {
                    var s = ((data.paths[0].distance) / 1000).toFixed(1);
                    list.push(s)
                    that.setData({ distance: that.data.distance.concat(list) });
                }
            },
            fail: function (info) {
                //失败回调
                console.log(info)
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
    */
    onShow: function () {
        this.getMineChooseDate();//得到更多日期的选择是什么
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var agent_code = options.agent_code;
        if (agent_code == null || agent_code == "") {

        } else {
            wx.setStorageSync("agent_code", agent_code);//将代理商编号存起来
        }
        var shanSession = wx.getStorageSync("sessionId");//得到用户sessionId
        this.setData({
            shanshanSessionId: shanSession,//写进本页面的sessionId
        });

        shanAmapFun = new amapFile.AMapWX({ key: 'f387407e04361890eb004cafd1c4e523' }); //高德地图key

        if (options.isCustomTourism != undefined && options.isCustomTourism == 'true') {
            // 定制旅游
            wx.setNavigationBarTitle({ title: '定制详情' });// 动态修改标题
            this.setData({ isCustomTourism: true });
            this.getNewTimes(); // 获取当前时间
            this.searchCustomizeProduct(''); // 查询产品详情
            this.getCurrLocation(); // 定位
            this.getUserPhone();//看看是否有手机号码
            // this.getTimeData('17:30');//得到日期列表

        } else {
            // 直通车、门票、酒店
            this.getNewTimes(); // 获取当前时间
            var ticketCode = options.ticketcode;
            this.setData({ shanProductCode: options.ticketcode });//得到产品的id
            this.searchProductDetail(''); // 查询产品详情
            this.getCurrLocation(); // 定位
            this.getUserPhone();//看看是否有手机号码
            // this.getTimeData('17:30');//得到日期列表
        }
    },

    // 联系人名：失去焦点时
    bindBlurName: function (e) {
        const val = e.detail.value;
        this.setData({ contactsVal: val });
    },

    // 联系人名：监听时
    bindInputName: function (e) {
        const val = e.detail.value;
        if (val == '') {
            this.setData({ isEmptyName: true });
        } else {
            this.setData({ isEmptyName: false });
        }
        this.setData({ contactsVal: val });
    },

    // 打开地图导航
    openTheMap: function () {
        if (this.data.gProductAddr) {
            var location = this.data.gProductAddr.split(',');
            var locationName = this.data.gProductAddrName;
            wx.openLocation({
                latitude: Number(location[1]),
                longitude: Number(location[0]),
                name: locationName,
            });
        }
    },

    // 编辑收货地址
    edictAddress: function () {
        var winH = '';
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                winH = res.windowHeight;
            },
        });
        console.log('llll')
        wx.chooseAddress({
            success: function (res) {
                res.allAdd = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                that.setData({ addressInfo: res, scrollTop: winH - 44 });
            }
        });
    },

    // 购买须知、产品评价 tab
    llkNoteTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ noteIndex: index });
        if (index == 1) {
            this.getComments();
        }
    },

    // 获取该产品评论
    getComments: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/commentList", 1, wx.getStorageSync("sessionId"), {
            "productId": this.data.shanProductCode,
            "page": 1,
            "limit": 3
        }, "GET", true, function (res) {
            if (res.code == 200) {
                var list = res.content.list;
                // console.log(list);
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
                that.setData({ commentData: list });
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

    // 查看更多评论direct_train/
    gotoComments: function () {
        wx.navigateTo({
            url: '../productComment/productComment?id=' + this.data.shanProductCode,
        });
    },
})