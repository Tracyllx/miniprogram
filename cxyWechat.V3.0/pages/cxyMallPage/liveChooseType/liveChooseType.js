var util = require('../../../utils/util.js');
Page({
    data: {
        loadingDone: false, //是否加载完成页面所有数据
        currentID: '',//当前所属机构的ID
        noMoreDate: false,//是否有更多日期
        ButtonActive: false,//去支付按钮是否激活
        orderAmount: '0.00',//订单总价
        differDays: 1,//订单的天数，前后算一天
        startTime: '2018-05-19',//入住时间
        endTime: '2018-05-20',//离店时间
        timeType: '',//时间类型：start、end
        productPriceCode: '',//可选最长日期的产品id
        productPriceCodeBase: '',//可选最长日期的产品id
        listData: [],
        ButtonActive: false,//下一步是否可点击
    },
    onLoad: function (options) {
        this.getNowDate();//获取当前日期
        this.setData({ currentID: options.id });
        this.getSpecification();
    },
    onUnload: function () {//页面卸载
        wx.removeStorageSync('CONFIRMORDER');
    },
    onShow: function () {
        // 处理从日历中选择回来的时间
        if (this.data.timeType) {
            const sTime = this.data.startTime;//开始时间
            const eTime = this.data.endTime;//结束时间
            const sTimeDate = new Date(sTime.split('-')[0], sTime.split('-')[1] - 1, sTime.split('-')[2]);
            const eTimeDate = new Date(eTime.split('-')[0], eTime.split('-')[1] - 1, eTime.split('-')[2]);
            // 处理：开始时间 >= 结束时间
            if (Date.parse(sTimeDate) >= Date.parse(eTimeDate)) {
                if (this.data.timeType === 'start') {
                    const nextDate = new Date(sTimeDate.getTime() + 24 * 60 * 60 * 1000); //开始时间的后一天
                    const next_month = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
                    const next_days = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
                    const next_date = nextDate.getFullYear() + '-' + next_month + '-' + next_days;
                    this.setData({ endTime: next_date });
                }
                if (this.data.timeType === 'end') {
                    const preDate = new Date(eTimeDate.getTime() - 24 * 60 * 60 * 1000); //结束时间的前一天
                    const pre_month = preDate.getMonth() + 1 < 10 ? '0' + (preDate.getMonth() + 1) : preDate.getMonth() + 1;
                    const pre_days = preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate();
                    const pre_date = preDate.getFullYear() + '-' + pre_month + '-' + pre_days;
                    this.setData({ startTime: pre_date });
                }
            }
            var that = this;
            var amount = 0;//计算订单总价
            var list = this.data.listData;//数组列表
            const s_time = this.data.startTime;//开始时间
            const e_time = this.data.endTime;//结束时间
            const s_timeDate = new Date(s_time.split('-')[0], s_time.split('-')[1] - 1, s_time.split('-')[2]);
            const e_timeDate = new Date(e_time.split('-')[0], e_time.split('-')[1] - 1, e_time.split('-')[2]);
            const differDays = Math.floor((e_timeDate.getTime() - s_timeDate.getTime()) / (24 * 3600 * 1000));//相差天数，前后算一天
            var showModalNote = false; // “您选择的时间存在已下架产品！”弹窗提示
            var chooseArr = [];//存放每个房型已选中的日期对象

            list.map(function (item, i, self) {//循环有多少种房型
                if (item.priceList.length > 0) {
                    if (item.priceList[0].priceDate) {
                        //需要判断所选的入住时间是否符合每个产品？对不符合的产品进行处理
                        const stampDD_date = item.priceList[0].priceDate;
                        const stampDD = new Date(stampDD_date.split('-')[0], stampDD_date.split('-')[1] - 1, stampDD_date.split('-')[2]);
                        if (Date.parse(stampDD) <= Date.parse(s_timeDate) && item.kkErrorTxt != '') {
                            item.kkErrorTxt = '';
                        } else {
                            if (Date.parse(stampDD) > Date.parse(s_timeDate)) {
                                item.kkErrorTxt = '此产品于 ' + stampDD_date + ' 才可购买';
                            }
                        }
                    }
                    if (item.priceList[item.priceList.length - 1].priceDate) {
                        const stampEE_date = item.priceList[item.priceList.length - 1].priceDate;
                        const stampEE = new Date(stampEE_date.split('-')[0], stampEE_date.split('-')[1] - 1, stampEE_date.split('-')[2]);
                        if (Date.parse(stampEE) <= Date.parse(e_timeDate)) {
                            item.kkErrorTxt = '此产品于 ' + stampEE_date + ' 后下架';
                            // console.log(item.kkCheck);
                            if (item.kkCheck != false) {
                                showModalNote = true;
                            }
                        }
                    }
                }
                var arr = []; // 存放每一个房型的日期
                item.priceList.map(function (item2, j, arr2) { // 循环每个房型的可用日期
                    const stampThis = new Date(item2.priceDate.split('-')[0], item2.priceDate.split('-')[1] - 1, item2.priceDate.split('-')[2]);
                    // 筛选出已选中的日期对象，即在入住时间-离开时间范围内 
                    if (Date.parse(s_timeDate) <= Date.parse(stampThis) && Date.parse(stampThis) < Date.parse(e_timeDate)) {
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
            chooseArr.map(function (item, index, self) {
                var sum = 0;
                if (item.length == 0 || list[index].kkErrorTxt != '') {
                    list[index].kkCheck = false;
                } else {
                    item.map(function (item2, j, self2) {
                        sum = sum + Number(item2.price) * Number(list[index].kkCount);
                    });
                    list[index].kkAmount = Number(sum).toFixed(2);
                }
            });
            var money = 0; // 计算总计
            var checkFlag = false;//判断是否有选中的房型
            list.map(function (item, i, arr) {
                if (item.kkCheck) {
                    checkFlag = true;
                    money = (Number(money) + Number(item.kkAmount)).toFixed(2);
                }
            });
            this.setData({
                listData: list,
                differDays: differDays,
                orderAmount: money,
                ButtonActive: checkFlag,
            });
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

    // 选择日期
    moreDateTap: function (e) {
        // console.log('更多日期的产品 id:', this.data.productPriceCode);
        if (this.data.productPriceCode) {
            var timeType = e.currentTarget.dataset.timeType;//时间类型：开始、结束
            this.setData({ timeType: timeType });
            wx.navigateTo({
                url: '../../direct_train/theDay/theDay?productId=' + this.data.productPriceCode + '&timeType=' + timeType,
            });
        }
    },

    // 下一步，填写信息
    pickerBottomTap: function (e) {
        if (this.data.ButtonActive) {
            var list = this.data.listData;
            var obj = {
                list: [],
                orgnId: this.data.currentID,
                startTime: this.data.startTime,
                endTime: this.data.endTime,
                orderAmount: this.data.orderAmount,
                differDays: this.data.differDays,
            }
            list.map(function (item, i, self) {
                if (item.kkCheck) {
                    obj.list.push({
                        id: item.product_id,
                        name: item.product_name,
                        amount: item.kkAmount,
                        count: item.kkCount,
                        imgUrl: item.photos ? item.photos.split(',')[0] : '',
                    });
                }
            });
            wx.setStorageSync('CONFIRMORDER', obj);
            this.setData({ ButtonActive: false });
            wx.navigateTo({
                url: '../confirmOrder/confirmOrder?id=' + this.data.currentID,
            });
        }
    },

    // 获取房型规格
    getSpecification: function () {
        var that = this;
        util.HttpRequst(true, "ztc/product/hotelProductDetail", 1, wx.getStorageSync("sessionId"), {
            "productType": 2,
            "orgnId": this.data.currentID
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
                    list.map(function (item, i, self) {
                        // const kkPri = item.priceList[item.priceList.length - 1] ? item.priceList[item.priceList.length - 1].priceDate : '';
                        // console.log('id=' + item.product_id, 'len=' + item.priceList.length, kkPri)
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
                                item.kkErrorTxt = '该产品于 ' + item.priceList[0].priceDate + ' 才可购买';//错误提示语
                            } else {//该产品已上架
                                item.kkErrorTxt = '';
                            }
                        }
                        item.kkPrice = item.priceList.length > 0 ? item.priceList[0].price : '0.00';//单价
                        item.kkAmount = item.priceList.length > 0 ? item.priceList[0].price : '0.00';//单个类型总价
                    });
                    that.setData({
                        listData: list,
                        startTime: firstItemLen == 0 ? '' : firstItem.priceList[0].priceDate,
                        endTime: firstItemLen == 0 ? '' : firstItem.priceList[1].priceDate,
                        productPriceCode: firstItemLen == 0 ? '' : firstItemCode,
                        productPriceCodeBase: firstItemLen == 0 ? '' : firstItemCode,
                        noMoreDate: firstItemLen == 0,
                    });
                } else {
                    console.log('暂无数据！');
                    that.setData({
                        listData: [],
                        startTime: '',
                        endTime: '',
                        productPriceCode: '',
                        productPriceCodeBase: '',
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
        var checkFlag = false;
        var list = this.data.listData;
        var amount = 0, productId = '', maxLen = 0;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            list[index].kkCheck = !list[index].kkCheck;
            list.map(function (item, i, self) {
                if (item.kkCheck) {
                    checkFlag = true;
                    amount = amount + Number(item.kkAmount);
                    if (maxLen < item.priceList.length) {
                        maxLen = item.priceList.length;
                        productId = item.product_id;
                    }
                }
            });
            this.setData({
                listData: list,
                orderAmount: amount.toFixed(2),
                productPriceCode: productId == '' ? this.data.productPriceCodeBase : productId,//没有选择，id为原来最长可选日期的产品id
                ButtonActive: checkFlag,
            });
        }
    },

    // 加减操作
    countOptionTap: function (e) {
        var amount = 0;
        var list = this.data.listData;
        var days = this.data.differDays;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            var theType = e.currentTarget.dataset.theType;
            if (theType === '+') {
                list[index].kkCount = Number(list[index].kkCount) + 1;
            }
            if (theType === '-') {
                list[index].kkCount = Number(list[index].kkCount) - 1 > 0 ? Number(list[index].kkCount) - 1 : 1;
            }
            list[index].kkAmount = (Number(list[index].kkCount) * Number(list[index].kkPrice) * days).toFixed(2);
            list.map(function (item, i, self) {
                if (item.kkCheck) {
                    amount = amount + Number(item.kkAmount);
                }
            });
            this.setData({
                listData: list,
                orderAmount: amount.toFixed(2),
            });
        }
    },

    // 数量输入框监听
    countInput: function (e) {
        var val = e.detail.value;
        var amount = 0;
        var list = this.data.listData;
        var days = this.data.differDays;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            val = val === '0' ? 1 : val;
            list[index].kkCount = val;
            list[index].kkAmount = (Number(val) * Number(list[index].kkPrice) * days).toFixed(2);
            list.map(function (item, i, self) {
                if (item.kkCheck) {
                    amount = amount + Number(item.kkAmount);
                }
            });
            this.setData({
                listData: list,
                orderAmount: amount.toFixed(2),
            });
        }
    },

    // 数量输入框失去焦点
    countBlur: function (e) {
        var val = e.detail.value;
        var amount = 0;
        var list = this.data.listData;
        var days = this.data.differDays;
        var index = e.currentTarget.dataset.index;
        if (list[index].kkErrorTxt != '') { } else {
            val = (val.length == 0 || val === '0') ? 1 : val;
            list[index].kkCount = val;
            list[index].kkAmount = (Number(val) * Number(list[index].kkPrice) * days).toFixed(2);
            list.map(function (item, i, self) {
                if (item.kkCheck) {
                    amount = amount + Number(item.kkAmount);
                }
            });
            this.setData({
                listData: list,
                orderAmount: amount.toFixed(2),
            });
        }
    },

    // var itemListLen = item.priceList.length;//每个房型的日期列表长度
    // if (itemListLen > 0) {
    //     // 处理：每个房型何时上架、何时下架、未上架的问题
    //     if (item.priceList[0].priceDate) {
    //         const itemDate1 = item.priceList[0].priceDate;//判断开始时间
    //         const item_date1 = new Date(itemDate1.split('-')[0], itemDate1.split('-')[1] - 1, itemDate1.split('-')[2]);
    //         if (Date.parse(s_timeDate) > Date.parse(item_date1)) {
    //             if (item.priceList[itemListLen - 1].priceDate) {
    //                 const itemDate2 = item.priceList[itemListLen - 1].priceDate;//判断结束时间
    //                 const item_date2 = new Date(itemDate2.split('-')[0], itemDate2.split('-')[1] - 1, itemDate2.split('-')[2]);
    //                 if (Date.parse(s_timeDate) > Date.parse(item_date2)) {
    //                     item.kkCheck = false;//不能选择
    //                     item.kkErrorTxt = '该产品于' + itemDate2 + '下架！';//错误提示语
    //                 } else {
    //                     item.kkErrorTxt = '';//错误提示语
    //                 }
    //             } else {
    //                 item.kkErrorTxt = '';//错误提示语
    //             }
    //         } else {
    //             if (Date.parse(s_timeDate) == Date.parse(item_date1) && item.kkErrorTxt != '') {
    //                 item.kkErrorTxt = '';//错误提示语
    //             } else {
    //                 item.kkCheck = false;//不能选择
    //                 item.kkErrorTxt = '该产品于' + itemDate1 + '上架！';//错误提示语
    //             }
    //         }
    //     }
    // } else {
    //     console.log(item.product_name, '该产品未上架')
    // }
});