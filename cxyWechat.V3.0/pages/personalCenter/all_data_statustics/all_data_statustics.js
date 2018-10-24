var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        dataPower: {},//显示哪个数据统计的权限
        isChooseDate: 1,//得到年月日的值,默认是日
        isChooseDay: 10,//得到10,30,60的筛选条件，默认选中的时间是10天
        isTypes: 1,//默认选中的是第一个游客统计
        limit: 15,
        page: 1,
        totalCount: 0,//得到总条数
        totalPage: 0,//得到总页数
        list: [],//装数据部分
        lastLoadTime: 0,//得到下拉加载上一次时间
        loadMoreIs: false,//得到是否是下拉加载
        noneDatas: false,
        oneCount: 0,//得到第一位
        twoCount: 0,//得到第二位
        threeCount: 0,//得到第三位
        title: [],//标题
        // dataList:[],//得到数据第一次的数据，主要是
        hideBubbleInterval: '',//气泡的定时器，6秒隐藏气泡
        clickIndex: null, //点击出现气泡的data下标
        groupDetail: [],//数据统计-团体详情
        isShowModule: false,//是否显示弹窗
        moduleData: [ //弹窗数据-交易平台的交易数详情
            { 'name': '碧水湾至流溪河国家森林公园优惠接驳票', 'count': 86, 'amount': '1290.00' },
            { 'name': '从化卓思道温泉成人票（平日价）', 'count': 2, 'amount': '316.00' },
            { 'name': '从化五指山景区门票+景区内观光车', 'count': 32, 'amount': '1920.00' },
            { 'name': '从化流溪河国家森林公园成人票（网络优惠价，原价40元）', 'count': 20, 'amount': '640.00' },
            { 'name': '葳格诗温泉庄园苏格兰客房优惠套餐', 'count': 3, 'amount': '2367.00' },
            { 'name': '碧水湾温泉家庭套票', 'count': 3, 'amount': '1350.00' },
            { 'name': '碧水湾温泉亲子套票', 'count': 4, 'amount': '1092.00' },
            { 'name': '从化五指山景区门票+景区内观光车票（成人票）', 'count': 100, 'amount': '8000.00' },
            { 'name': '碧水湾至流溪河国家森林公园优惠接驳票', 'count': 86, 'amount': '1290.00' },
            { 'name': '从化流溪河国家森林公园成人票（网络优惠价，原价40元）', 'count': 20, 'amount': '640.00' },
        ],
        dataIndex: null,//点击显示表格
        hideTableInterval: '',//表格的定时器，6秒隐藏表格
        showKKTip: false,//是否显示下拉三角菜单
        kktipIndex: 0,//点击下拉三角下的子菜单
        kktipList: [],//下拉三角的子菜单列表
        scrollTop: 0,//服务商数据的 scroll-view
        thisOrgnId: '',//哪一个机构的id，针对战略合作
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        this.setData({ dataPower: wx.getStorageSync('DATAPOWER') });
        this.getOrgnInfo();//获取机构列表
        this.getData();
    },

    onUnload: function () {
        clearInterval(this.data.hideBubbleInterval);//清除团体气泡定时器
        clearInterval(this.data.hideTableInterval);//清除表格定时器
    },

    /**
     * 游客统计-点击团体数出现气泡
     */
    clickTeamData: function (e) {
        var that = this;
        if (this.data.isTypes != 1) {
            return;
        }
        var index = e.currentTarget.dataset.index;
        if (index == 'empty') {
            that.setData({ clickIndex: null });//气泡隐藏
            clearInterval(that.data.hideBubbleInterval);//清除计时器
            return;
        }
        index = index == this.data.clickIndex ? null : index;
        this.setData({ groupDetail: [], clickIndex: index });

        var num = e.currentTarget.dataset.num;
        var _flowDate = e.currentTarget.dataset.flowDate;
        var _type = this.data.isChooseDate;
        // console.log(_flowDate, _type, num);
        if (index != null && num != 0) {//游客统计
            //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
            util.HttpRequst(true, "ztc/data/groupDetail", 1, wx.getStorageSync("sessionId"), { "flowDate": _flowDate, "type": _type }, "GET", false, function (res) {
                if (res.code == 200) {
                    var s = 0;//计数
                    that.setData({ groupDetail: res.content });
                    clearInterval(that.data.hideBubbleInterval);//先清除之前的定时器
                    that.data.hideBubbleInterval = setInterval(function () {// 6秒后气泡隐藏
                        s++;
                        if (s == 6) {
                            that.setData({ clickIndex: null });//气泡隐藏
                            clearInterval(that.data.hideBubbleInterval);//清除计时器
                        }
                    }, 1000);
                } else {
                    console.log(res)
                }
            });
        }
    },

    /**
     * 交易平台、分销平台：点击一行出现表格详情
     */
    clickTransactionNumber: function (e) {
        if (this.data.isShowModule) {//隐藏表格
            clearInterval(this.data.hideTableInterval);
            this.setData({ isShowModule: false });
        } else {
            var that = this;
            var _type = this.data.isChooseDate;
            var obj = e.currentTarget.dataset.item;
            var index = e.currentTarget.dataset.index;
            this.setData({ dataIndex: index });
            // console.log(obj.flowTime, _type, obj.orderNum);
            if (obj.orderNum != 0 && this.data.isTypes == 3) {//分销平台
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/data/retailerDetail", 1, wx.getStorageSync("sessionId"), { "flowDate": obj.flowTime, "type": _type }, "GET", false, function (res) {
                    that.clickTransactionNumberCallback(res);
                });
            }
            if (obj.orderNum != 0 && this.data.isTypes == 4) {//交易平台
                var ztcParam = { "flowDate": obj.flowTime, "type": _type };
                if (this.data.thisOrgnId) {
                    ztcParam.orgnId = this.data.thisOrgnId;
                }
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/data/ztcDetail", 1, wx.getStorageSync("sessionId"), ztcParam, "GET", false, function (res) {
                    that.clickTransactionNumberCallback(res);
                });
            }
            if (obj.orderNum != 0 && this.data.isTypes == 5) {//服务商数据
                const _orgnId = this.data.kktipList[this.data.kktipIndex].orgn_id;//机构ID
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/data/agentDetail", 1, wx.getStorageSync("sessionId"), { "flowDate": obj.flowTime, "type": _type, "orgnId": _orgnId }, "GET", false, function (res) {
                    that.clickTransactionNumberCallback(res);
                });
            }
        }
    },
    clickTransactionNumberCallback: function (res) {
        // console.log(res);
        if (res.code == 200) {
            var s = 0;//计时
            var that = this;
            that.setData({ moduleData: res.content, isShowModule: true });
            clearInterval(that.data.hideTableInterval);//先清除之前的定时器
            that.data.hideTableInterval = setInterval(function () {
                s++;
                if (s == 6) {
                    that.setData({ isShowModule: false });//表格隐藏
                    clearInterval(that.data.hideTableInterval);//清除定时器
                }
            }, 1000);
        } else {
            console.log(res)
        }
    },

    /**
     * 点击下拉三角
     */
    clickKKTip: function (e) {
        if (this.data.thisOrgnId == '') {
            this.setData({ showKKTip: !this.data.showKKTip });
        }
    },

    /**
     * 点击下拉三角的子菜单
     */
    clickKKTipItem: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            dataIndex: null,
            kktipIndex: index,
            showKKTip: false, 
            scrollTop: 0,//将数据表格置回第一条
            oneCount: 0,//将合计1归零
            twoCount: 0,//将合计2归零
            threeCount: 0,//将合计0归零
            list: [],//将数据清空
            page: 1,//页数清为1
            noneDatas: false,//将没有更多数据隐藏
        });
        var params = {
            "filterNum": this.data.isChooseDay,
            "type": this.data.isChooseDate,
            "page": this.data.page,
            "limit": this.data.limit
        }
        this.getAgentStatistics(params);
    },

    /**
     * 得到日周月的筛选
     */
    getFilterDate: function (e) {
        var types = e.currentTarget.dataset.type;
        this.setData({
            dataIndex: null,
            showKKTip: false,
            isChooseDate: types,
            list: [],
            page: 1,//将页数归1
            noneDatas: false,//将没有更多数据隐藏
        });

        this.getData();
    },

    /**
     * 得到10,30,60的筛选
     */
    getFilterDay: function (e) {
        var days = e.currentTarget.dataset.day;
        this.setData({
            isChooseDay: days,
            list: [],//将数据清空
            page: 1,//页数清为1
            noneDatas: false,//将没有更多数据隐藏
        });
        this.getData();
    },

    getChooseType: function (e) {
        var fliterType = e.currentTarget.dataset.choose;
        console.log('type', fliterType);
        this.setData({
            dataIndex: null,
            kktipIndex: 0,
            isTypes: fliterType,
            oneCount: 0,//将合计1归零
            twoCount: 0,//将合计2归零
            threeCount: 0,//将合计0归零
            list: [],//将数据清空
            page: 1,//页数清为1
            noneDatas: false,//将没有更多数据隐藏
        });
        var that = this;
        if (this.data.thisOrgnId != '' && this.data.kktipList.length > 0) {//循环匹配机构id
            this.data.kktipList.map(function (item, index, self) {
                if (item.orgn_id == that.data.thisOrgnId) {
                    that.setData({ kktipIndex: index });
                }
            });
        }
        this.getData();
    },

    getData: function () {
        var params = {
            "filterNum": this.data.isChooseDay,
            "type": this.data.isChooseDate,
            "page": this.data.page,
            "limit": this.data.limit
        }
        var thePower = this.data.dataPower;

        if (this.data.isTypes == 1 && thePower.ztcStatVisitor) {//游客统计
            this.setData({ title: ["日期", "个人", "团体", "合计"] });
            this.getTouristCount(params);

        } else if (this.data.isTypes == 3 && thePower.ztcStatZws) {//分销平台
            this.setData({ title: ["日期", "订单数", "交易数", "金额"] });
            this.getShenYueData(params);

        } else if (this.data.isTypes == 4 && thePower.ztcStatZtc) {//交易平台
            this.setData({ title: ["日期", "订单数", "交易数", "金额"] });
            this.getDirectTrain(params);

        } else if (this.data.isTypes == 5 && thePower.ztcStatAgent) {//服务商数据
            this.setData({ title: ["日期", "订单数", "交易数"] });
            this.getAgentStatistics(params);
        }
    },

    /**
     * 查询机构信息
     */
    getOrgnInfo: function () {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/data/getOrgnInfo", 1, wx.getStorageSync("sessionId"), { }, "GET", false, function (res) {
            if (res.code == 200) {
                var data = res.content;
                if (data.length > 0 && data[0].ORGN_NAME.indexOf('畅享游') != -1) {
                    data[0].ORGN_NAME = '全 部'; //机构列表第一个如果是畅享游，则表示是全部
                }
                that.setData({ kktipList: data });
            } else {
                console.log(res);
            }
        })
    },

    /**
     * 得到游客统计的数据
     */
    getTouristCount: function (param) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/data/visitorStatistics", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            // console.log('游客统计', res);
            if (res.code == 200) {
                var List = res.content.list;
                that.setData({
                    totalCount: res.content.totalCount,
                    totalPage: res.content.totalPage,
                    oneCount: res.fitVisitors,//得到第一位
                    twoCount: res.teamVisitors,//得到第二位
                    threeCount: res.totalVisitors,//得到第三位
                });
                if (that.data.loadMoreIs == false) {
                    that.setData({ list: List });
                } else {
                    var shanList = that.data.list.concat(List);
                    that.setData({ list: shanList });
                }
                that.getNoneData(List);
            } else {
                console.log(res);
            }
        })
    },

    /**
     * 得到分销平台的数据 
     */
    getShenYueData: function (param) {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/data/retailerStatistics", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            // console.log('分销平台', res);
            if (res.code == 200) {
                var List = res.content.list;
                that.setData({
                    totalCount: res.content.totalCount,
                    totalPage: res.content.totalPage,
                });
                List.map(function (item, i, arr) {
                    item.amount = that.formatCurrency(parseFloat(item.amount).toFixed(2));
                });
                if (that.data.loadMoreIs == false) {
                    that.setData({ list: List });
                } else {
                    that.setData({ list: that.data.list.concat(List) });
                }
                var two = that.formatCurrency(parseFloat(res.totalAmount).toFixed(2));
                that.setData({
                    oneCount: res.orderNum,
                    twoCount: res.ticketNum,
                    threeCount: two,
                    list: that.data.list
                });
                that.getNoneData(List);
            } else {
                console.log(res);
            }
        })
    },

    /**
     * 得到交易平台的数据
     */
    getDirectTrain: function (param) {
        var that = this;
        if (this.data.thisOrgnId) {//只查某个机构的数据
            param.orgnId = this.data.thisOrgnId;
        }
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/data/ztcStatistics", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            // console.log('交易平台', res);
            if (res.code == 200) {
                var List = res.content.list;
                that.setData({
                    totalCount: res.content.totalCount,
                    totalPage: res.content.totalPage,
                });
                List.map(function (item, i, arr) {
                    item.amount = that.formatCurrency(parseFloat(item.amount).toFixed(2));
                });
                if (that.data.loadMoreIs == false) {
                    that.setData({ list: List });
                } else {
                    that.setData({ list: that.data.list.concat(List) });
                }
                var two = that.formatCurrency(parseFloat(res.totalAmount).toFixed(2));
                that.setData({
                    oneCount: res.orderNum,
                    twoCount: res.ticketNum,
                    threeCount: two,
                    list: that.data.list
                });
                that.getNoneData(List);
            } else {
                console.log(res);
            }
        })
    },

    /**
     * 得到服务商数据
     */
    getAgentStatistics: function (param) {
        var that = this;
        param.orgnId = this.data.kktipList[this.data.kktipIndex].orgn_id;//需要传参机构ID
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/data/agentStatistics", 1, wx.getStorageSync("sessionId"), param, "GET", false, function (res) {
            // console.log('服务商数据', res);
            if (res.code == 200) {
                var List = res.content.list;
                that.setData({
                    totalCount: res.content.totalCount,
                    totalPage: res.content.totalPage,
                    oneCount: res.orderNum,//得到第一位
                    twoCount: res.ticketNum,//得到第二位
                    // threeCount: res.ticketNum,//得到第三位
                });
                if (that.data.loadMoreIs == false) {
                    that.setData({ list: List });
                } else {
                    var shanList = that.data.list.concat(List);
                    that.setData({ list: shanList });
                }
                that.getNoneData(List);
            } else {
                console.log(res);
            }
        })
    },

    getNoneData: function (List) {
        var that = this;
        if (List.length <= 0 | List.length < that.data.limit || that.data.totalPage <= that.data.page || (that.data.totalPage == that.data.page && List.length % that.data.limit == 0)) {//跟订单列表的效果是一样的，一定要记得点击其他的时候它设置回false
            // console.log("现在加载的页数啊" + that.data.page);
            that.setData({ noneDatas: true });
        }
    },

    /**
    * 加载更多
    */
    LoadMore: function (e) {
        var that = this;
        var currentTime = e.timeStamp;//得到当前加载的时间
        var lastTime = this.data.lastLoadTime;//得到上一次加载的时间
        if (currentTime - lastTime < 300) {
            console.log("时间间隔太短，不能算下拉加载");
            return;
        }
        var newPage = this.data.page + 1;
        if (that.data.totalPage >= newPage) {
            this.setData({
                page: newPage,
                lastLoadTime: e.timeStamp,
                loadMoreIs: true
            });
            this.getData();
        }
    },

    /**
     * 得到小数点，然后将三位一个逗号显示
     */
    formatCurrency: function (num) {
        //如果存在小数点，则获取数字的小数部分
        var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
        cents = cents.length > 1 ? cents : '';
        //获取数字的整数数部分
        num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
        if ('' == cents) {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else {
            if (num.length > 1 && '0' == num.substr(0, 1)) {
                return 'Not a Number ! ';
            }
        }
        /*
            也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
            字符串长度为0/1/2/3时都不用添加
            字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
         */
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        }
        //将数据（符号、整数部分、小数部分）整体组合返回
        return (num + cents);
    },
})