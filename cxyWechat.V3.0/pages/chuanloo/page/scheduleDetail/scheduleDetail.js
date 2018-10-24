var allData = [
    {
        imgUrl: '../imgs/5D_1.png',
        scoreInt: '9',
        scoreFloat: '.0',
        name: '5D影院',
        times: '30分钟',
        types: '动作/冒险',
        director: '罗曼蒂克',
        desc: '亡灵莎娜团长带率领灵退出百慕大三角...'
    },
    {
        imgUrl: '../imgs/5D_2.png',
        scoreInt: '9',
        scoreFloat: '.5',
        name: '动物童话王国',
        times: '30分钟',
        types: '剧情/喜剧',
        director: '罗曼蒂克',
        desc: '开来看看动物们的童话世界是怎么样的吧...'
    },
    {
        imgUrl: '../imgs/5D_3.png',
        scoreInt: '9',
        scoreFloat: '.6',
        name: '小猪跳水',
        times: '30分钟',
        types: '动作/搞笑',
        director: '罗曼蒂克',
        desc: '可爱的小猪来跳水啦，快来围观吧...'
    },
    {
        imgUrl: '../imgs/5D_1.png',
        scoreInt: '9',
        scoreFloat: '.0',
        name: '5D影院',
        times: '30分钟',
        types: '动作/冒险',
        director: '罗曼蒂克',
        desc: '亡灵莎娜团长带率领灵退出百慕大三角...'
    },
    {
        imgUrl: '../imgs/5D_2.png',
        scoreInt: '9',
        scoreFloat: '.5',
        name: '动物童话王国',
        times: '30分钟',
        types: '剧情/喜剧',
        director: '罗曼蒂克',
        desc: '开来看看动物们的童话世界是怎么样的吧...'
    },
    {
        imgUrl: '../imgs/5D_3.png',
        scoreInt: '9',
        scoreFloat: '.6',
        name: '小猪跳水',
        times: '30分钟',
        types: '动作/搞笑',
        director: '罗曼蒂克',
        desc: '可爱的小猪来跳水啦，快来围观吧...'
    },
];
var allInfo = [
    {
        startTime: '9:00',
        endTime: '9:30',
        maxNum: 300,
        surplus: 110,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
    {
        startTime: '10:00',
        endTime: '10:30',
        maxNum: 300,
        surplus: 34,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
    {
        startTime: '11:00',
        endTime: '11:30',
        maxNum: 300,
        surplus: 76,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
    {
        startTime: '14:00',
        endTime: '14:30',
        maxNum: 300,
        surplus: 140,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
    {
        startTime: '15:00',
        endTime: '15:30',
        maxNum: 300,
        surplus: 34,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
    {
        startTime: '16:00',
        endTime: '16:30',
        maxNum: 300,
        surplus: 102,
        priceInt: 54,
        priceFloat: '.00',
        showItem: true
    },
]
Page({
    data: {
        dataIndex: '', //当前是哪一种电影
        dataList: allData, //电影详情
        infoList: allInfo, //场次详情
        todayList: allInfo, //当天的场次详情
        timeAcitve: 0, //选中的是哪一天
        timeList: [], //时间轴
    },
    onLoad: function(options) {
        this.setData({
            dataIndex: options.id
        });

        this.getTime();//获取时间轴

        // 处理：开场半小时前可买
        var nowTime = new Date();
        var today_list = this.data.infoList;
        today_list.map(function (item, index, self) {
            const hour = Number(item.startTime.split(':')[0]);
            const min = Number(item.startTime.split(':')[1]);
            const beginTime = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), hour, min);
            if (beginTime - nowTime > 0 && beginTime - nowTime > 1800000) {
                item.showItem = true;
            } else {
                item.showItem = false;
            }
        });
        this.setData({
            infoList: today_list,
            todayList: today_list
        });
    },

    // 获取时间段
    getTime: function() {
        function GetDateStr(AddDayCount) { //获取时间轴
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            return {
                'year': dd.getFullYear(),
                'month': dd.getMonth() + 1 >= 10 ? dd.getMonth() + 1 : '0' + (dd.getMonth() + 1),
                'date': dd.getDate() >= 10 ? dd.getDate() : '0' + dd.getDate(),
                'week': weeks[dd.getDay()]
            }
        }
        var timeArr = [];
        timeArr.push({
            obj: GetDateStr(0),
            text: '今天' + GetDateStr(0).month + '月' + GetDateStr(0).date + '号'
        });
        timeArr.push({
            obj: GetDateStr(1),
            text: '明天' + GetDateStr(1).month + '月' + GetDateStr(1).date + '号'
        });
        timeArr.push({
            obj: GetDateStr(2),
            text: '后天' + GetDateStr(2).month + '月' + GetDateStr(2).date + '号'
        });
        timeArr.push({
            obj: GetDateStr(3),
            text: GetDateStr(3).week + GetDateStr(3).month + '月' + GetDateStr(3).date + '号'
        });
        this.setData({
            timeList: timeArr
        });
    },

    // 时间选择
    timeTap: function(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            timeAcitve: index,
            infoList: index == 0 ? this.data.todayList : allInfo
        });
    },

    // 用户预约
    confirmSchedule: function(e) {
        var that = this;
        const index = e.currentTarget.dataset.index;
        const infoItem = this.data.infoList[index];
        const dataItem = this.data.dataList[this.data.dataIndex];
        const timeObj = this.data.timeList[this.data.timeAcitve].obj;
        const params = {
            'imgUrl': dataItem.imgUrl,
            'times': dataItem.times,
            'types': dataItem.types,
            'itemName': dataItem.name,
            'cost': Number(infoItem.priceInt + infoItem.priceFloat),
            'orderDate': timeObj.year + '-' + timeObj.month + '-' + timeObj.date,
            'timeRange': infoItem.startTime + '-' + infoItem.endTime
        };
        wx.setStorageSync('chuanlooOrder', params);
        wx.redirectTo({
            url: '../orderDetail/orderDetail',
        });
    },
})