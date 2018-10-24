var util = require('../../../utils/util.js');
Page({
    data: {
        statusCode: 100,
        defaultImg: '../../img/cxyMallPage/defaultImg.png',
        carImg: util.baseUrl + 'img/direct_train/takeACar/tag_car.png',
        personImg: util.baseUrl + 'img/direct_train/takeACar/tag_person.png',
        // -------------------------------------------------------------------------
        getToday: "",//得到当前的日期
        ButtonActive: true,//是否将按钮设为打开
        chooseDateDetailTime: "",//得到选中的详细日期（例2017-12-11），开始时间
        chooseDateDetailTimeEnd: "",//得到选中的详细日期（例2017-12-11），结束时间
        rentalDays: 1, // 租车天数，如果不选择日期，默认当天（即租车天数为1天）
        ticketNumber: 1, //租车数量
        allMoney: 0,//得到总价格
        ticketPrice: 0,//得到票的单价
        luAddress: false, // 上车地点选项是否展开
        luAddressInput: false, // 手动输入上车地点
        addressFocus: false, // 获取焦点
        addressValue: '从化五指山景区', // 上车地点输入框值
        luAddressItem: '从化五指山景区', //保存上一次选择的地点
        luAddressData: [
            { 'name': '从化五指山景区', 'tip': '' },
            { 'name': '广州番禺市桥东环路', 'tip': '' },
        ],
        chooseRentalID: '', // 1:半日租，2:日租，3:月租
        rentalHalf: 4,//半日租 4小时
        beginTime: '',//开始时分秒
        finishTime: '',//结束时分秒
        pickerStart: '',//半日租：选择时间的最早可选时间
        halfDayPrice: 0,//半日租价格
        dayPrice: 0,//日租价格
        monthPrice: 0,//月租价格
        monthCount: 1,//月租的月数
        // ------------ 联系人模块 --------------------------
        userName: '',//绑定的联系人名
        contactsVal: '',//联系人名
        isEmptyName: false,//判断联系人名是否为空
        userPhone: "",//得到绑定的手机号
        sixCodeDisplay: false,//得到是否需要显示发送验证码
        sixCode: "",//得到六位验证码
        sendCodeTip: "发送验证码", //发送验证码
        m: 60,// 倒计时
        focusTo: false,  //是否得到焦点
        isFalse: false, //是否可以点击发送验证码
        phoneValue: "",//得到电话号码
        phoneTip: "", //提示电话号码是否正确
        // ------------ 车型 --------------------------
        imgUrls: [
            util.baseUrl + 'img/intelligentTraffic/zc_type.png',
            util.baseUrl + 'img/intelligentTraffic/zc_type.png',
        ],
        slideCurrent: 0,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
    },
    onShow: function () {
        this.getMineChooseDate();//得到更多日期的选择是什么
    },
    onLoad: function (options) {
        this.setData({ chooseRentalID: options.theType });
        this.getNewTimes(); // 获取当前时间
        this.getRentalDetail();//获取详情
        this.getUserPhone();//获取手机号
    },

    // 租车详情
    zcDetail: function () {
        wx.navigateTo({
            url: '../zcDetail/zcDetail',
        });
    },

    // 车型 - 点击左右箭头
    carModelOption: function (e) {
        var index = this.data.slideCurrent;
        var option = e.currentTarget.dataset.option;
        if (option == 'prev') {
            index = index - 1 < 0 ? 0 : index - 1;
        } else if (option == 'next') {
            index = index + 1 > this.data.imgUrls.length - 1 ? this.data.imgUrls.length - 1 : index + 1;
        }
        this.setData({ slideCurrent: index });
    },

    // 获取当前时间
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

    // 查询租车详情
    getRentalDetail: function () {
        var that = this;
        util.HttpRequst(true, "ztc/product/rentProduct", 1, wx.getStorageSync("sessionId"), {}, "GET", false, function (res) {
            // console.log('rentProduct', res);
            if (res.code == 200) {
                if (res.list.length > 0) {
                    var list = res.list[0];
                    that.setData({ rentProductId: list.product_id });
                    var theRentPrice = list.rentPrice ? list.rentPrice : [];
                    if (theRentPrice.length > 0) {
                        theRentPrice.map(function (item, i, a) {
                            // 价格(默认半日租)，半日租价格
                            item.type == 1 ? that.setData({ ticketPrice: item.price, halfDayPrice: item.price }) : '';
                            // 日租价格
                            item.type == 2 ? that.setData({ dayPrice: item.price }) : '';
                            // 月租价格
                            item.type == 3 ? that.setData({ monthPrice: item.price }) : '';
                        });
                    }
                    that.getTimeData();//得到日期列表
                    if (that.data.chooseRentalID) {
                        that.chooseRentalTap();//根据对应的租车类型显示
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
        });
    },

    // 获取日期列表
    getTimeData: function () {
        if (this.data.ticketPrice == 0) {
            this.setData({ ButtonActive: false });
        }
        const now = new Date();
        const newTimer = now.getHours() <= 9 ? '0' + now.getHours() : now.getHours();//得到当前的时间
        const newMinus = now.getMinutes() <= 9 ? '0' + now.getMinutes() : now.getMinutes();//得到当前的分钟
        this.setData({
            allMoney: (this.data.ticketPrice * this.data.ticketNumber * this.data.rentalDays).toFixed(2),
            chooseDateDetailTime: this.data.getToday,
            chooseDateDetailTimeEnd: this.data.getToday,
            pickerStart: Number(newTimer) < 8 ? '08:00' : (newTimer + ':' + newMinus),//最早 8:00
            beginTime: Number(newTimer) < 8 ? '08:00' : (newTimer + ':' + newMinus),//最早 8:00
            finishTime: Number(newTimer) < 8 ? '12:00' : (Number(newTimer) + this.data.rentalHalf) + ':' + newMinus,
        });
    },

    // 租车月数
    monthCountInput: function (e) {
        var rentDays = 1 * this.data.ticketNumber;
        var value = Number(e.detail.value);
        if (e.detail.value.length > 0) {
            if (value > 0) {
                this.setData({ monthCount: value });
            } else if (value == 0) {
                this.setData({ monthCount: 1 });
            }
        }
        var shanMoeny = (this.data.monthCount * this.data.monthPrice * rentDays).toFixed(2);
        this.setData({ allMoney: shanMoeny })

        const theDate = this.data.chooseDateDetailTime;
        const newTheDate = new Date(theDate.split('-')[0], theDate.split('-')[1] - 1, theDate.split('-')[2]);
        //时间戳 + 毫秒数 * 秒数 * 分数 * 一天24小时 * 天数 (往后推30天，前后算两天)
        const delay = newTheDate.getTime() + 1000 * 60 * 60 * 24 * 30 * this.data.monthCount;
        const jianyiDay = new Date(delay).getTime() - 1000 * 60 * 60 * 24;//减去一天
        const year = new Date(jianyiDay).getFullYear();
        const month = (new Date(jianyiDay).getMonth() + 1) <= 9 ? '0' + (new Date(jianyiDay).getMonth() + 1) : (new Date(jianyiDay).getMonth() + 1);
        const day = new Date(jianyiDay).getDate() <= 9 ? '0' + new Date(jianyiDay).getDate() : new Date(jianyiDay).getDate();
        this.setData({
            chooseDateDetailTimeEnd: year + '-' + month + '-' + day,
        })
    },
    monthCountBlur: function (e) {
        var rentDays = 1 * this.data.ticketNumber;
        var shanValue = Number(e.detail.value);
        if (shanValue > 0) {
            this.setData({ monthCount: shanValue });
        } else {
            this.setData({ monthCount: 1 });
        }
        e.detail.value.length > 0 ? "" : this.setData({ monthCount: 1 });
        var shanMoeny = (this.data.monthCount * this.data.monthPrice * rentDays).toFixed(2);
        this.setData({ allMoney: shanMoeny });

        const theDate = this.data.chooseDateDetailTime;
        const newTheDate = new Date(theDate.split('-')[0], theDate.split('-')[1] - 1, theDate.split('-')[2]);
        //时间戳 + 毫秒数 * 秒数 * 分数 * 一天24小时 * 天数 (往后推30天，前后算两天)
        const delay = newTheDate.getTime() + 1000 * 60 * 60 * 24 * 30 * this.data.monthCount;
        const jianyiDay = new Date(delay).getTime() - 1000 * 60 * 60 * 24;//减去一天
        const year = new Date(jianyiDay).getFullYear();
        const month = (new Date(jianyiDay).getMonth() + 1) <= 9 ? '0' + (new Date(jianyiDay).getMonth() + 1) : (new Date(jianyiDay).getMonth() + 1);
        const day = new Date(jianyiDay).getDate() <= 9 ? '0' + new Date(jianyiDay).getDate() : new Date(jianyiDay).getDate();
        this.setData({
            chooseDateDetailTimeEnd: year + '-' + month + '-' + day,
        })
    },

    // 租车月数加减
    monthCountOption: function (e) {
        var rentDays = 1 * this.data.ticketNumber;

        var clickIndex = Number(e.currentTarget.dataset.clickIndex);
        var plusAndminus = Number(e.currentTarget.dataset.minusPlus);

        if (plusAndminus > 0) {
            this.setData({ monthCount: this.data.monthCount + 1 });//得到票的数量
            var shanMoney = (this.data.monthCount * this.data.monthPrice * rentDays).toFixed(2);
            this.setData({ allMoney: shanMoney });

        } else {
            this.setData({ monthCount: this.data.monthCount - 1 });//得到减数量
            if (this.data.monthCount < 1) {
                this.setData({ monthCount: 1 });//得到票的数量  
            }
            var shanMoeny = (this.data.monthCount * this.data.monthPrice * rentDays).toFixed(2);
            this.setData({ allMoney: shanMoeny });
        }

        const theDate = this.data.chooseDateDetailTime;
        const newTheDate = new Date(theDate.split('-')[0], theDate.split('-')[1] - 1, theDate.split('-')[2]);
        //时间戳 + 毫秒数 * 秒数 * 分数 * 一天24小时 * 天数 (往后推30天，前后算两天)
        const delay = newTheDate.getTime() + 1000 * 60 * 60 * 24 * 30 * this.data.monthCount;
        const jianyiDay = new Date(delay).getTime() - 1000 * 60 * 60 * 24;//减去一天
        const year = new Date(jianyiDay).getFullYear();
        const month = (new Date(jianyiDay).getMonth() + 1) <= 9 ? '0' + (new Date(jianyiDay).getMonth() + 1) : (new Date(jianyiDay).getMonth() + 1);
        const day = new Date(jianyiDay).getDate() <= 9 ? '0' + new Date(jianyiDay).getDate() : new Date(jianyiDay).getDate();
        this.setData({
            chooseDateDetailTimeEnd: year + '-' + month + '-' + day,
        })
    },

    // 选时间
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var val = e.detail.value;
        this.setData({
            beginTime: val,
            finishTime: (Number(val.split(':')[0]) + this.data.rentalHalf) + ':' + val.split(':')[1],
        });
    },

    // 选择半日租、日租、月租
    chooseRentalTap: function (e) {
        var rentDays = 0, id = '';
        if (e) {
            id = e.currentTarget.dataset.index;
            this.setData({ chooseRentalID: id });
        } else {
            id = this.data.chooseRentalID;
        }
        if (id == 1) {//半日租
            rentDays = 1;
            const now = new Date();
            const newTimer = now.getHours() <= 9 ? '0' + now.getHours() : now.getHours();//得到当前的时间
            const newMinus = now.getMinutes() <= 9 ? '0' + now.getMinutes() : now.getMinutes();//得到当前的分钟
            this.setData({
                ticketPrice: this.data.halfDayPrice,
                allMoney: (this.data.ticketNumber * this.data.halfDayPrice * rentDays).toFixed(2),
                pickerStart: newTimer + ':' + newMinus,
                beginTime: newTimer + ':' + newMinus,
                finishTime: (Number(newTimer) + this.data.rentalHalf) + ':' + newMinus,
                chooseDateDetailTimeEnd: this.data.chooseDateDetailTime,
            });

        } else if (id == 2) {//日租
            rentDays = this.data.rentalDays;
            // console.log(this.data.ticketNumber, this.data.dayPrice, rentDays);
            this.setData({
                ticketPrice: this.data.dayPrice,
                allMoney: (this.data.ticketNumber * this.data.dayPrice * rentDays).toFixed(2),
                pickerStart: '',
                beginTime: '',
                finishTime: '',
                chooseDateDetailTimeEnd: this.data.llkRentalThree ? this.data.llkRentalThree : this.data.chooseDateDetailTime,
            });

        } else if (id == 3) {//月租
            rentDays = 1 * this.data.monthCount;
            const theDate = this.data.chooseDateDetailTime;
            const newTheDate = new Date(theDate.split('-')[0], theDate.split('-')[1] - 1, theDate.split('-')[2]);
            //时间戳 + 毫秒数 * 秒数 * 分数 * 一天24小时 * 天数 (往后推30天，前后算两天)
            const delay = newTheDate.getTime() + 1000 * 60 * 60 * 24 * 30 * this.data.monthCount;
            const jianyiDay = new Date(delay).getTime() - 1000 * 60 * 60 * 24;//减去一天
            const year = new Date(jianyiDay).getFullYear();
            const month = (new Date(jianyiDay).getMonth() + 1) <= 9 ? '0' + (new Date(jianyiDay).getMonth() + 1) : (new Date(jianyiDay).getMonth() + 1);
            const day = new Date(jianyiDay).getDate() <= 9 ? '0' + new Date(jianyiDay).getDate() : new Date(jianyiDay).getDate();
            this.setData({
                ticketPrice: this.data.monthPrice,
                allMoney: (this.data.ticketNumber * this.data.monthPrice * rentDays).toFixed(2),
                pickerStart: '',
                beginTime: '',
                finishTime: '',
                chooseDateDetailTimeEnd: year + '-' + month + '-' + day,
            });
        }
        // console.log(rentDays, '数量：' + this.data.ticketNumber, '价格：' + this.data.ticketPrice, '月数：' + this.data.monthCount);
    },

    // 展开上车地点选项
    showAddressData: function () {
        this.setData({ luAddress: !this.data.luAddress });
    },

    // 手动输入上车地点
    addressWrite: function () {
        this.setData({ luAddressInput: true, addressFocus: true, addressValue: '' });
    },

    // 上车地点输入框失去焦点
    addressInputBlur: function (e) {
        var val = e.detail.value;
        if (val == '') {
            // val = this.data.luAddressData[0].name;
            val = this.data.luAddressItem;
        }
        this.setData({ luAddressInput: false, addressFocus: false, addressValue: val });
    },

    // 上车地点输入框监听
    addressInput: function (e) {
        var val = e.detail.value;
        this.setData({ addressValue: val });
    },

    // 点击上车地点
    addItemTap: function (e) {
        var name = e.currentTarget.dataset.name;
        this.setData({ luAddress: false, addressValue: name, luAddressItem: name });
    },

    // 得到加减数目
    changeNumber: function (e) {
        var rentDays = 0;
        if (this.data.chooseRentalID == 1) {
            rentDays = 1;
        }
        if (this.data.chooseRentalID == 2) {
            rentDays = this.data.rentalDays;
        }
        if (this.data.chooseRentalID == 3) {
            rentDays = 1 * this.data.monthCount;
        }
        var clickIndex = Number(e.currentTarget.dataset.clickIndex);
        var plusAndminus = Number(e.currentTarget.dataset.minusPlus);
        if (plusAndminus > 0) {
            this.setData({ ticketNumber: this.data.ticketNumber + 1 });//得到票的数量
            var shanMoney = (this.data.ticketNumber * this.data.ticketPrice * rentDays).toFixed(2);
            this.setData({ allMoney: shanMoney });
        } else {
            this.setData({ ticketNumber: this.data.ticketNumber - 1 });//得到减数量
            if (this.data.ticketNumber < 1) {
                this.setData({ ticketNumber: 1 });//得到票的数量  
            }
            var shanMoeny = (this.data.ticketNumber * this.data.ticketPrice * rentDays).toFixed(2);
            this.setData({ allMoney: shanMoeny });
        }
    },

    // 输入框监听输入事件
    changeInputValue: function (e) {
        var rentDays = 0;
        if (this.data.chooseRentalID == 1) {
            rentDays = 1;
        }
        if (this.data.chooseRentalID == 2) {
            rentDays = this.data.rentalDays;
        }
        if (this.data.chooseRentalID == 3) {
            rentDays = 1 * this.data.monthCount;
        }
        var value = Number(e.detail.value);
        if (e.detail.value.length > 0) {
            if (value > 0) {
                this.setData({ ticketNumber: value });

            } else if (value == 0) {
                this.setData({ ticketNumber: 1 });
            }

        }
        var shanMoeny = (this.data.ticketNumber * this.data.ticketPrice * rentDays).toFixed(2);
        this.setData({ allMoney: shanMoeny })
    },
    getInputValue: function (e) {
        var rentDays = 0;
        if (this.data.chooseRentalID == 1) {
            rentDays = 1;
        }
        if (this.data.chooseRentalID == 2) {
            rentDays = this.data.rentalDays;
        }
        if (this.data.chooseRentalID == 3) {
            rentDays = 1 * this.data.monthCount;
        }
        var shanValue = Number(e.detail.value);
        if (shanValue > 0) {
            this.setData({ ticketNumber: shanValue });
        } else {
            this.setData({ ticketNumber: 1 });
        }
        e.detail.value.length > 0 ? "" : this.setData({ ticketNumber: 1 });
        var shanMoeny = (this.data.ticketNumber * this.data.ticketPrice * rentDays).toFixed(2);
        this.setData({ allMoney: shanMoeny })
    },

    // 选择更多日期
    chooseMoreDate: function (e) {
        var chooseID = this.data.chooseRentalID;
        var typeIndex = e.currentTarget.dataset.typeIndex;
        var obj = {
            'chooseTimeType': typeIndex,
            'startTime': this.data.chooseDateDetailTime,
            'endTime': this.data.chooseDateDetailTimeEnd,
        }
        wx.setStorageSync("RENTALTIME", obj);
        var str = '';
        if ((chooseID == 1 && typeIndex == 1) || (chooseID == 2) || (chooseID == 3 && typeIndex == 1)) {
            if (chooseID == 1 && typeIndex == 1) {//半日租
                str = '&month=false';
            }
            if (chooseID == 3 && typeIndex == 1) {//月租
                str = '&month=' + this.data.monthCount
            }
            wx.navigateTo({
                url: '../../common/theDay/theDay?llkUnlimited=true&orderLimitTime=false&hidePrice=true' + str,
            });
        }
    },

    // 从日历中得到当前选中的日期
    getMineChooseDate: function () {
        var chooseType = this.data.chooseRentalID;// 1半日租，2日租，3月租
        if (chooseType == 1) {
            this.setData({ rentalDays: 1 });
            if (this.data.chooseDateDetailTime != this.data.getToday) { //开始时间不是当天，时间从 08:00 开始
                this.setData({
                    pickerTime: '08:00',
                    pickerStart: '08:00',
                    beginTime: '08:00',
                    finishTime: '12:00',
                });
            } else {//开始时间是当天，时间从当前开始
                const now = new Date();
                const newTimer = now.getHours() <= 9 ? '0' + now.getHours() : now.getHours();//得到当前的时间
                const newMinus = now.getMinutes() <= 9 ? '0' + now.getMinutes() : now.getMinutes();//得到当前的分钟
                this.setData({
                    pickerTime: newTimer + ':' + newMinus,
                    pickerStart: newTimer + ':' + newMinus,
                    beginTime: newTimer + ':' + newMinus,
                    finishTime: (Number(newTimer) + this.data.rentalHalf) + ':' + newMinus,
                });
            }
        }
        if (chooseType == 2) {
            this.setData({
                allMoney: (this.data.dayPrice * this.data.ticketNumber * this.data.rentalDays).toFixed(2),
                llkRentalThree: this.data.chooseDateDetailTimeEnd
            });
        }
        if (chooseType == 3) {
            this.setData({
                rentalDays: 1,
                allMoney: (this.data.monthPrice * this.data.ticketNumber * 1 * this.data.monthCount).toFixed(2),
            });
        }
    },

    // 得到电话号码
    getUserPhone: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
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
            console.log('name')
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/bindName", 1, wx.getStorageSync("sessionId"), { userName: that.data.contactsVal }, "GET", false, function (res) {
                if (res.code == 200) { }
            })
        }
    },

    // 绑定手机号
    bindPhone: function () {
        var that = this;
        if (this.data.userPhone == "" || this.data.userPhone == null) {
            console.log('phone')
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/user/savePhone", 3, wx.getStorageSync("sessionId"), { userPhone: that.data.phoneValue }, "POST", false, function (res) {
                if (res.code == 200) { }
            })
        }
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
            this.setData({
                sixCodeDisplay: true,
                ButtonActive: true
            });
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
        //点击获取验证码
        var countdown = 60;
        var timer;
        var that = this;
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
        var productId = this.data.rentProductId;
        var kkUserName = this.data.contactsVal;//联系人
        var phoneNumb = this.data.phoneValue;//电话号码
        var useDate = '';
        if (this.data.chooseDate < 1) {
            useDate = this.data.chooseDateDetailTime
        } else {
            useDate = wx.getStorageSync("ChoosDate");
        }
        var ticketNum = this.data.ticketNumber;//得到票的总数
        var startDate = this.data.chooseDateDetailTime;//租车开始时间
        var endDate = this.data.chooseDateDetailTimeEnd;//租车结束时间
        var payMoney = this.data.allMoney;//得到总钱数
        var rentType = this.data.chooseRentalID;//租车类型：1半日租，2日租，3月租
        var upAddr = this.data.addressValue;//上车地点
        var rentDesc = this.data.customizeDesc;
        var agent_code = wx.getStorageSync("agent_code");//将代理商编号存起来
        // 半日租时间格式
        if (rentType == 1) {
            startDate = startDate + ' ' + this.data.beginTime;
            endDate = endDate + ' ' + this.data.finishTime;
        }
        // 租车事由
        // if (rentDesc == '') {
        //     wx.showModal({
        //         title: '提示',
        //         content: '请填写租车事由/项目描述！',
        //     });
        //     return;
        // }
        // 联系人
        if (kkUserName == '' || kkUserName == undefined) {
            wx.showModal({
                title: '提示',
                content: '请填写联系人姓名！',
            });
            return;
        }
        // 手机号
        if ((phoneNumb != "" && this.data.sixCodeDisplay == true) || (phoneNumb != "" && this.data.sixCode != "")) {
            const kkParams = {
                "product_id": productId,
                "userName": kkUserName,
                "userPhone": phoneNumb,
                "startDate": startDate,
                "endDate": endDate,
                "carNum": ticketNum,
                "payMoney": Number(payMoney),
                "rentDesc": '',
                "rent_type": rentType,
                "up_addr": upAddr,
                "agent_code": agent_code,
            }
            if (this.data.chooseRentalID == 3) {//月租
                kkParams.monthNum = this.data.monthCount;
            }
            // console.log(kkParams);//return;
            this.setData({ ButtonActive: false });
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/product/createRentOrder", 3, that.data.shanshanSessionId, kkParams, "POST", false, function (res) {
                // console.log('createRentOrder', res);
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
            }, function () {
                if (phoneNumb != "" && that.data.sixCodeDisplay == true) {
                    that.setData({ ButtonActive: true });
                }
            })
        }
    },
});