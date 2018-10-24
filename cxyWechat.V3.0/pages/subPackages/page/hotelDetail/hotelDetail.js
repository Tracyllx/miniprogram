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
        chooseDateDetailTime: "",//得到选中的详细日期（例2017-12-11），开始时间
        chooseDateDetailTimeEnd: "",//得到选中的详细日期（例2017-12-11），结束时间
        dateList: [],//得到日期列表
        dataDateOne: null,//得到当天的日期
        dataDateTwo: null,//得到明天的日期
        moneyOne: 0,//第一个日期的钱数
        moneyTwo: 0,//第二个日期的钱数
        ticketNumber: 1, //得到票的数量
        passengersNumber: 1,//得到下车人数
        allMoney: '0.00',//得到总价格
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
        customizeDesc: '', // 定制旅游-事由/描述
        inputFocus: false,
        hotelType: [],//酒店套房类型
        hotelDate: [],
        hotelDateList: [],
        noteIndex: 0,//购买须知、产品评价 tab index
        commentData: [],//产品评价列表
        stars: [0, 1, 2, 3, 4],//得分数组
        theProductIds: '',//所有产品的id
    },

    // 打开地图导航
    openTheMap: function () {
        console.log(this.data.hotelOrgn.location)
        if (this.data.hotelOrgn.location) {
            var location = (this.data.hotelOrgn.location).split(',');
            var locationName = this.data.gProductAddrName;
            wx.openLocation({
                latitude: Number(location[1]),
                longitude: Number(location[0]),
                name: locationName,
            });
        }
    },

    // 预览banner图片
    previewImage: function (e) {
        var imgUrls = [];
        var theType = e.currentTarget.dataset.theType;
        var currImgUrl = e.currentTarget.dataset.imgUrl;
        if (theType == 'banner') {
            imgUrls = this.data.hotelOrgn.photos;
        }
        if (theType == 'comment') {
            imgUrls = e.currentTarget.dataset.imgList;
        }
        wx.previewImage({
            current: currImgUrl, // 当前显示图片的http链接
            urls: imgUrls, // 需要预览的图片http链接列表
        })
    },

    // 景区介绍
    scenicIntro: function (e) {
        if (this.data.goToUrl) {
            wx.navigateTo({
                url: '../../../direct_train/pageHtml/pageHtml?id=' + this.data.goToUrl
            });
        }
    },

    // 是否展开购票须知
    showOrHide: function () {
        this.setData({ look: !this.data.look });
    },

    // 得到加减数目
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

    // 输入框监听输入事件
    changeInputValue: function (e) {
        var value = Number(e.detail.value);
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

    // 预订数量输入框监听
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

    // 得到输入电话号码的监听
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

    // 得到点击发送验证码
    sendCode: function () {
        var that = this, countdown = 60, timer;
        var phoneLen = this.data.phoneValue.toString().length;
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

    // 得到倒计时
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

    // 校验验证码
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

    // 在线预订
    bookTicket: function () {
        var that = this;
        var kkUserName = this.data.contactsVal;//联系人
        var phoneNumb = this.data.phoneValue;//电话号码
        var useDate, imgs = '';
        if (this.data.chooseDate < 1) {
            useDate = this.data.chooseDateDetailTime
        } else {
            useDate = wx.getStorageSync("ChoosDate");
        }
        var productId = that.data.shanProductCode;//得到产品的id
        var ticketNum = this.data.ticketNumber;//得到票的总数
        var startDate = this.data.chooseDateDetailTime;//租车开始时间
        var endDate = this.data.chooseDateDetailTimeEnd;//租车结束时间
        var payMoney = this.data.allMoney;//得到总钱数
        var hotelBuyDetail = [];//预定酒店详情
        var userId = this.data.userId;//得到用户的id
        var goAddrId = "";//上车点的id
        var goTime = "";//得到上车点时间
        var returnAddrId = "";//得到下车点
        var returnTime = "";//得到下车点时间
        var destination = "";//得到上车的目的地
        var origin = "";//得到始发地
        var agent_code = wx.getStorageSync("agent_code");//将代理商编号存起来
        var newTimer = new Date().getHours();//得到当前的时间
        var newMinus = new Date().getMinutes();//得到当前的分钟
        // 保存头图
        if (this.data.hotelOrgn.photos.length > 0) {
            imgs = this.data.hotelOrgn.photos[0];
        }
        // 联系人
        if (kkUserName == '' || kkUserName == undefined) {
            wx.showModal({
                title: '提示',
                content: '请填写联系人姓名！',
            });
            return;
        }
        // 手机号
        if ((phoneNumb != "" && that.data.sixCodeDisplay == true) || (phoneNumb != "" && that.data.sixCode != "")) {
            that.setData({ ButtonActive: false });
            that.data.hotelType.map(function (item, i, arr) {
                that.data.hotelDateList.map(function (val, j, a) {
                    if (val.check && val.productId == item.product_id) {
                        var obj = { "productName": item.product_name, "productId": val.productId, "buyNum": val.buyNum };
                        hotelBuyDetail.push(obj);
                    }
                });
            });
            const kkParams = {
                "userName": kkUserName,
                "userPhone": phoneNumb,
                "startDate": startDate,
                "endDate": endDate,
                "payMoney": payMoney,
                "buyDetail": hotelBuyDetail,//详情数组
                "agent_code": agent_code
            }
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/product/createHotelOrder", 1, that.data.shanshanSessionId, kkParams, "GET", false, function (res) {
                if (res.code == 200) {
                    that.bindName();//得到绑定的联系人
                    that.bindPhone();//得到绑定的手机号
                    that.setData({
                        sixCode: "",
                        ButtonActive: true,
                        sendCodeTip: "发送验证码",
                        sixCodeDisplay: true,
                    })
                    wx.setStorageSync("ChoosDate", useDate);
                    wx.navigateTo({
                        url: '../../../direct_trainpayResult/payResult?orderId=' + res.orderId,
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
                    that.setData({ ButtonActive: true });
                }
            })
        }
    },

    // 得到电话号码
    getUserPhone: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, that.data.shanshanSessionId, {}, "GET", true, function (res) {
            if (res.code == 200) {
                var userId = res.userInfo.userId;//得到用户的userId
                that.setData({ userId: userId });
                var shanid = res.userInfo.list;
                if (res.userInfo == null || res.userInfo == "") { } else {
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

    // 绑定联系人
    bindName: function () {
        var that = this;
        if (this.data.userName == "" || this.data.userName == null) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/bindName", 1, that.data.shanshanSessionId, { userName: that.data.contactsVal }, "GET", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },

    // 绑定电话
    bindPhone: function () {
        var that = this;
        if (this.data.userPhone == "" || this.data.userPhone == null) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/savePhone", 3, that.data.shanshanSessionId, { userPhone: that.data.phoneValue }, "POST", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },

    // 得到日期和价格
    getTimeData: function (gOrderTime) {
        var that = this;
        if (that.data.shanProductCode && that.data.shanProductCode != '') {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(false, "ztc/product/productPriceList", 2, "", { "productId": that.data.shanProductCode }, "GET", false, function (res) {
                if (res.code == 200) {
                    if (res.list.length < 2) {
                        that.setData({
                            chooseDateDetailTime: '暂无预订日期',
                            chooseDateDetailTimeEnd: '暂无预订日期',
                            ButtonActive: false, // 暂无游玩日期，不可在线预订
                        });
                    } else {
                        that.setData({
                            dateList: res.list,
                            ticketPrice: res.list[0].price,
                            chooseDateTime: res.list[0].priceDate.substr(5, 10),//第一个日期的钱数
                            chooseDateDetailTime: res.list[0].priceDate,
                            chooseDateDetailTimeEnd: res.list[1].priceDate,
                        });
                    }
                } else if (res.code == 500) {
                    wx.showModal({
                        title: '提示',
                        content: '' + res.msg
                    });
                } else {
                    console.log(res);
                }
            });
        }
    },

    // 选择更多日期
    chooseMoreDate: function (e) {
        if (this.data.shanProductCode) {
            var obj = {
                'chooseTimeType': e.currentTarget.dataset.typeIndex,
                'startTime': this.data.chooseDateDetailTime,
                'endTime': this.data.chooseDateDetailTimeEnd,
            }
            wx.setStorageSync("RENTALTIME", obj);
            wx.navigateTo({
                url: '../../../common/theDay/theDay?productId=' + this.data.shanProductCode + '&orderLimitTime=false&hotel=true&hidePrice=true',
            })
        }
    },

    // 得到当前选中的日期
    getMineChooseDate: function () { // 将选中日期中套房的价格挑选出来
        var kkAllList = this.data.hotelDate;// 每个房型的所有可用日期列表 [[{日期, 单价, id}, {...}], [...], [...]]
        var kkTypeList = this.data.hotelDateList;// [{总价, 天数, 数量, [{日期, 单价, id}, {日期, 单价, id}]}, {...}, {...}]
        var chooseArr = [];//存放每个房型已选中的日期对象
        var showModalNote = false; // “您选择的时间存在已下架产品！”弹窗提示
        if (kkAllList.length > 0) {
            var kkStart = this.data.chooseDateDetailTime;//入住时间，如：2018-02-11
            var kkEnd = this.data.chooseDateDetailTimeEnd;//离开时间，如：2018-02-12
            if (kkStart && kkEnd) {
                const stampStart = new Date(kkStart.split('-')[0], kkStart.split('-')[1] - 1, kkStart.split('-')[2]);
                const stampEnd = new Date(kkEnd.split('-')[0], kkEnd.split('-')[1] - 1, kkEnd.split('-')[2]);
                kkAllList.map(function (item1, i, arr1) { // 循环有多少个房型
                    if (item1.length > 0) {
                        if (item1[0].priceDate) {
                            //需要判断所选的入住时间是否符合每个产品？对不符合的产品进行处理
                            const stampDD = new Date(item1[0].priceDate.split('-')[0], item1[0].priceDate.split('-')[1] - 1, item1[0].priceDate.split('-')[2]);
                            if (Date.parse(stampDD) <= Date.parse(stampStart) && kkTypeList[i].dateLimitNote != '') {
                                kkTypeList[i].dateLimitNote = '';
                            } else {
                                if (Date.parse(stampDD) > Date.parse(stampStart)) {
                                    kkTypeList[i].dateLimitNote = '此产品于 ' + item1[0].priceDate + ' 才可购买';
                                }
                            }
                        }
                        if (item1[item1.length - 1].priceDate) {
                            const stampEE = new Date(item1[item1.length - 1].priceDate.split('-')[0], item1[item1.length - 1].priceDate.split('-')[1] - 1, item1[item1.length - 1].priceDate.split('-')[2]);
                            if (Date.parse(stampEE) <= Date.parse(stampEnd)) {
                                kkTypeList[i].dateLimitNote = '此产品于 ' + item1[item1.length - 1].priceDate + ' 后下架';
                                console.log(kkTypeList[i].check)
                                if (kkTypeList[i].check != false) {
                                    showModalNote = true;
                                }
                            }
                        }
                    }

                    var arr = []; // 存放每一个房型的日期
                    item1.map(function (item2, j, arr2) { // 循环每个房型的可用日期
                        const stampThis = new Date(item2.priceDate.split('-')[0], item2.priceDate.split('-')[1] - 1, item2.priceDate.split('-')[2]);
                        // 筛选出已选中的日期对象，即在入住时间-离开时间范围内 
                        if (Date.parse(stampStart) <= Date.parse(stampThis) && Date.parse(stampThis) < Date.parse(stampEnd)) {
                            arr.push(item2);
                        }
                    });
                    chooseArr.push(arr);
                });
                if (showModalNote) {
                    wx.showModal({
                        title: '提示',
                        content: '您选择的时间存在已下架产品！'
                    });
                }
                chooseArr.map(function (item1, i, arr1) {
                    // console.log(kkTypeList[i].productId, kkTypeList[i].dateLimitNote);
                    kkTypeList[i].chooseDate = item1;
                    if (item1.length == 0 || kkTypeList[i].dateLimitNote != '') {
                        kkTypeList[i].check = false;
                        kkTypeList[i].productId = null;
                        kkTypeList[i].amount = null;
                        kkTypeList[i].buyNum = 1;
                    } else {
                        var sum = 0;
                        kkTypeList[i].productId = item1[0].productId;
                        item1.map(function (item2, j, arr2) {
                            sum = sum + item2.price * kkTypeList[i].buyNum;// 产品1(当天的价格*数量) + 产品2(当天的价格*数量) + ...
                        });
                        kkTypeList[i].amount = Number(sum).toFixed(2);// 每个房型的总价
                    }
                });
                var money = 0; // 计算总计
                kkTypeList.map(function (item, i, arr) {
                    if (item.check) {
                        money = (Number(money) + Number(item.amount)).toFixed(2);
                    }
                });
                this.setData({ hotelDateList: kkTypeList, allMoney: money });
            } else {
                if (kkStart) { } else {
                    this.setData({ chooseDateDetailTime: '暂无日期' });
                }
                if (kkEnd) { } else {
                    this.setData({ chooseDateDetailTimeEnd: '暂无日期' });
                }
            }
        }
    },

    // 高德地图--获取详细地址
    getDetailedAddress: function (wuzhishanLocation) {
        var that = this;
        shanAmapFun.getRegeo({
            location: wuzhishanLocation,
            success: function (data) { // 成功回调 获取详细地址
                that.setData({ gProductAddrName: data[0].regeocodeData.formatted_address });
            },
            fail: function (info) {
                console.log(info)
            }
        });
    },

    // 获取当前详细时间，格式：2018-02-11
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var agent_code = options.agent_code;
        if (agent_code == null || agent_code == "") { } else {
            wx.setStorageSync("agent_code", agent_code);//将代理商编号存起来
        }
        this.setData({ shanshanSessionId: wx.getStorageSync("sessionId") });
        shanAmapFun = new amapFile.AMapWX({ key: 'f387407e04361890eb004cafd1c4e523' }); //高德地图key
        wx.setNavigationBarTitle({ title: '酒店详情' }); // 动态修改标题
        this.getNewTimes(); // 获取当前时间
        this.getUserPhone();//看看是否有手机号码
        this.hotelDetail(options.orgnId);
    },

    /**
     * 生命周期函数--监听页面显示
    */
    onShow: function () {
        this.getMineChooseDate();//得到更多日期的选择是什么
    },

    // 酒店选择套餐
    hotelCheck: function (e) {
        var allDate = this.data.hotelDate;
        var maxLen = allDate[0].length;
        var chooseIndex = 0, chooseNum = 0;//已选中的产品个数
        var money = this.data.allMoney;
        var list = this.data.hotelDateList;
        var index = e.currentTarget.dataset.index;
        if (list[index].amount && list[index].amount != 0) {
            list[index].check = !list[index].check;
            if (list[index].check) {
                money = (Number(money) + Number(list[index].amount)).toFixed(2);
            } else {
                money = (Number(money) - Number(list[index].amount)).toFixed(2);
            }
            this.setData({ hotelDateList: list, allMoney: money, ButtonActive: money > 0 });

            list.map(function (item, i, self) {
                if (item.check) {
                    chooseNum++;
                    if (maxLen < allDate[i].length) {
                        maxLen = allDate[i].length;
                        chooseIndex = i;
                    }
                }
            });
            if (chooseNum == 1) {
                // var allDate = this.data.hotelDate[chooseIndex];
                // var oneDate = allDate[0].priceDate;
                // var twoDate = allDate[allDate.length - 1].priceDate;
                // const stampOne = new Date(oneDate.split('-')[0], oneDate.split('-')[1] - 1, oneDate.split('-')[2]);
                // const stampTwo = new Date(twoDate.split('-')[0], twoDate.split('-')[1] - 1, twoDate.split('-')[2]);
                // console.log(allDate);
                // console.log(oneDate, twoDate);
                
                // var firstDate = this.data.chooseDateDetailTime;
                // var secondDate = this.data.chooseDateDetailTimeEnd;
                // const stampFirst = new Date(firstDate.split('-')[0], firstDate.split('-')[1] - 1, firstDate.split('-')[2]);
                // const stampSecond = new Date(secondDate.split('-')[0], secondDate.split('-')[1] - 1, secondDate.split('-')[2]);
                // console.log(firstDate, secondDate)

                // if (Date.parse(stampOne) > Date.parse(stampFirst)) {//当前选中的产品中，可选日期的第一天大于当前选择的入住时间
                //     console.log('第一天 > 入住时间');
                // }
                // if (Date.parse(stampTwo) < Date.parse(stampSecond)) {//当前选中的产品中，可选日期的最后一天小于当前选择的离开时间
                //     console.log('最后一天 < 离开时间');
                // }
                this.setData({
                    shanProductCode: list[chooseIndex].productId,
                    // chooseDateDetailTime: firstDate,
                    // chooseDateDetailTimeEnd: secondDate,
                });
            } else {
                this.setData({
                    shanProductCode: list[chooseIndex].productId,
                    // shanProductCode: this.data.kkProductCode,
                });

            }
        }
    },

    // 酒店套餐购买数量加减
    hotelOption: function (e) {
        var money = this.data.allMoney;
        var list = this.data.hotelDateList;
        var index = e.currentTarget.dataset.index;
        if (list[index].amount && list[index].amount != 0) {
            var isType = e.currentTarget.dataset.isType;
            var chooseTotal = 0; // 所选择的日期的总价
            list[index].chooseDate.map(function (item, i, arr) {
                chooseTotal = (Number(chooseTotal) + item.price).toFixed(2);
            });
            // console.log('原', list[index].amount);
            if (isType == 0 && list[index].buyNum >= 2) { // 减
                list[index].buyNum = list[index].buyNum - 1;
                list[index].amount = (Number(list[index].amount) - Number(chooseTotal)).toFixed(2);
                if (list[index].check) {
                    money = (Number(money) - Number(chooseTotal)).toFixed(2);
                }
            }
            if (isType == 1) { // 加
                list[index].buyNum = list[index].buyNum + 1;
                list[index].amount = (Number(list[index].amount) + Number(chooseTotal)).toFixed(2);
                if (list[index].check) {
                    money = (Number(money) + Number(chooseTotal)).toFixed(2);
                }
            }
            // console.log('减去/加上', chooseTotal, '后', list[index].amount);
            this.setData({ hotelDateList: list, allMoney: money });
        }
    },

    // 酒店套餐购买数量的 input
    hotelOptionInput: function (e) {
        var val = e.detail.value;
        var list = this.data.hotelDateList;
        var money = this.data.allMoney;
        var index = e.currentTarget.dataset.index;
        if (val.length > 0) {
            val = val == 0 ? 1 : val;
            if (list[index].check) { // 该项被选中
                money = (Number(money) - Number(list[index].amount)).toFixed(2); // 先减去原来的
            }
            list[index].buyNum = Number(val); // 该项数量改变
            var chooseTotal = 0; // 所选择的日期的总价
            list[index].chooseDate.map(function (item, i, arr) {
                chooseTotal = (Number(chooseTotal) + item.price).toFixed(2);
            });
            list[index].amount = (Number(val) * Number(chooseTotal)).toFixed(2);
            if (list[index].check) { // 该项被选中
                money = (Number(money) + Number(list[index].amount)).toFixed(2); // 再加上改变之后的
            }
            this.setData({ hotelDateList: list, allMoney: money });
        }
        console.log('1111', list[index].amount);
    },

    // 酒店套餐购买数量的 input blur
    hotelOptionBlur: function (e) {
        var val = e.detail.value;
        val = val.length > 0 ? val : 1;
        var list = this.data.hotelDateList;
        var money = this.data.allMoney;
        var index = e.currentTarget.dataset.index;
        if (list[index].check) { // 该项被选中
            money = (Number(money) - Number(list[index].amount)).toFixed(2); // 先减去原来的
        }
        list[index].buyNum = Number(val);
        var chooseTotal = 0; // 所选择的日期的总价
        list[index].chooseDate.map(function (item, i, arr) {
            chooseTotal = (Number(chooseTotal) + item.price).toFixed(2);
        });
        list[index].amount = (Number(val) * Number(chooseTotal)).toFixed(2);
        if (list[index].check) { // 该项被选中
            money = (Number(money) + Number(list[index].amount)).toFixed(2); // 再加上改变之后的
        }
        this.setData({ hotelDateList: list, allMoney: money });
    },

    // 酒店详情
    hotelDetail: function (orgnId) {
        var that = this;
        var thisDate = this.data.getToday;//当前日期
        console.log('当前日期：', thisDate);
        var hotelOrgn = {}, hotelList = [], note_arr = [], hotelDateList = [], hotelDate = [], maxLen = 0, kkCode = '', theProductIds = '';
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product2/hotelProductDetail", 1, wx.getStorageSync("sessionId"), { orgnId: orgnId }, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.list.length == 0) {
                    that.setData({ statusCode: res.code }); // 关闭加载动画
                    return;
                }
                var firstData = res.list[0]; // 第一条数据
                maxLen = firstData.priceList.length; // 第一条数据可用日期的长度
                kkCode = firstData.product_id; // 第一条数据可用日期对应产品id
                res.list.map(function (item, i, arr) {
                    // 所有产品的id
                    theProductIds = theProductIds + item.product_id + (i == arr.length - 1 ? '' : ',');

                    if (item.priceList.length == 0) { // 数组长度 = 0
                        var obj = { name: '', check: false, buyNum: 1, amount: null, productId: null, chooseDate: [], dateLimitNote: '' };
                    } else {
                        // console.log('id:', item.product_id, ', date length:', item.priceList.length, ', 第一个日期：', item.priceList[0].priceDate);
                        var obj = { name: item.product_name, check: false, buyNum: 1, amount: item.priceList[0].price, productId: item.priceList[0].productId, chooseDate: [item.priceList[0]], dateLimitNote: '' };
                        // 处理某个产品当天不可购买的提示
                        if (item.priceList[0].priceDate != thisDate) {
                            obj.amount = null;
                            obj.dateLimitNote = '此产品于 ' + item.priceList[0].priceDate + ' 才可购买';
                        }
                        // 处理可选日期：多个产品，默认以最长的可选日期为准
                        if (maxLen < arr[i].priceList.length) {
                            maxLen = arr[i].priceList.length;
                            kkCode = arr[i].product_id;
                        }
                    }
                    hotelDateList.push(obj); // [{总价, 天数, 数量, [{日期, 单价, id}, {日期, 单价, id}]}, {...}, {...}]
                    hotelDate.push(item.priceList); // 酒店套房的房型所有的日期价格数组
                });
                // console.log('可用日期最长的产品：id=', kkCode);
                hotelOrgn.name = firstData.orgn_name; // 酒店名
                hotelOrgn.desc = firstData.orgn_desc; // 酒店介绍
                hotelOrgn.location = firstData.product_addr; // 酒店坐标
                hotelOrgn.photos = (firstData.photos).split(','); // 酒店轮播图
                if (firstData.validity) {
                    note_arr.push({ 'detailTitle': '有效期：', 'content': firstData.validity });
                }
                if (firstData.preordain_desc) {
                    note_arr.push({ 'detailTitle': '预定说明：', 'content': firstData.preordain_desc });
                }
                if (firstData.fee_detail) {
                    note_arr.push({ 'detailTitle': '费用包含：', 'content': firstData.fee_detail });
                }
                if (firstData.instructions) {
                    note_arr.push({ 'detailTitle': '使用方法：', 'content': firstData.instructions });
                }
                if (firstData.open_time) {
                    note_arr.push({ 'detailTitle': '换票时间：', 'content': firstData.open_time });
                }
                if (firstData.get_ticket_addr) {
                    note_arr.push({ 'detailTitle': '换票地址：', 'content': firstData.get_ticket_addr });
                }
                if (firstData.refund_desc) {
                    note_arr.push({ 'detailTitle': '退款说明：', 'content': firstData.refund_desc });
                }
                if (firstData.remark) {
                    note_arr.push({ 'detailTitle': '备  注：', 'content': firstData.remark });
                }
                if (firstData.consumer_hotline) {
                    note_arr.push({ 'detailTitle': '客服电话：', 'content': firstData.consumer_hotline });
                }
                that.setData({
                    hotelType: res.list, // 酒店房型
                    hotelOrgn: hotelOrgn, // 酒店信息
                    kkProductCode: kkCode,
                    theProductIds: theProductIds,
                    shanProductCode: kkCode, // 套房产品的ID-酒店可选日期数组
                    hotelDate: hotelDate, // 酒店套房的房型所有的日期价格数组
                    hotelDateList: hotelDateList, // [{总价, 天数, 数量, [{日期, 单价, id}, {日期, 单价, id}]}, {...}, {...}]
                    gBuyTicketNote: note_arr, // 购票须知
                    gOpenTime: firstData.open_time, // 购票须知时间说明
                    gOrderTime: firstData.order_time, // 当天预订时间限制，超过则不能预订当天
                    goToUrl: firstData.goto_url ? firstData.goto_url : '', // 简介
                    gProductAttr: firstData.product_attr ? JSON.parse(firstData.product_attr) : [], // 购票须知下的 tag
                    ButtonActive: false, // 没有选择套房不能预订
                    statusCode: res.code, // 关闭加载动画
                });
                // console.log(that.data.hotelType);
                // console.log(that.data.hotelDate);
                // console.log(that.data.hotelDateList);
                // console.log(that.data.theProductIds);
                that.getDetailedAddress(firstData.product_addr); // 获取酒店详细地址
                that.getTimeData(firstData.order_time); // 得到日期列表
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
            "productId": this.data.theProductIds,
            "page": 1,
            "limit": 3
        }, "GET", true, function (res) {
            if (res.code == 200) {
                // console.log(res);
                var list = res.content.list;
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

    // 查看更多评论
    gotoComments: function () {
        wx.navigateTo({
            url: '../productComment/productComment?id=' + this.data.theProductIds,
        });
    },
})