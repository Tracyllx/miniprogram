var util = require('../../../utils/util.js');
Page({
    data: {
        showDate: false, //是否显示日期列表
        dateTime: [], //日期列表
        checkDate: '', //当前选中的日期
        showStaff: false, //是否显示员工列表
        staffList: ['全部', '林展峰', '潘启明', '张耀光', '邓志广', '何振南'], //员工列表
        chooseStaff: '请选择员工', //选中的员工
        // ----------列表数据----------
        noData: false, //是否有列表数据
        dataList: [],
        limit: 10,
        page: 1,
        totalCount: 0,
        totalPage: 0,
        lastLoadTime: 0,
    },
    onLoad: function(options) {
        this.getCloseMonth();
        this.getDataList();
        this.getStaffList();
    },

    // 获取月份（包含当前月）
    getCloseMonth: function() {
        const s_year = 2018, s_month = 6; //从2018年6月份开始
        const e_year = new Date().getFullYear(), e_month = new Date().getMonth() + 1; //到当前年月结束
        const currentMonth = e_month <= 9 ? '0' + e_month : e_month; //当月
        const prevMonth = Number(currentMonth) - 1 <= 9 ? '0' + (Number(currentMonth) - 1) : Number(currentMonth) - 1; //当前的上一个月
        var list = [
            { date: e_year + '年' + currentMonth + '月', check: false },
            { date: e_year + '年' + prevMonth + '月', check: true }, //默认选中上一个月
        ];
        if (s_year == e_year) {//同一年
            for (var i = Number(prevMonth) - 1; i >= s_month; i--) {
                i = i <= 9 ? '0' + i : i;
                list.push({
                    date: e_year + '年' + i + '月',
                    check: false,
                });
            }
        } else {//不同一年
            for (var i = Number(prevMonth) - 1; i >= 1; i--) {
                i = i <= 9 ? '0' + i : i;
                list.push({
                    date: e_year + '年' + i + '月',
                    check: false,
                });
            }
            for (var i = 12; i >= s_month; i--) {
                i = i <= 9 ? '0' + i : i;
                list.push({
                    date: s_year + '年' + i + '月',
                    check: false,
                });
            }
        }
        this.setData({
            dateTime: list,
            checkDate: list[1].date,
        });
    },

    // 头部选择：日期、员工
    chooseTap: function(e) {
        var theType = e.currentTarget.dataset.theType;
        if (theType == 'date') {
            this.setData({
                showDate: true,
                showStaff: false,
            });
        } else if (theType == 'staff') {
            this.setData({
                showDate: false,
                showStaff: !this.data.showStaff
            });
        } else if (theType == 'all') {
            this.setData({
                showDate: false,
                showStaff: false
            });
        }
    },

    // 选择日期
    chooseDateItem: function(e) {
        var checkDate = this.data.checkDate;
        var list = this.data.dateTime;
        var index = e.currentTarget.dataset.index;
        list.map(function(item, i, self) {
            if (i == index) {
                item.check = true;
                checkDate = item.date;
            } else {
                item.check = false;
            }
        });
        this.setData({
            dateTime: list,
            checkDate: checkDate,
            showDate: false
        });
        this.getDataList();
    },

    // 选择员工
    staffItemTap: function(e) {
        var list = this.data.staffList;
        var index = e.currentTarget.dataset.index;
        this.setData({
            chooseStaff: list[index].driver_name,
            showStaff: false
        });
        this.getDataList();
    },

    // 点击详情
    optionsTap: function(e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        wx.setStorageSync("STAFFDETAIL", list[index]);
        wx.navigateTo({
            url: '../staffDetail/staffDetail?checkDate=' + this.data.checkDate,
        });
    },

    // 获取员工列表数据
    getStaffList: function() {
        var that = this;
        util.HttpRequst(true, "attendance/driverList", 1, wx.getStorageSync("sessionId"), {}, "GET", false, function(res) {
            if (res.code == 200) {
                var list = [{
                    driver_name: '全部',
                    driver_no: 0
                }];
                that.setData({
                    staffList: list.concat(res.list)
                })
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

    // 获取考勤列表数据
    getDataList: function() {
        var that = this;
        var theDate = this.data.checkDate.split('年');
        var params = {
            driverName: this.data.chooseStaff === '请选择员工' || this.data.chooseStaff === '全部' ? '' : this.data.chooseStaff,
            month: theDate[0] + '-' + theDate[1].split('月')[0],
            limit: this.data.limit,
            page: this.data.page
        }
        // console.log(params);//return;
        util.HttpRequst(true, "attendance/list", 1, wx.getStorageSync("sessionId"), params, "GET", false, function(res) {
            if (res.code == 200) {
                that.setData({
                    noData: res.content.list.length == 0,
                    dataList: res.content.list,
                    totalCount: res.content.totalCount,
                    totalPage: res.content.totalPage
                })
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

    // 加载更多
    loadMore: function(e) {
        var that = this;
        var currentTime = e.timeStamp; //得到当前加载的时间
        var lastTime = this.data.lastLoadTime; //得到上一次加载的时间
        if (currentTime - lastTime < 300) {
            console.log("时间间隔太短，不能算下拉加载");
            return;
        }
        var newPage = this.data.page + 1;
        console.log('当前页：', newPage);
        if (that.data.totalPage >= newPage) {
            this.setData({
                page: newPage,
                lastLoadTime: currentTime,
            });
            this.getDataList();
        }
    },
})