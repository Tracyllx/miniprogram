var util = require('../../../utils/util.js');
Page({
    data: {
        loadingDone: false, //是否加载完成页面所有数据
        currentID: '',//当前所属机构的ID
        noMoreDate: false,//是否有更多日期
        ButtonActive: false,//去支付按钮是否激活
        orderAmount: '0.00',//订单总价
        orderCount: 0,//订单的购买数量
        useDate: '',//使用日期
        chooseDateDetailTime: '',//从日历选择的日期
        productPriceCode: '',//可选最长日期的产品id
        checkProductId: '',//当前选中的产品id
        listData: [],
        nameVal: '',//联系人
        phoneVal: '',//联系电话
        phoneTip: '',//联系电话提示信息
        oldPhone: '',//之前填的联系电话
        codeVal: '',//验证码
        codeText: '获取验证码',//验证码按钮文字
        codeFocus: false,//验证码是否获得焦点
        codeDisplay: false,//是否隐藏验证码
        codeMin: 60,// 倒计时
    },
    onLoad: function (options) {
        this.setData({
            currentID: options.id,
        });
        this.getNowDate();
        this.getUserInfo();
        this.getSpecification();
    },
    onShow: function () {
        var that = this;
        var list = this.data.listData;
        if (this.data.chooseDateDetailTime) {//从日历选择返回来的日期
            this.setData({ useDate: this.data.chooseDateDetailTime });
            const chooseDate = this.data.chooseDateDetailTime;
            const newChooseDate = new Date(chooseDate.split('-')[0], chooseDate.split('-')[1] - 1, chooseDate.split('-')[2]);
            list.map(function (item, i, self) {
                if (item.priceList.length > 0) {
                    // 处理：当前选中日期的价格
                    for (var j = 0; j < item.priceList.length; j++) {
                        if (item.priceList[j].priceDate === chooseDate) {
                            item.kkAmount = Number(item.priceList[j].price).toFixed(2);
                        }
                    }
                    // 处理：产品上架问题
                    const itemDate = item.priceList[0].priceDate;
                    const item_date = new Date(itemDate.split('-')[0], itemDate.split('-')[1] - 1, itemDate.split('-')[2]);
                    if (Date.parse(newChooseDate) >= Date.parse(item_date)) {
                        item.kkErrorTxt = '';
                        if (item.kkCheck) {
                            that.setData({ orderAmount: item.kkAmount });
                        }
                    } else {
                        if (item.kkCheck) {
                            item.kkCheck = false;
                            item.kkCount = 1;
                            that.setData({ orderAmount: '0.00', orderCount: 0 });
                        }
                        item.kkErrorTxt = '该产品于' + item.priceList[0].priceDate + '上架！';//错误提示语
                    }
                    // 处理平日票、周末票、其他特殊活动票（价格为0）
                    const itemPriceList_str = JSON.stringify(item.priceList);
                    if (itemPriceList_str.indexOf(chooseDate) < 0) {
                        item.priceList.map(function (item2, i2, self2) {
                            if (item2.price == 0) {
                                item.kkErrorTxt = '该产品属于活动票，指定时间可用！';//错误提示语
                            } else {
                                
                            }
                        });
                    } else {
                        item.kkErrorTxt = '';//错误提示语
                    }
                }
            });
            this.setData({ listData: list });
        }
    },

    // 获取当前日期：2018-05-18
    getNowDate: function () {
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
        this.setData({ todayDate: strings });
    },

    // 获取门票类型
    getSpecification: function () {
        var that = this;
        util.HttpRequst(true, "ztc/product/hotelProductDetail", 1, wx.getStorageSync("sessionId"), {
            "productType": 1,
            "orgnId": this.data.currentID,
        }, "GET", true, function (res) {
            that.setData({
                loadingDone: true, //数据加载完成！
            });
            if (res.code == 200) {
                var list = res.list;
                var firstItem = '', firstItemLen = '', firstItemCode = '';
                if (list.length > 0) {
                    firstItem = list[0]; //第一个类型
                    firstItemLen = firstItem.priceList.length; //第一个类型的可选日期长度
                    firstItemCode = firstItem.product_id; //第一个类型的id
                    list.map(function (item, i, slef) {
                        if (firstItemLen < item.priceList.length) {
                            firstItem = item;
                            firstItemLen = item.priceList.length;
                            firstItemCode = item.product_id;
                        }
                        item.kkCheck = false;//选择圈
                        item.kkCount = 1;//数量
                        if (item.priceList.length == 0) {//该产品还未配置日期
                            item.kkErrorTxt = '该产品未上架！';//错误提示语
                        } else {
                            if (item.priceList[0].priceDate != that.data.todayDate) {//该产品上架日期不是当前日期
                                item.kkErrorTxt = '该产品于' + item.priceList[0].priceDate + '上架！';//错误提示语
                            } else {//该产品已上架
                                item.kkErrorTxt = '';
                            }
                        }
                        item.kkPrice = item.priceList.length > 0 ? item.priceList[0].price : '0.00';//单价
                        item.kkAmount = item.priceList.length > 0 ? item.priceList[0].price : '0.00';//单个类型总价
                    });
                    that.setData({
                        listData: list,
                        useDate: firstItemLen == 0 ? '' : firstItem.priceList[0].priceDate,
                        productPriceCode: firstItemLen == 0 ? '' : firstItemCode,
                        noMoreDate: firstItemLen == 0,
                    });
                } else {
                    console.log('暂无数据！');
                    that.setData({
                        listData: [],
                        useDate: '',
                        productPriceCode: '',
                        noMoreDate: false,
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
    },

    // 勾选操作
    checkTap: function (e) {
        var list = this.data.listData;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            list.map(function (item, i, self) {
                if (i === index) {
                    item.kkCheck = true;
                } else {
                    item.kkCheck = false;
                }
            });
            this.setData({
                listData: list,
            });
            if (list[index].kkCheck) {
                this.setData({
                    orderAmount: list[index].kkAmount,
                    orderCount: list[index].kkCount,
                    checkProductId: list[index].product_id,
                });
                if (this.data.nameVal && this.data.phoneVal) {
                    this.setData({
                        ButtonActive: true,
                    });
                }
            }
        }
    },

    // 加减操作
    countOptionTap: function (e) {
        var list = this.data.listData;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            var theType = e.currentTarget.dataset.theType;
            if (theType === '+') {
                list[index].kkCount = Number(list[index].kkCount) + 1;
            }
            if (theType === '-') {
                list[index].kkCount = Number(list[index].kkCount) - 1 > 0 ? Number(list[index].kkCount) - 1 : 1;
            }
            list[index].kkAmount = (Number(list[index].kkCount) * Number(list[index].kkPrice)).toFixed(2);
            this.setData({
                listData: list,
            });
            if (list[index].kkCheck) {
                this.setData({
                    orderAmount: (Number(list[index].kkCount) * Number(list[index].kkPrice)).toFixed(2),
                    orderCount: Number(list[index].kkCount),
                    checkProductId: list[index].product_id
                });
            }
        }
    },

    // 数量输入框监听
    countInput: function (e) {
        var val = e.detail.value;
        console.log(val);
        var list = this.data.listData;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            val = val === '0' ? 1 : val;
            list[index].kkCount = val;
            list[index].kkAmount = (Number(val) * Number(list[index].kkPrice)).toFixed(2);
            this.setData({
                listData: list,
            });
            if (list[index].kkCheck) {
                this.setData({
                    orderAmount: (Number(val) * Number(list[index].kkPrice)).toFixed(2),
                    orderCount: Number(val),
                    checkProductId: list[index].product_id
                });
            }
        }
    },

    // 数量输入框失去焦点
    countBlur: function (e) {
        var val = e.detail.value;
        console.log(val);
        var list = this.data.listData;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            val = (val.length == 0 || val === '0') ? 1 : val;
            list[index].kkCount = val;
            list[index].kkAmount = (Number(val) * Number(list[index].kkPrice)).toFixed(2);
            this.setData({
                listData: list,
            });
            if (list[index].kkCheck) {
                this.setData({
                    orderAmount: (Number(val) * Number(list[index].kkPrice)).toFixed(2),
                    orderCount: Number(val),
                    checkProductId: list[index].product_id
                });
            }
        }
    },

    // 更多日期
    moreDateTap: function (e) {
        console.log('更多日期id：', this.data.productPriceCode);
        if (this.data.productPriceCode) {
            wx.navigateTo({
                url: '../../direct_train/theDay/theDay?productId=' + this.data.productPriceCode + '&timeType=start',
            });
        }
    },

    // 联系人输入框监听
    nameInput: function (e) {
        var val = e.detail.value;
        this.setData({
            nameVal: val,
        });
    },

    // 联系电话输入框失去焦点
    phoneBlur: function (e) {
        var val = e.detail.value;
        this.setData({
            phoneVal: val,
        });
    },

    // 联系电话输入框监听
    phoneInput: function (e) {
        var val = e.detail.value;
        var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
        if (val == this.data.oldPhone) {
            this.setData({ codeDisplay: true });
        } else {
            this.setData({
                codeDisplay: false,
                ButtonActive: false,
            });
        }
        if (val.length == 11) {
            if (regs.test(val)) {
                this.setData({
                    phoneVal: val,
                    phoneTip: '',
                });
            } else {
                this.setData({
                    phoneTip: '手机号有误，请输入正确的手机号！',
                    codeDisplay: false,
                })
            }
        } else {
            this.setData({ phoneTip: '' });
        }
    },

    // 验证码输入框监听
    codeInput: function (e) {
        var that = this;
        var val = e.detail.value;
        if (val.length == 6) {
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(false, "ztc/product/checkMsgCode", 4, "", {
                "userPhone": that.data.phoneVal,
                "code": val
            }, "POST", false, function (res) {
                if (res.code == 200) {
                    that.setData({
                        codeVal: val,
                        ButtonActive: true,
                        codeFocus: false
                    });
                    wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
                    return;
                } else {
                    wx.showToast({ title: res.msg + '', icon: 'loading', duration: 2000 });
                }
            });
        }
        if (val.length < 6) {
            this.setData({ phoneTip: '' });
        }
    },

    // 获取验证码
    getCodeTap: function (e) {
        var timer;
        var that = this;
        var countdown = 60;//倒数60s
        var phoneLen = this.data.phoneVal.toString().length;
        if (phoneLen < 11 && phoneLen > 0) {
            this.setData({ phoneTip: "手机号有误，请输入正确的手机号！" });
        } else if (phoneLen == 0) {
            this.setData({ phoneTip: "手机号不能为空！" });
        } else if (phoneLen == 11) {
            if (this.data.phoneTip == "") {
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/product/sendMsgCode", 3, wx.getStorageSync("sessionId"), {
                    "userPhone": that.data.phoneVal
                }, "POST", true, function (res) {
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

    // 验证码倒计时
    fun: function () {
        this.setData({ codeText: "重新获取(" + this.data.codeMin + ")" });
        this.data.codeMin--;
        var that = this;
        if (this.data.codeMin < 0) {
            this.setData({ codeText: "获取验证码", codeMin: 60 });
            clearTimeout(function () {
                that.fun();
            });
        } else {
            setTimeout(function () {
                that.fun();
            }, 1000);
        }
    },

    // 获取用户信息
    getUserInfo: function () {
        var that = this;
        util.HttpRequst(false, "ztc/product/getUserInfo", 1, wx.getStorageSync('sessionId'), {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                if (res.userInfo) {
                    that.setData({ userInfo: res.userInfo });
                    if (res.userInfo.userPhone) {
                        that.setData({
                            nameVal: res.userInfo.userName,
                            phoneVal: res.userInfo.userPhone,
                            codeDisplay: true,
                            ButtonActive: true,
                        });
                    } else {
                        that.setData({
                            codeDisplay: false,
                            ButtonActive: false,
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
        });
    },

    // 去支付
    gotoPay: function (e) {
        if (this.data.ButtonActive == true) {
            if (this.data.nameVal == '') {
                wx.showToast({title: '请输入联系人！' });
                return;
            }
            if (this.data.phoneVal == '') {
                wx.showToast({title: '请输入联系电话！' });
                return;
            }
            var that = this;
            var kkParams = {
                'agent_code': wx.getStorageSync('agent_code') ? wx.getStorageSync('agent_code') : '',
                'userId': this.data.userInfo.userId,
                'userName': this.data.nameVal,
                'userPhone': this.data.phoneVal,
                'payMoney': this.data.orderAmount,
                'ticketNum': this.data.orderCount,
                'productId': this.data.checkProductId,
                'useDate': this.data.useDate,
            }
            // console.log(kkParams);// return;
            this.setData({ ButtonActive: false });//支付按钮变灰
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/product/createOrder", 3, wx.getStorageSync('sessionId'), kkParams, "POST", false, function (res) {
                // console.log(res);
                if (res.code == 200) {
                    wx.redirectTo({
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
        }
    },
})