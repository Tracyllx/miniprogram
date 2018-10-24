var util = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        HTTPS: util.baseUrl,
        imgHome: false, //首页变灰
        imgPersonal: true, //个人中心变亮
        cooperationName: 'CXY',
        thisOrgnId: '', //哪一个机构的id，针对战略合作
        // ---------------------------------
        noRead: 0, //信息未读的条数
        show_unreadNum: true, //当未读信息为0时，不显示未读提示
        head_url: "", //头像地址
        nick_name: "", //微信名字
        signature: "", //签名
        scrollerHeight: 0,
        list: [], //菜单列表
        myWallet: 0, //余额
        myRedBag: 0, //红包
        myCoupon: 0, //优惠券
        isValD: false, //是否认证
    },
    onLoad: function(options) {
        // 从战略伙伴进来的
        if (options.cooperationName) {
            if (options.cooperationName === "ENSHI") {
                this.setData({
                    thisOrgnId: util.enshiOrgnId, //恩施之旅的机构ID
                });
            } else if (options.cooperationName === "XMS") {
                this.setData({
                    thisOrgnId: util.xmsOrgnId, //香蜜庄园的机构ID
                });
            }
            this.setData({
                cooperationName: options.cooperationName
            });
        }
        var that = this;
        wx.getStorage({
            key: 'head_url',
            success: function(res) {
                that.setData({
                    head_url: res.data
                });
            },
        });
    },
    onShow: function() {
        if (this.data.thisOrgnId) {
            this.setData({
                list: [{
                        id: "my_order",
                        name: "我的订单",
                        url: '../cxyMallPage/myOrders/myOrders?thisOrgnId=' + this.data.thisOrgnId
                    },
                    {
                        id: "service_guide",
                        name: "服务指引",
                        url: '../direct_train/serviceGuide/serviceGuide'
                    },
                    {
                        id: "about_us",
                        name: "关于我们",
                        url: './about_us/about_us'
                    }
                ],
            });
        } else {
            this.setData({
                list: [
                    {
                        id: "my_order",
                        name: "我的订单",
                        url: '../cxyMallPage/myOrders/myOrders'
                    },
                    {
                        id: "my_collect",
                        name: "我的收藏",
                        url: '../cxyMallPage/myCollection/myCollection'
                    },
                    {
                        id: "service_guide",
                        name: "服务指引",
                        url: '../direct_train/serviceGuide/serviceGuide'
                    },
                    {
                        id: "about_us",
                        name: "关于我们",
                        url: './about_us/about_us'
                    },
                ],
            });
        }
        this.getAllInfo();
    },
    // 进入消息列表 
    gotoMessage: function(e) {
        wx.navigateTo({
            url: './messages/messages',
        });
    },
    //修改个人资料
    gotoMyInfo: function() {
        wx.navigateTo({
            url: './personal_detail/personal_detail',
        });
    },
    // 进入首页
    changeHomeActive: function(e) {
        if (this.data.cooperationName === 'ENSHI') {
            wx.redirectTo({
                url: '../subPackages/page/ENSHIHomePage/ENSHIHomePage',
            });
        } else if (this.data.cooperationName === 'XMS') {
            wx.redirectTo({
                url: '../subPackages/page/XMSHomePage/XMSHomePage',
            });
        } else {
            wx.redirectTo({
                url: '../cxtripHomePage/cxtripHomePage',
            });
        }
    },
    // 余额、红包、优惠券
    propertyGoto: function(e) {
        var currId = e.currentTarget.dataset.id;
        if (currId == 1) {
            wx.navigateTo({
                url: './myWallet/myWallet?isValD=' + this.data.isValD,
            });
        }
        if (currId == 2) {
            wx.navigateTo({
                url: './redPacket_coupon/redPacket_coupon?isType=redPacket',
            });
        }
        if (currId == 3) {
            wx.navigateTo({
                url: './redPacket_coupon/redPacket_coupon?isType=coupon',
            });
        }
    },
    getAllInfo: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/allInfo", 1, wx.getStorageSync("sessionId"), {
            sessionId: wx.getStorageSync("sessionId")
        }, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                // 实名认证
                // console.log(res.userInfo.real_name, res.userInfo.cert_id);
                if (res.userInfo.real_name && res.userInfo.cert_id) {
                    that.setData({
                        isValD: true
                    });
                }
                // 用户信息
                that.setData({
                    myWallet: res.balance.avail_balance,
                    noRead: res.userInfo.unread_num,
                    nick_name: res.userInfo.nick_name,
                    head_url: res.userInfo.head_url,
                    signature: res.userInfo.signature,
                    myRedBag: res.redpackList ? res.redpackList.length : 0,
                    myCoupon: res.couponList ? res.couponList.length : 0,
                });
                if (that.data.noRead == 0) { //当未读信息为0时，隐藏未读提示数字
                    that.setData({
                        show_unreadNum: false
                    });
                }
                // 菜单权限
                var menuList = res.menuList;
                if (menuList == null || menuList == "" || menuList.length == 0) {
                    return;
                }
                var ticketPower = {}; //核票验票的权限
                var dataPower = {}; //查看数据统计的权限
                var trafficPower = {}; //智慧交通菜单的权限
                for (var i = 0; i < menuList.length; i++) {
                    var powerName = menuList[i].perms;
                    if (powerName == "ztcVerifyTicket") {
                        var shanlist = [{
                            id: "nuclear_ticket",
                            name: "核票验票",
                            // url: '../direct_train/nuclearTickets/nuclearTickets'
                            url: '../direct_train/checkTickets/checkTickets'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcSchedule" && that.data.thisOrgnId == "") {
                        var shanlist = [{
                            id: "shuttler",
                            name: "直通车调度",
                            url: '../direct_train/shuttleMes/shuttleMes'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcStatistics") {
                        var shanlist = [{
                            id: "data",
                            name: "数据统计",
                            url: './all_data_statustics/all_data_statustics?thisOrgnId=' + that.data.thisOrgnId
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcITS") {
                        var shanlist = [{
                            id: "intelligent_traffic",
                            name: "智慧交通",
                            url: '../intelligentHomePage/menuPage/menuPage'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    }
                    // 车辆监控已迁移到智慧交通中
                    // else if (powerName == "ztcCarManager" && that.data.thisOrgnId == "") {
                    //     const gotoUrl = util.baseUrl + 'theMapList&name=sessionId&value=' + wx.getStorageSync("sessionId");
                    //     var shanlist = [{
                    //         id: "car_watch",
                    //         name: "车辆监控",
                    //         url: '../direct_train/pageHtml/pageHtml?id=' + gotoUrl,
                    //     }];
                    //     that.data.list = that.data.list.concat(shanlist);
                    //     that.setData({ list: that.data.list })
                    // }
                    else if (powerName == "ztcExperience") {
                        var shanlist = [{
                            id: "demo",
                            name: "产品体验中心",
                            url: '../demoMenu/demoMenu',
                            width: '56rpx',
                            height: '56rpx'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcCheckRide") {
                        ticketPower.ztcCheckRide = powerName;
                    } else if (powerName == "ztcCheckWzs") {
                        ticketPower.ztcCheckWzs = powerName;
                    } else if (powerName == "ztcCheckZsd") {
                        ticketPower.ztcCheckZsd = powerName;
                    } else if (powerName == "ztcCheckXms") {
                        ticketPower.ztcCheckXms = powerName;
                    } else if (powerName == "ztcCheckAll") {
                        ticketPower.ztcCheckAll = powerName;

                    } else if (powerName == "ztcStatVisitor") {
                        dataPower.ztcStatVisitor = powerName;
                    } else if (powerName == "ztcStatZtc") {
                        dataPower.ztcStatZtc = powerName;
                    } else if (powerName == "ztcStatZws") {
                        dataPower.ztcStatZws = powerName;
                    } else if (powerName == "ztcStatAgent") {
                        dataPower.ztcStatAgent = powerName;

                    } else if (powerName == "ztcCarManager") {
                        trafficPower.ztcCarManager = powerName;
                    } else if (powerName == "ztcITSfaultApply") {
                        trafficPower.ztcITSfaultApply = powerName;
                    } else if (powerName == "ztcITSfaultManager") {
                        trafficPower.ztcITSfaultManager = powerName;
                    } else if (powerName == "ztcITSattendance") {
                        trafficPower.ztcITSattendance = powerName;
                    }
                    wx.setStorageSync('TICKETPOWER', ticketPower); //保存核票验票的权限
                    wx.setStorageSync('DATAPOWER', dataPower); //保存数据统计的权限
                    wx.setStorageSync('TRAFFICPOWER', trafficPower); //保存智慧交通菜单的权限
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
    getPower: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/user/menu", 1, wx.getStorageSync("sessionId"), {
            sessionId: wx.getStorageSync("sessionId")
        }, "GET", true, function(res) {
            if (res.code == 200) {
                var menuList = res.menuList;
                if (menuList == null || menuList == "") {
                    return;
                }
                var ticketPower = {}; //核票验票的权限
                var dataPower = {}; //查看数据统计的权限
                for (var i = 0; i < menuList.length; i++) {
                    var powerName = menuList[i].perms;
                    if (powerName == "ztcVerifyTicket") {
                        var shanlist = [{
                            id: "nuclear_ticket",
                            name: "核票验票",
                            // url: '../direct_train/nuclearTickets/nuclearTickets'
                            url: '../direct_train/checkTickets/checkTickets'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcSchedule") {
                        var shanlist = [{
                            id: "shuttler",
                            name: "直通车调度",
                            url: '../direct_train/shuttleMes/shuttleMes'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcStatistics") {
                        var shanlist = [{
                            id: "data",
                            name: "数据统计",
                            url: './all_data_statustics/all_data_statustics'
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })
                    } else if (powerName == "ztcCarManager") {
                        const gotoUrl = util.baseUrl + 'theMapList&name=sessionId&value=' + wx.getStorageSync("sessionId");
                        var shanlist = [{
                            id: "car_watch",
                            name: "车辆监控",
                            url: '../direct_train/pageHtml/pageHtml?id=' + gotoUrl,
                        }];
                        that.data.list = that.data.list.concat(shanlist);
                        that.setData({
                            list: that.data.list
                        })

                    } else if (powerName == "ztcCheckRide") {
                        ticketPower.ztcCheckRide = powerName;
                    } else if (powerName == "ztcCheckWzs") {
                        ticketPower.ztcCheckWzs = powerName;
                    } else if (powerName == "ztcCheckZsd") {
                        ticketPower.ztcCheckZsd = powerName;
                    } else if (powerName == "ztcCheckXms") {
                        ticketPower.ztcCheckXms = powerName;
                    } else if (powerName == "ztcCheckAll") {
                        ticketPower.ztcCheckAll = powerName;

                    } else if (powerName == "ztcStatVisitor") {
                        dataPower.ztcStatVisitor = powerName;
                    } else if (powerName == "ztcStatZtc") {
                        dataPower.ztcStatZtc = powerName;
                    } else if (powerName == "ztcStatZws") {
                        dataPower.ztcStatZws = powerName;
                    } else if (powerName == "ztcStatAgent") {
                        dataPower.ztcStatAgent = powerName;
                    }
                    wx.setStorageSync('TICKETPOWER', ticketPower); //保存核票验票的权限
                    wx.setStorageSync('DATAPOWER', dataPower); //保存数据统计的权限
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
    getMessage: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/user/info", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function(res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({
                    noRead: res.userInfo.unread_num,
                    nick_name: res.userInfo.nick_name,
                    head_url: res.userInfo.head_url,
                    signature: res.userInfo.signature
                })
                if (that.data.noRead == 0) {
                    that.setData({
                        show_unreadNum: false //当未读信息为0时，隐藏未读提示数字
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
    },
    getMyWallet: function() {
        var that = this;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(false, "ztc/wallet/balance", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function(res) {
            if (res.code == 200) {
                that.setData({
                    myWallet: res.result.avail_balance
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
    },
})