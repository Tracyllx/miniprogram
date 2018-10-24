// 'use strict';
var util = require('../../../utils/util.js');
let choose_year = null, choose_month = null;

const conf = {
    data: {
        leftArrow: '<',
        rightArrow: '>',
        hasEmptyGrid: false,
        showPicker: false,
        getToday: '2017-12-31',//获取当前日期
        priceList: [],//对应productId的价格列表
        productId: '',//产品Id
        timeType: '',//时间类型：start、end
    },
    onLoad(options) {
        this.setData({ productId: options.productId, timeType: options.timeType });

        this.getNewTimes();//获取当前日期

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
        var that = this;
        util.HttpRequst(true, "ztc/product/productPriceList", 2, "", {
            "productId": that.data.productId
        }, "GET", false, function (res) {
            if (res.code == 200) {
                var theList = res.list;
                if (theList.length > 0) {
                    that.setData({ priceList: theList });
                    that.showPriceView();
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
        wx.setStorageSync("ChoosDate", currTime);
        console.log('您选的时间', currTime)

        var pages = getCurrentPages(); //获取所有页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        if (this.data.timeType === 'start') {
            prevPage.setData({ //将选择的时间赋值给上一个页面的 startTime
                chooseDateDetailTime: currTime,
                startTime: currTime,
            });
        } else if (this.data.timeType === 'end') {
            prevPage.setData({ //将选择的时间赋值给上一个页面的 endTime
                endTime: currTime,
            });
        }
        wx.navigateBack();
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