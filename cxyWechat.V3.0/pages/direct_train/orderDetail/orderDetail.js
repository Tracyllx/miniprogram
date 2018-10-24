var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据  
     */
    data: {
        statusCode: 100,
        subpageUrl: util.baseUrl, //需要用到的链接地址
        loadScrollHeight: 0,
        scrollHeight: 0, //得到距离顶部的高度
        isChoose: true, //乘车是否被选中，默认选中
        theMessageList: [], //得到整个信息列表
        orderId: "", //得到单号
        orderTime: "", //得到下单时间
        orderStatus: 0, //得到当前订单的状态：1未付款，2已支付，3已取消，4退款中，5已退款，6已核销，7已取票
        shanWeek: "", //得到今天是星期几
        minute1: "0",
        minute2: "0",
        second1: "0",
        second2: "0",
        orderUseTime: 0, //得到订单可用的时间
        getChoosePlay: 0, //显示超时约车还是大于17:30不约车
        newDateTime: 0, //得到当前日期
        hour: 0, //显示当天的时
        Minutes: 0, //显示当天的分
        personNumber: 0, //得到当前购买的票最多的人数，上下车最多也只能是这个数量
        passengersNumber: 0, //得到当前乘车人数
        goPassengerNumber: 0, //得到去程乘车人数
        isUpdate: 0, //该订单乘车地址是否可以修改
        bigImage: false, //二维码是否放大显示
        useNoYes: false, //得到乘车选项是否可以用
        backDownId: 0, //得到回程下车地点的ID
        backTime: 0, //得到回程的时间
        backUpId: 0, //得到回程上车地点ID
        goDownId: 0, //得到去程下车地点ID
        goTime: 0, //得到去程乘车时间
        goUpId: 0, //得到去程上车地点ID
        index: 0, //得到下车点
        goStatus: 0, //得到去程是否是超时的状态
        backStatus: 0, //得到回程是否超时的状态
        currentIndex: 0, //得到第一个下拉选择列表
        secondeIndex: 0, //得到第二个下拉选择列表
        thridIndex: 0, //得到第二个下拉选择列表
        fourthIndex: 0, //得到第四个下拉选择列表
        FiveIndex: 0, //得到第五个下拉选择列表
        toScenicList: [], //得到去程的上车点列表
        toAllScenicList: [], //得到上车的点所有的消息
        backToWhereList: [], //得到下车点的数据
        backAllToWhereList: [], //得到下车点的所有信息
        toCarTime: [], //得到乘车时间
        backCarTime: [], //得到返程的时间
        showBackCarTime: [], //最终页面显示
        fIndex: false, //得到是否选了index
        sIndex: false,
        tIndex: false,
        frIndex: false,
        voucher: "", //取票码
        write: false, //得到是否有修改传给消息列表页
        shanbackTime: "", //下车时间
        shanbackDonwId: "", //下车地点的id
        shangoTime: "", //上车时间
        shangoUpId: "", //上车地点
        change: false, //得到去程时间如果是18点，返程不可选
        noChangeStops: [], //得到不变的去程下车点，返程上车点
        limitTime: "", //得到订单的限制时间
        commentNum: '', //评论条数
        llkPrice: 0, //单价
    },
    //   是否乘车
    choose: function() {
        var _this = this;
        if (this.data.isUpdate == 1) { //如果是不可以进行修改的则不能点击

        } else {
            if (this.data.isChoose == false) {
                this.setData({
                    isChoose: true
                });
            } else {
                wx.showModal({
                    title: '',
                    content: '您确定取消乘车信息吗？',
                    success: function(res) {
                        if (res.confirm) {
                            _this.setData({
                                isChoose: false
                            }); //确定时再消失弹框
                            // console.log('用户点击确定');
                            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                            util.HttpRequst(true, "ztc/order/cancelRide", 1, wx.getStorageSync("sessionId"), {
                                "orderId": _this.data.orderId
                            }, "GET", false, function(res) {
                                if (res.code == 200) {
                                    console.log(res)
                                    if (_this.data.isUpdate == 2) {
                                        _this.setData({
                                            currentIndex: 0, //得到第一个下拉选择列表
                                            secondeIndex: 0, //得到第二个下拉选择列表
                                            thridIndex: 0, //得到第二个下拉选择列表
                                            fourthIndex: 0, //得到第四个下拉选择列表
                                        })
                                    } else if (_this.data.isUpdate == 3) {
                                        _this.setData({
                                            thridIndex: 0, //得到第二个下拉选择列表
                                            fourthIndex: 0, //得到第四个下拉选择列表
                                        })
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
                        } else if (res.cancel) {
                            _this.setData({
                                isChoose: true
                            });
                        }
                    }
                })
            }
        }
    },
    /**
     * 局部时间
     */
    // //函数5：剩余时间
    areaTime: function() {
        var that = this;
        var shanOrderTime = this.data.orderTime;
        var arr = shanOrderTime.split(/[- : \/]/);
        var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        var order_time = Date.parse(date);
        // console.log("获取订单时间：" + order_time);
        var nowTime = Date.parse(new Date());
        // console.log("现在的时间：" + nowTime);

        var differ_time = nowTime - order_time;
        var leftTime = 1800000 - differ_time;
        var d = new Date(leftTime);
        if (leftTime < 0) {
            console.log("该订单已超时");
        } else {
            var interval = setInterval(function() {
                var m = d.getMinutes();
                var s = d.getSeconds();
                that.setData({
                    "minute1": parseInt(m / 10)
                });
                that.setData({
                    "minute2": parseInt(m % 10)
                });
                that.setData({
                    "second1": parseInt(s / 10)
                });
                that.setData({
                    "second2": parseInt(s % 10)
                });
                if (m == 0 && s == 0) {
                    clearInterval(interval);
                    return;
                }
                d.setSeconds(s - 1);
            }, 1000);
        }
    },
    /**
     * 得到去程的上车点选择
     */
    bindPickerChange: function(e) {
        var getTapList = e.currentTarget.dataset.newIndex; //得到当前点击哪个输入框
        var currentValue = e.detail.value; //得到当前的选中值下标
        // console.log(this.data.backCarTime);
        // console.log(e.detail.value)
        if (getTapList == 0) { //为0的话选的是上车地点
            if (currentValue == 0) {
                this.setData({
                    fIndex: false
                })
            } else {
                this.setData({
                    currentIndex: e.detail.value,
                    fIndex: true
                })
            }
            console.log('得到去程的上车地点：currentIndex=', this.data.currentIndex, ',fIndex=', this.data.fIndex)
        }
        if (getTapList == 1) { //得到乘车时间
            if (currentValue == 0) {
                this.setData({
                    sIndex: false
                })
            } else {
                this.setData({
                    secondeIndex: e.detail.value,
                    // tIndex: true
                    sIndex: true
                })
                // if (this.data.toCarTime[e.detail.value] == this.data.goTime) {

                // } else {
                var goDay = Date.parse(this.data.orderUseTime + " " + this.data.toCarTime[e.detail.value]);
                var backDay = Date.parse(this.data.orderUseTime + " " + this.data.backTime);
                var beApartTime = new Date(backDay).getHours() - new Date(goDay).getHours();
                // console.log(this.data.backTime)
                // console.log(backDay)
                // if (this.data.backTime == undefined) {
                //     this.setData({ fourthIndex: 0 });
                // } else {

                // }
                var NewInex = Number(e.detail.value) + 1;
                // console.log(NewInex)
                var shanlist = this.data.toCarTime.slice(NewInex, this.data.toCarTime.length);
                // console.log(shanlist)
                var list = [];
                // console.log(shanlist.length)
                if (shanlist.length == 0) {
                    list.push("暂无可选时间");
                    this.setData({
                        showBackCarTime: list,
                        tIndex: false,
                        fourthIndex: 0,
                        change: true,
                        backTime: "",
                    });
                } else {
                    list.push("选择时间");
                    var shanshanlist = list.concat(shanlist);
                    this.setData({
                        showBackCarTime: shanshanlist,
                        change: false,
                    });
                    if (this.data.backTime == undefined) {
                        this.setData({
                            fourthIndex: 0,
                        });
                    }
                    if (beApartTime >= 1) {
                        for (var i = 0; i < this.data.showBackCarTime.length; i++) {
                            if (this.data.backTime == this.data.showBackCarTime[i]) {
                                this.setData({
                                    fourthIndex: i
                                });
                            }
                        }
                    } else {
                        this.setData({
                            fourthIndex: 0
                        });
                    }
                }
                // console.log('kkkkkkk', this.data.fourthIndex, this.data.showBackCarTime);
                console.log("我是第一个时间选择值" + this.data.secondeIndex + "----" + this.data.sIndex)
                console.log(this.data.fourthIndex + "----" + this.data.frIndex);
                console.log("得到上车点：" + this.data.currentIndex + "----" + this.data.fIndex);
                console.log("得到下车点：" + this.data.thridIndex + "----" + this.data.tIndex);
                // }
            }
            // console.log('得到去程的时间：secondeIndex=', this.data.secondeIndex, 'sIndex=', this.data.sIndex)
            // console.log('去程--', this.data.toCarTime[this.data.secondeIndex], '返程--', this.data.showBackCarTime[this.data.fourthIndex]);
        }
        if (getTapList == 2) { //得到下车点
            if (currentValue == 0) {
                this.setData({
                    tIndex: false
                })
            } else {
                this.setData({
                    thridIndex: e.detail.value,
                    tIndex: true
                })
            }
            // console.log('得到返程的下车地点：thridIndex=', this.data.thridIndex, ',tIndex=', this.data.tIndex)
        }
        if (getTapList == 3) {
            if (currentValue == 0) {
                this.setData({
                    frIndex: false
                })
            } else {
                this.setData({
                    fourthIndex: e.detail.value,
                    frIndex: true,
                    backTime: this.data.showBackCarTime[e.detail.value]
                })

                // 去程时间组：toCarTime[secondeIndex]
                // 返程时间组：showBackCarTime[fourthIndex]
                // 判断返程时间是否小于（等于）去程时间，小于（等于）则去程时间重置
                var kkGoTime = this.data.toCarTime[this.data.secondeIndex].split(':');
                var kkBackTime = this.data.showBackCarTime[this.data.fourthIndex].split(':');
                // console.log('返程时间是否小于（等于）去程时间：', kkBackTime[0] <= kkGoTime[0])
                if (kkBackTime[0] <= kkGoTime[0]) {
                    this.setData({
                        secondeIndex: 0,
                        sIndex: false
                    });
                }
            }
            // console.log(this.data.showBackCarTime);
            // console.log('得到返程的时间：fourthIndex=', this.data.fourthIndex, 'frIndex=', this.data.frIndex)
            // console.log('去程--', this.data.toCarTime[this.data.secondeIndex], '返程--', this.data.showBackCarTime[this.data.fourthIndex]);
        }
    },
    /**
     * 得到加减数目
     */
    changeNumber: function(e) {
        var plusAndminus = Number(e.currentTarget.dataset.minusPlus);
        var personalNumber = this.data.personNumber;
        var passengersNumbers = this.data.passengersNumber; //得到现在的数量
        if (plusAndminus > 0) {
            if (passengersNumbers < personalNumber) {
                this.setData({
                    passengersNumber: this.data.passengersNumber + 1
                }); //得到下车人数
            }
        } else {
            this.setData({
                passengersNumber: this.data.passengersNumber - 1
            }); //得到下车人数
            if (this.data.passengersNumber < 1) {
                this.setData({
                    passengersNumber: 1
                }); //得到票的数量
            }
        }
    },
    /**
     * 得到重新约车
     */
    getNewCarDetail: function() {
        var shanTime = new Date().getHours(); //得到当前时间
        var shanMinutes = new Date().getMinutes(); //得到分钟
        var timeHour = null,
            index = 0;
        var that = this;
        if (this.data.limitTime) {
            var shanLimitTime = this.data.limitTime.split(":");
            if (shanTime > shanLimitTime[0] || (shanTime == shanLimitTime[0] && shanMinutes > shanLimitTime[0])) {
                wx.showModal({
                    title: '',
                    content: '已不能重新约车，请您联系客服',
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
                return;
            }
        }
        if (this.data.goStatus == 3 && this.data.backStatus == 3) {
            if (that.data.goTime) {
                timeHour = that.data.goTime.split(":");
                if ((shanTime >= Number(timeHour[0]) + 1) && that.data.toCarTime.length > 0) {
                    that.data.toCarTime.map(function(item, index) {
                        if (that.data.goTime == item) {
                            that.data.toCarTime.splice(index, 1);
                            that.setData({
                                toCarTime: that.data.toCarTime
                            })
                        }
                    })
                }
            }
            if (that.data.backTime) {
                timeHour = that.data.backTime.split(":");
                if ((shanTime >= Number(timeHour[0]) + 1) && that.data.backCarTime.length > 0) {
                    that.data.backCarTime.map(function(item, index) {
                        if (that.data.backTime == item) {
                            that.data.backCarTime.splice(index, 1);
                            that.setData({
                                backCarTime: that.data.backCarTime
                            })
                        }
                    })
                }
            }
            this.setData({
                currentIndex: 0,
                secondeIndex: 0,
                goStatus: 1,
                thridIndex: 0,
                fourthIndex: 0,
                backStatus: 1
            })
        } else if (this.data.goStatus == 3) {
            // console.log(that.data.goTime);
            if (that.data.goTime) {
                timeHour = that.data.goTime.split(":");
                if ((shanTime >= Number(timeHour[0]) + 1) && that.data.toCarTime.length > 0) {
                    that.data.toCarTime.map(function(item, index) {
                        if (that.data.goTime == item) {
                            that.data.toCarTime.splice(index, 1);
                            that.setData({
                                toCarTime: that.data.toCarTime
                            })
                        }
                    })
                }
            }
            this.setData({
                currentIndex: 0,
                secondeIndex: 0,
                goStatus: 1
            })
        } else if (this.data.backStatus == 3) {
            if (that.data.backTime) {
                timeHour = that.data.backTime.split(":");
                if ((shanTime >= Number(timeHour[0]) + 1) && that.data.backCarTime.length > 0) {
                    that.data.backCarTime.map(function(item, index) {
                        if (that.data.backTime == item) {
                            that.data.backCarTime.splice(index, 1);
                            that.setData({
                                backCarTime: that.data.backCarTime
                            })
                        }
                    })
                }
            }
            this.setData({
                thridIndex: 0,
                fourthIndex: 0,
                backStatus: 1
            })
        }
    },
    /**
     * 点击车辆轨迹
     */
    getCarRouter: function() {
        var that = this;
        wx.navigateTo({
            url: '../../riding/carRiding/carRiding?order_id=' + that.data.orderId,
        })
    },
    /**
     * 输入框监听输入事件
     */
    changeInputValue: function(e) {
        var value = Number(e.detail.value);
        if (value.length > 0) {
            if (value > 0) {
                this.setData({
                    ticketNumber: value
                });
            } else if (value == 0) {
                this.setData({
                    ticketNumber: 1
                });
            }
        }
        // console.log(e.detail.value)
    },
    getInputValue: function(e) {
        var shanValue = Number(e.detail.value);
        if (shanValue.length > 0) {} else {
            this.setData({
                ticketNumber: 1
            });
        }
    },
    /**
     * 一进来加载的数据
     */
    getOnLoadData: function(location) {
        var that = this;
        // console.log('orderId=', that.data.orderId, 'location=', location);
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/order/orderDetail", 1, wx.getStorageSync("sessionId"), {
            "orderId": that.data.orderId,
            "location": location
        }, "GET", false, function(res) {
            // console.log('getOnLoadData', res)
            if (res.code == 200) {
                that.setData({
                    loadScrollHeight: that.data.scrollHeight
                });
                var kkCanRefund = that.canRefund(res.detail.orderDate);
                that.setData({
                    llkPrice: (res.detail.amount / res.detail.ticketNum).toFixed(2), //单价
                    commentNum: res.detail.comment_num, //评价条数
                    theMessageList: res.detail,
                    passengersNumber: res.detail.back_num ? res.detail.back_num : '',
                    orderUseTime: res.detail.orderDate ? res.detail.orderDate : '',
                    voucher: res.detail.voucher ? res.detail.voucher : '',
                    shanbackTime: res.detail.back_time ? res.detail.back_time : '',
                    shanbackDonwId: res.detail.back_down_id ? res.detail.back_down_id : '',
                    shangoTime: res.detail.go_time ? res.detail.go_time : '',
                    shangoUpId: res.detail.go_up_id ? res.detail.go_up_id : '',
                    goStatus: res.detail.goStatus ? res.detail.goStatus : '', //得到去程是否是超时的状态
                    backStatus: res.detail.backStatus ? res.detail.backStatus : '', //得到回程是否超时的状态
                    limitTime: res.detail.order_time ? res.detail.order_time : '', //得到限制的时间
                    kkCanRefund: kkCanRefund, //判断该订单是否过期，过期则不能退款（退票）
                    kkProducts: res.products ? res.products : '', //子产品列表
                }); //得到订单下的所有信息
                that.setData({
                    backDownId: res.detail.back_down_id ? res.detail.back_down_id : '', //得到回程下车地点的ID
                    backTime: res.detail.back_time ? res.detail.back_time : '', //得到回程的时间
                    backUpId: res.detail.back_up_id ? res.detail.back_up_id : '', //得到回程上车地点ID
                    goDownId: res.detail.go_down_id ? res.detail.go_down_id : '', //得到去程下车地点ID
                    goTime: res.detail.go_time ? res.detail.go_time : '', //得到去程乘车时间
                    goUpId: res.detail.go_up_id ? res.detail.go_up_id : '', //得到去程上车地点ID
                    personNumber: res.detail.ticketNum ? res.detail.ticketNum : '', //人数的设置
                    passengersNumber: res.detail.ticketNum ? res.detail.ticketNum : '', //人数的设置  
                    goPassengerNumber: res.detail.ticketNum ? res.detail.ticketNum : '',
                });

                var shanList = ["选择乘车点"];
                for (var i = 0; i < res.upStops.length; i++) {
                    var juli = res.upStops[i].distance ? res.upStops[i].distance + 'km' : ''; // 判断是否有距离
                    shanList.push(res.upStops[i].addrDetail + ' ' + juli);
                    if (that.data.goUpId == res.upStops[i].addrId) { //选中用户的上车点
                        var num = i + 1;
                        that.setData({
                            currentIndex: num,
                            fIndex: true
                        });
                    }
                    if (that.data.backDownId == res.upStops[i].addrId) { //选中的下车点
                        var num = i + 1;
                        that.setData({
                            thridIndex: num,
                            tIndex: true
                        });
                    }
                }
                that.setData({
                    toAllScenicList: res.upStops,
                    noChangeStops: res.downStops,
                    toScenicList: shanList
                }); //得到上车点的所有数据

                var shanshanList = [];
                for (var i = 0; i < res.downStops.length; i++) {
                    var juli2 = res.downStops[i].distance ? res.downStops[i].distance + 'km' : ''; // 判断是否有距离
                    shanshanList.push(res.downStops[i].addrDetail + ' ' + juli2);
                }
                that.setData({
                    backToWhereList: shanshanList,
                    backAllToWhereList: res.downStops
                }); //得到上车点的所有数据

                var mixList = ["选择时间"];
                var maxList = ["选择时间"];

                var firstIn = 0;
                var secondIn = 0;
                if (that.data.goTime == "" || that.data.goTime == undefined) {} else {
                    // console.log('99999',res.times.length);

                    res.times.map(function(item, index) {
                        if (that.data.goTime == item) {
                            that.setData({
                                secondeIndex: index
                            });
                            firstIn = 1;
                        }
                    })
                    if (res.times.length - 1 == that.data.secondeIndex) {
                        maxList = ["暂无可选时间"];
                        if (maxList[0] == "暂无可选时间") {
                            that.setData({
                                change: true
                            });
                        } else {
                            that.setData({
                                change: false
                            });
                        }
                    }
                    if (firstIn == 0) {
                        mixList.push(that.data.goTime);
                    }

                }
                if (that.data.backTime == "" || that.data.backTime == undefined) {

                    var len = res.times.length == 1 ? that.data.secondeIndex : that.data.secondeIndex + 1;
                    if (len == res.times.length) {
                        maxList = ["暂无可选时间"];

                    }
                } else {
                    res.times.map(function(item, index) {
                        if (that.data.backTime == item) {
                            that.setData({
                                fourthIndex: index
                            });
                            secondIn = 1;
                        }
                    })
                    if (secondIn == 0) {
                        maxList.push(that.data.backTime);
                    }

                }
                var slist = mixList.concat(res.times);
                var ssList = maxList.concat(res.times);
                if (maxList[0] == "暂无可选时间") {
                    that.setData({
                        change: true
                    });
                } else {
                    that.setData({
                        change: false
                    });
                }
                that.setData({
                    toCarTime: slist,
                    backCarTime: ssList,
                    showBackCarTime: ssList
                }); //得到乘车时间

                for (var i = 0; i < that.data.toCarTime.length; i++) {
                    if (that.data.goTime == that.data.toCarTime[i]) {
                        that.setData({
                            secondeIndex: i,
                            sIndex: true
                        });
                    }
                }
                for (var i = 0; i < that.data.backCarTime.length; i++) {
                    if (that.data.backTime == that.data.backCarTime[i]) {
                        that.setData({
                            fourthIndex: i,
                            frIndex: true
                        });
                    }
                }
                var weeks = new Date(res.detail.orderDate).getDay();
                var array = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
                var kkIsUpdate = res.detail.isUpdate;
                if (res.detail.isUpdate != 1 && that.data.orderStatus == 5) { //当前订单没有失效，判断是否已退款，退款则订单失效
                    kkIsUpdate = 1;
                }
                that.setData({
                    isUpdate: kkIsUpdate,
                    orderDate: array[weeks]
                });
                if (that.data.limitTime) {
                    var shanLimitTime = that.data.limitTime.split(":");
                    if ((that.data.hour > shanLimitTime[0] || (that.data.hour == shanLimitTime[0] && that.data.Minutes > shanLimitTime[1]))) {
                        that.setData({
                            getChoosePlay: 1
                        })
                    }
                }
                that.setData({
                    statusCode: res.code
                });
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
     * 一进来获取定位之后加载的数据
     */
    getOnLoadLocationData: function(location) {
        var that = this;
        util.HttpRequst(false, "ztc/order/orderDetail", 1, wx.getStorageSync("sessionId"), {
            "orderId": that.data.orderId,
            "location": location
        }, "GET", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                var shanList = ["选择乘车点"];
                for (var i = 0; i < res.upStops.length; i++) {
                    var juli = res.upStops[i].distance ? res.upStops[i].distance + 'km' : ''; // 判断是否有距离
                    shanList.push(res.upStops[i].addrDetail + ' ' + juli);
                    if (that.data.goUpId == res.upStops[i].addrId) { //选中用户的上车点
                        var num = i + 1;
                        that.setData({
                            currentIndex: num,
                            fIndex: true
                        });
                    }
                    if (that.data.backDownId == res.upStops[i].addrId) { //选中的下车点
                        var num = i + 1;
                        that.setData({
                            thridIndex: num,
                            tIndex: true
                        });
                    }
                }
                that.setData({
                    toAllScenicList: res.upStops,
                    noChangeStops: res.downStops,
                    toScenicList: shanList
                }); //得到上车点的所有数据

                var shanshanList = [];
                for (var i = 0; i < res.downStops.length; i++) {
                    var juli2 = res.downStops[i].distance ? res.downStops[i].distance + 'km' : ''; // 判断是否有距离
                    shanshanList.push(res.downStops[i].addrDetail + ' ' + juli2);
                }
                that.setData({
                    backToWhereList: shanshanList,
                    backAllToWhereList: res.downStops
                }); //得到上车点的所有数据

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
     * 点击得到放大的二维码
     */
    bigCode: function() {
        this.setData({
            bigImage: true
        });
    },
    /**
     * 点击遮罩层隐藏放大的二维码
     */
    hideErWeiCode: function() {
        this.setData({
            bigImage: false
        })
    },
    // 继续支付
    continueToPay: function() {
        wx.redirectTo({
            url: '../payResult/payResult?orderId=' + this.data.orderId,
        });
    },
    /**
     * 去支付
     */
    toPay: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/toPay", 3, wx.getStorageSync("sessionId"), {
            "orderId": that.data.orderId
        }, "GET", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.content === 'PAY_FINISHED') {
                    wx.redirectTo({
                        url: '../payResultSuccess/payResultSuccess',
                    });
                } else if (res.content.appId) {
                    var shantimeStamp = res.content.timeStamp.toString();
                    wx.requestPayment({
                        'timeStamp': shantimeStamp,
                        'nonceStr': res.content.nonceStr,
                        'package': res.content.packageValue,
                        'signType': res.content.signType,
                        'paySign': res.content.paySign,
                        'success': function(rep) {
                            // console.log(rep)
                            if (rep.errMsg == "requestPayment:ok") {
                                wx.navigateTo({
                                    url: '../payResultSuccess/payResultSuccess',
                                })
                            }
                        },
                        'fail': function(res) {
                            wx.showModal({
                                title: '提示',
                                content: '支付失败，请重新请求！',
                                success: function(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
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
        })
    },
    /**
     * 保存用户信息
     */
    saveRideInfo: function() {
        var _this = this;
        var upDate = _this.data.isUpdate;
        var backNum = _this.data.passengersNumber; //回程乘车人数
        var backTime = ""; //回程乘车时间
        var backDownId = ""; //回程下车地点ID
        var backUpId = _this.data.backAllToWhereList[0].addrId; //回程上车地点ID
        var goDownId = _this.data.backAllToWhereList[0].addrId; //去程下车地点ID
        var goNum = _this.data.goPassengerNumber; //去程乘车人数
        var goTime = ""; //去程乘车时间
        var goUpId = ""; //去程上车地点ID
        var shanorderId = _this.data.orderId; //得到订单号

        // 17:30 进行约车时提示拨打客服电话，点击电话号码可以触发拨号
        var that = this;
        var newTimer = new Date().getHours(); //得到当前的时间
        var newMinus = new Date().getMinutes(); //得到当前的分钟
        var useDate = this.data.theMessageList.orderDate; //使用日期

        if (_this.data.isUpdate == 1 && (_this.data.orderUseTime == _this.data.newDateTime)) {
            var gOrder_time = this.data.limitTime ? (this.data.limitTime).split(':') : '17:30'.split(":"); // 预约限制时间 
            if (newTimer >= gOrder_time[0] && this.data.newDateTime == useDate || (newTimer == gOrder_time[0] && newMinus >= gOrder_time[1] && this.data.newDateTime == useDate)) {
                wx.showModal({
                    title: '提示',
                    content: '不可预约当天' + that.data.limitTime + '之后的车，请拨打客服电话：' + that.data.theMessageList.consumer_hotline,
                    success: function(wxrep) {
                        if (wxrep.confirm) {
                            wx.makePhoneCall({
                                phoneNumber: that.data.theMessageList.consumer_hotline,
                                success: function(rep) {}
                            });
                        }
                    }
                });
            }
            return;
        } else if (_this.data.isUpdate == 1) {
            wx.showModal({
                title: '',
                content: '订单已失效，不能修改乘车接送！',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return;
        }

        // goStatus: 0,//得到去程是否是超时的状态
        //     backStatus:0,//得到回程是否超时的状态
        if (_this.data.goStatus == 3) {
            _this.setData({
                fIndex: false,
                sIndex: false
            });
        }
        if (_this.data.backStatus == 3) {
            _this.setData({
                tIndex: false,
                frIndex: false
            });
        }
        if (_this.data.shanbackDonwId == backDownId && _this.data.shangoUpId == goUpId) {
            _this.setData({
                fIndex: true,
                tIndex: true
            })
        }
        if (_this.data.fIndex == true && _this.data.sIndex == true) {
            goUpId = _this.data.toAllScenicList[_this.data.currentIndex - 1].addrId;
            goTime = _this.data.toCarTime[_this.data.secondeIndex];
        } else {
            if (_this.data.fIndex == false && _this.data.sIndex == false) {

            } else {
                wx.showModal({
                    title: '提示',
                    content: '需要同时选择乘车时间和乘车地点才能预约电动车成功哦！',
                    success: function(res) {
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

        if (_this.data.tIndex == true && _this.data.frIndex == true) {
            backDownId = this.data.toAllScenicList[this.data.thridIndex - 1].addrId; //得到下车点
            if (this.data.backTime) {
                backTime = _this.data.showBackCarTime[_this.data.fourthIndex];
            } else {
                backTime = "";
            }

        } else {
            if (_this.data.tIndex == false && _this.data.frIndex == false) {

            } else {
                wx.showModal({
                    title: '提示',
                    content: '需要同时选择乘车时间和乘车地点才能预约电动车成功哦！',
                    success: function(res) {
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
        // console.log("去程的时间：" + goTime + "去程的上车点：" + goUpId + "返程的上车点：" + backDownId + "返程乘车人数：" + backTime);
        // console.log("返程的时间：" + backTime + "返程的上车点：" + backUpId + "返程的下车点：" + backDownId + "返程乘车人数：" + backNum);
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        if (_this.data.shanbackTime == backTime && _this.data.shanbackDonwId == backDownId && _this.data.shangoTime == goTime && _this.data.shangoUpId == goUpId) {
            wx.showToast({
                title: '您未进行修改',
                icon: 'success',
                duration: 2000
            })
            return;
        }
        if (backTime == "" && backDownId == "" && goTime == "" && goUpId == "") {
            wx.showToast({
                title: '您未进行修改',
                icon: 'success',
                duration: 2000
            })
            return;
        }
        util.HttpRequst(false, "ztc/order/saveRideInfo", 3, wx.getStorageSync("sessionId"), {
            backDownId: backDownId,
            backNum: backNum,
            backTime: backTime,
            backUpId: backUpId,
            goDownId: goDownId,
            goNum: goNum,
            goTime: goTime,
            goUpId: goUpId,
            orderId: shanorderId
        }, "POST", false, function(res) {
            // console.log(res);
            if (res.code == 200) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2000
                })
                _this.setData({
                    write: true,
                    shanbackTime: backTime,
                    shanbackDonwId: backDownId,
                    shangoTime: goTime,
                    shangoUpId: goUpId
                });
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
    getNewTime: function() {
        // 
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        month = month > 10 ? month : "0" + month;
        day = day > 10 ? day : "0" + day
        var str = year + "-" + month + "-" + day;
        this.setData({
            newDateTime: str,
            hour: hour,
            Minutes: minute
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (options.scrollHeight) {
            this.setData({
                scrollHeight: options.scrollHeight
            })
        }
        this.setData({
            orderId: options.orderId,
            orderTime: options.orderTime,
            orderStatus: wx.getStorageSync("orderStatus") || options.orderStatus,
        });
        if (this.data.orderStatus == 3) {
            //如果是已取消的订单，不选中“是否乘车”
            this.setData({
                isChoose: false
            });
        }
        if (this.data.orderStatus == 2) {
            //如果是支付了的话没有倒计时
        } else {
            this.areaTime();
        }
        this.getNewTime();

        // this.getCurrLocation(function (rep) {
        //     console.log('定位rep==', rep)
        //     that.getOnLoadData(rep);
        // });
        this.getOnLoadData('');
        this.getCurrLocation();

        // console.log('newDateTime',this.data.newDateTime);
        // console.log('orderUseTime', this.data.orderUseTime);
        // console.log('getChoosePlay', this.data.getChoosePlay);
        // console.log('goStatus', this.data.goStatus);
    },

    // 获取地理位置
    getCurrLocation: function(callBack) {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(wxres) {
                // console.log('wx longitude', wxres.longitude, 'wx latitude', wxres.latitude);
                if (wxres.longitude && wxres.latitude) {
                    that.getOnLoadLocationData(wxres.longitude + ',' + wxres.latitude); //得到坐标，获取距离
                }
            },
            fail: function(wxres) {
                console.log('定位失败！！！', wxres);
            }
        })
    },

    onUnload: function() {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前选择好友页面
        var prevPage = pages[pages.length - 2]; //上一个编辑款项页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面即编辑款项页面中去 
        if (this.data.write == true) {
            prevPage.setData({
                howToLoad: true
            })
        } else {
            prevPage.setData({
                howToLoad: false //当前选择的好友名字赋值给编辑款项中的姓名临时变量
            });
        }
        // console.log(this.data.write)
    },
    onShow: function() {
        // console.log(this.data.scrollHeight)
        // console.log('currOrderID', this.data.orderId, 'REFUNDSUCCESSID', wx.getStorageSync('REFUNDSUCCESSID'));
        if (wx.getStorageSync('REFUNDSUCCESSID') == this.data.orderId) {
            this.data.theMessageList.orderStatus = 5;
            this.setData({
                theMessageList: this.data.theMessageList
            });
        }
    },
    /**
     * 申请退款
     */
    applyRefundTap: function(e) {
        var page = getCurrentPages();
        // console.log('page len', page.length);
        // console.log('申请退款！！！');
        // 判断是否过期
        if (this.data.kkCanRefund) {
            wx.showModal({
                title: '提示',
                content: '该订单已过期，不能进行退款！',
            });
        } else {
            var obj = {
                'orderId': this.data.orderId, // 订单ID
                'productName': this.data.theMessageList.productName, // 名称
                'productNum': this.data.theMessageList.ticketNum, // 数量
                'productAmount': this.data.theMessageList.amount, // 总价
            }
            wx.setStorageSync('REFUNDINFO', obj);
            wx.navigateTo({
                url: '../applyRefund/applyRefund',
            });
        }
    },

    /**
     * 使用日期与当前日期对比
     */
    canRefund: function(_usedate) {
        var arr1 = _usedate.split('-');
        var date1 = new Date(arr1[0], arr1[1] - 1, arr1[2]);
        var usedate = Date.parse(date1);

        var arr2 = this.data.newDateTime.split('-');
        var date2 = new Date(arr2[0], arr2[1] - 1, arr2[2]);
        var nowdate = Date.parse(date2);

        // console.log('是否过期：', usedate - nowdate < 0);
        return usedate - nowdate < 0;
    },

    // 拨打客服电话
    callConsumer: function() {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '拨打客服电话：' + that.data.theMessageList.consumer_hotline,
            success: function(wxrep) {
                if (wxrep.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: that.data.theMessageList.consumer_hotline,
                        success: function(rep) {}
                    });
                }
            }
        });
    },

    // 评价
    // evaluateTap: function (e) {
    //     if (this.data.commentNum == 0) {
    //         wx.navigateTo({
    //             url: '../productAddComment/productAddComment?id=' + this.data.orderId,
    //         });
    //     }
    // },
})