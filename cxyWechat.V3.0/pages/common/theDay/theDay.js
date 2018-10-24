// 'use strict';
var util = require('../../../utils/util.js');
let choose_year = null, choose_month = null;

// Math.floor((endTimeStamp.getTime() - currTimeStamp.getTime()) / (24 * 3600 * 1000));

const conf = {
    data: {
        leftArrow: '<',
        rightArrow: '>',
        hasEmptyGrid: false,
        showPicker: false,
        newDay: "",
        shanProductId: "63",
        priceList: [],
        orderLimitTime: '17:30',
        getToday: '2017-12-31',//获取当前日期
    },
    onLoad(options) {
        this.getNewTimes();//获取当前日期
        const rentalT = wx.getStorageSync("RENTALTIME");
        this.setData({
            shanProductId: options.productId ? options.productId : '',
            orderLimitTime: options.orderLimitTime ? options.orderLimitTime : '', // 时间限制，等于 false 表示是租车详情页过来的
            chooseTimeType: rentalT.chooseTimeType ? rentalT.chooseTimeType : '', // 1：选择开始时间，2：选择结束时间
            startTime: rentalT.startTime ? rentalT.startTime : '', // 从详情页带过来的开始时间
            endTime: rentalT.endTime ? rentalT.endTime : '', // 从详情页带过来的结束时间
            hotel: options.hotel ? options.hotel : '', // V2.0 酒店
            hidePrice: options.hidePrice ? options.hidePrice : '', // 用于不显示价格
            rentalMonth: options.month ? options.month : '', // 租车-月租
            llkUnlimited: options.llkUnlimited ? options.llkUnlimited : '', // 用于可选日期不做限制
        });

        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];

        this.getData(); //请求数据
        this.calculateEmptyGrids(cur_year, cur_month);
        this.calculateDays(cur_year, cur_month);
        this.getWeek(cur_year, cur_month);//得到今天星期几

        this.setData({ cur_year, cur_month, weeks_ch });
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
        var strings = year.toString() + "-" + month + "-" + day;
        this.setData({ getToday: strings });
    },
    getData: function () {
        if (this.data.llkUnlimited) {
            return;
        }
        var that = this;
        var newTimer = new Date().getHours();//得到当前的时间
        var newMinus = new Date().getMinutes();//得到当前的分钟
        let newDateTime = this.data.getToday;//得到当前日期
        // console.log(newDateTime)
        var limitTime;
        if (this.data.orderLimitTime == 'false') {
            limitTime = this.data.orderLimitTime;//车辆租赁
        } else {
            limitTime = this.data.orderLimitTime ? this.data.orderLimitTime.split(':') : '17:30'.split(':');//得到时间限制
        }
        util.HttpRequst(true, "ztc/product/productPriceList", 2, "", { "productId": that.data.shanProductId }, "GET", false, function (res) {
            if (res.code == 200) {
                var List = res.list;
                if (newDateTime == res.list[0].priceDate && that.data.orderLimitTime != 'false') { // 超过时间限制处理
                    if (newTimer > limitTime[0] || newTimer == limitTime[0] && newMinus > limitTime[1]) {
                        List.splice(0, 1);
                    }
                }
                that.setData({ priceList: List });
                that.showPriceView();
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
    // 计算每月有多少天
    getThisMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    },
    // 计算每月第一天是星期几
    getFirstDayOfWeek(year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    // 计算在每月第一天在当月第一周之前的空余的天数
    calculateEmptyGrids(year, month) {
        const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
        let empytGrids = [];
        if (firstDayOfWeek > 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                empytGrids.push(i);
            }
            this.setData({
                hasEmptyGrid: true,
                empytGrids
            });
        } else {
            this.setData({
                hasEmptyGrid: false,
                empytGrids: []
            });
        }
    },
    //根据日期得到星期
    getWeek: function (year, month) {
        var d = new Date(year, month - 1, 1);
        return d.getDay();
    },
    // 渲染日历格子
    calculateDays(year, month) {
        let days = [];
        var shanDay = new Date().getDate();
        var shanMonth = new Date().getMonth() + 1;
        const thisMonthDays = this.getThisMonthDays(year, month);//当前月有多少天
        for (let i = 1; i <= thisMonthDays; i++) {
            if (this.data.llkUnlimited) {
                if (i == shanDay && shanMonth == month) {
                    days.push({
                        day: i,
                        choosed: true,//默认选中今天
                        price: '',
                        isCanClick: true,
                        time: year + '-' + (month <= 9 ? '0' + month : month) + '-' + (i <= 9 ? '0' + i : i),
                    });
                } else {
                    days.push({
                        day: i,
                        choosed: false,
                        price: '',
                        isCanClick: shanDay <= i,
                        time: year + '-' + (month <= 9 ? '0' + month : month) + '-' + (i <= 9 ? '0' + i : i),
                    });
                }
            } else {
                if (i == shanDay && shanMonth == month) {
                    days.push({ day: i, choosed: true });//默认选中今天
                } else {
                    days.push({ day: i, choosed: false });
                }
            }
        }
        this.setData({ days: days });
    },
    // 递增、递减切换月份
    handleCalendar(e) {
        const handle = e.currentTarget.dataset.handle;
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        if (handle === 'prev') {
            let newMonth = cur_month - 1;
            let newYear = cur_year;
            if (newMonth < 1) {
                newYear = cur_year - 1;
                newMonth = 12;
            }

            this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);

            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            });

        } else {
            let newMonth = cur_month + 1;
            let newYear = cur_year;
            if (newMonth > 12) {
                newYear = cur_year + 1;
                newMonth = 1;
            }

            this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);

            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            });
        }
        this.showPriceView();
    },
    // 点击日历上某一天
    tapDayItem(e) {
        const idx = e.currentTarget.dataset.idx;
        const days = this.data.days;

        if (!days[idx].isCanClick) {
            return;
        }
        for (var i = 0; i < days.length; i++) {
            if (i == idx) {
                days[i].choosed = true;
            } else {
                days[i].choosed = false;
            }
        }
        this.setData({ days: days });

        const currTime = e.currentTarget.dataset.time;
        // console.log(currTime); return;

        const kkStartTime = this.data.startTime;
        const kkEndTime = this.data.endTime;

        wx.setStorageSync("ChoosDate", currTime);
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        if (this.data.orderLimitTime == 'false') { // 车辆租赁
            const currTimeStamp = new Date(currTime.split('-')[0], currTime.split('-')[1] - 1, currTime.split('-')[2]);
            const startTimeStamp = new Date(kkStartTime.split('-')[0], kkStartTime.split('-')[1] - 1, kkStartTime.split('-')[2]);
            const endTimeStamp = new Date(kkEndTime.split('-')[0], kkEndTime.split('-')[1] - 1, kkEndTime.split('-')[2]);
            var luFlag = false, currTimePrev = null, currTimeNext = null;//当前选择的上（下）一天

            if (this.data.chooseTimeType == 1) { // 开始时间
                if (this.data.hotel && this.data.hotel == 'true') {
                    // 选择入住时间时，判断当前选择时间的后一天是否存在
                    this.data.priceList.map(function (item, i, arr) {
                        if (item.priceDate == currTime) {
                            if (arr[i + 1]) {
                                currTimeNext = arr[i + 1].priceDate;
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '入住时间不能选择最后一天！',
                                })
                                luFlag = true;
                            }
                        }
                    });
                    if (luFlag) {
                        return;
                    }
                }
                const endTHotel = Date.parse(currTimeStamp) >= Date.parse(endTimeStamp) ? currTimeNext : kkEndTime;// true: 当前选择的时间 false: 从详情带过来的结束时间
                const endT = Date.parse(currTimeStamp) > Date.parse(endTimeStamp) ? currTime : kkEndTime;// true: 当前选择的时间 false: 从详情带过来的结束时间
                var luEndTime = this.data.hotel ? endTHotel : endT;
                // 计算租车天数
                var kkDays = Math.floor((endTimeStamp.getTime() - currTimeStamp.getTime()) / (24 * 3600 * 1000));//租车天数：当前时间 - 从详情带过来的结束时间
                kkDays = Date.parse(currTimeStamp) > Date.parse(endTimeStamp) ? 1 : kkDays + 1;// true: 默认1天 false: 计算天数
                // 月租
                if (this.data.rentalMonth && Number(this.data.rentalMonth) != NaN) {
                    const newTheDate = new Date(currTime.split('-')[0], currTime.split('-')[1] - 1, currTime.split('-')[2]);
                    //时间戳 + 毫秒数 * 秒数 * 分数 * 一天24小时 * 天数 (往后推30天，前后算两天)
                    const delay = newTheDate.getTime() + 1000 * 60 * 60 * 24 * 30 * Number(this.data.rentalMonth);
                    const jianyiDay = new Date(delay).getTime() - 1000 * 60 * 60 * 24;//减去一天
                    const year = new Date(jianyiDay).getFullYear();
                    const month = (new Date(jianyiDay).getMonth() + 1) <= 9 ? '0' + (new Date(jianyiDay).getMonth() + 1) : (new Date(jianyiDay).getMonth() + 1);
                    const day = new Date(jianyiDay).getDate() <= 9 ? '0' + new Date(jianyiDay).getDate() : new Date(jianyiDay).getDate();
                    luEndTime = year + '-' + month + '-' + day;
                    kkDays = 30 * Number(this.data.rentalMonth);
                }
                // 半日租
                if (this.data.rentalMonth == 'false') {
                    luEndTime = currTime;
                }
                prevPage.setData({
                    chooseDateTime: currTime,
                    chooseDateDetailTime: currTime,
                    chooseDateDetailTimeEnd: luEndTime,
                    rentalDays: kkDays,
                });
                console.log('开始：', currTime, '，结束：', luEndTime, '，天数：', kkDays)

            } else if (this.data.chooseTimeType == 2) { // 结束时间
                if (this.data.hotel && this.data.hotel == 'true') {
                    // 选择离开时间时，判断当前选择时间的前一天是否存在
                    this.data.priceList.map(function (item, i, arr) {
                        if (item.priceDate == currTime) {
                            if (arr[i - 1]) {
                                currTimePrev = arr[i - 1].priceDate;
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '离开时间不能选择当天！',
                                })
                                luFlag = true;
                            }
                        }
                    });
                    if (luFlag) {
                        return;
                    }
                }
                const startTHotel = Date.parse(currTimeStamp) <= Date.parse(startTimeStamp) ? currTimePrev : kkStartTime;// true: 当前选择的时间 false: 从详情带过来的开始时间
                const startT = Date.parse(currTimeStamp) < Date.parse(startTimeStamp) ? currTime : kkStartTime;// true: 当前选择的时间 false: 从详情带过来的开始时间
                const luStartTime = this.data.hotel ? startTHotel : startT;
                // 计算租车天数
                var kkDays = Math.floor((currTimeStamp.getTime() - startTimeStamp.getTime()) / (24 * 3600 * 1000));//租车天数：当前时间 - 从详情带过来的开始时间
                kkDays = Date.parse(currTimeStamp) < Date.parse(startTimeStamp) ? 1 : kkDays + 1;// true: 默认1天 false: 计算天数
                prevPage.setData({
                    chooseDateTime: currTime,
                    chooseDateDetailTime: luStartTime,
                    chooseDateDetailTimeEnd: currTime,
                    rentalDays: kkDays,
                });
                console.log('开始：', luStartTime, '，结束：', currTime, '，天数：', kkDays)
            }
            wx.navigateBack();

        } else {
            console.log('您选的时间', currTime)
            prevPage.setData({
                chooseDateTime: currTime,
                chooseDateDetailTime: currTime,
            })
            wx.navigateBack();
        }
    },
    // 点击年月调用picker选择器
    chooseYearAndMonth() {
        return;
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        let picker_year = [],
            picker_month = [];
        for (let i = 1900; i <= 2100; i++) {
            picker_year.push(i);
        }
        for (let i = 1; i <= 12; i++) {
            picker_month.push(i);
        }
        const idx_year = picker_year.indexOf(cur_year);
        const idx_month = picker_month.indexOf(cur_month);
        this.setData({
            picker_value: [idx_year, idx_month],
            picker_year,
            picker_month,
            showPicker: true,
        });
    },
    // 当picker选择器值改变时
    pickerChange(e) {
        const val = e.detail.value;
        choose_year = this.data.picker_year[val[0]];
        choose_month = this.data.picker_month[val[1]];
    },
    // 确定picker结果
    tapPickerBtn(e) {
        const type = e.currentTarget.dataset.type;
        const o = {
            showPicker: false,
        };
        if (type === 'confirm') {
            o.cur_year = choose_year;
            o.cur_month = choose_month;
            this.calculateEmptyGrids(choose_year, choose_month);
            this.calculateDays(choose_year, choose_month);
        }

        this.setData(o);
    },
    // 分享当前页面
    onShareAppMessage() {
        // return {
        //     title: '小程序日历',
        //     desc: '还是新鲜的日历哟',
        //     path: 'pages/index/index'
        // };
    },
    showPriceView: function () {
        var days = this.data.days;
        var priceList = this.data.priceList;

        var thisYear = this.data.cur_year;
        var thisMonth = this.data.cur_month;

        const llkYear = new Date().getFullYear();
        const llkMonth = new Date().getMonth() + 1;
        const llkDay = new Date().getDate();

        for (var i = 0, len = days.length; i < len; i++) {
            if (this.data.llkUnlimited) {//没有限制可选日期 
                days[i].price = "";
                days[i].isCanClick = false;
                days[i].choosed = false;
                if (llkYear == thisYear && llkMonth == thisMonth && llkDay == days[i].day) {
                    days[i].isCanClick = true;
                    days[i].choosed = true;//默认选中今天
                }
                if (new Date().getTime() <= new Date(thisYear, thisMonth - 1, days[i].day).getTime()) {
                    days[i].isCanClick = true;
                    days[i].time = thisYear + '-' + (thisMonth <= 9 ? '0' + thisMonth : thisMonth) + '-' + (days[i].day <= 9 ? '0' + days[i].day : days[i].day);
                }
            } else {
                days[i].price = "";
                days[i].isCanClick = false;
                days[i].choosed = false;
                for (var k = 0; k < priceList.length; k++) {
                    var price = priceList[k].priceDate;
                    var strs = price.split("-");
                    var year = strs[0];
                    var month = strs[1];
                    var day = strs[2];
                    if (thisYear == parseInt(year) && thisMonth == parseInt(month) && days[i].day == day) {
                        if (k == 0) {
                            days[i].choosed = true;
                        }
                        days[i].price = "¥" + priceList[k].price;
                        days[i].isCanClick = true;
                        days[i].time = priceList[k].priceDate;
                    }
                }
            }
        }
        this.setData({ days: days });
    }
};

Page(conf);