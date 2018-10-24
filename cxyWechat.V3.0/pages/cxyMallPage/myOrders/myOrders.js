var util = require('../../../utils/util.js');
// 订单状态 orderStatus   1.待付款 2.已付款 3.已取消 4.退款中 5.已退款 6.已核销 7.已取票
// 产品类别 product_type  1:门票 2:酒店 3:特产 4:定制旅游 5:车辆租赁 6:美食
Page({
    data: {
        defaultImg: '../../img/cxyMallPage/defaultImg.png',
        theCarImg: util.baseUrl + 'img/intelligentTraffic/zc_type.png',
        showInput: false,//是否显示输入框
        inputFocus: false,//获取焦点
        searchVal: '搜索订单',//搜索值
        orderStatusArr: ['', '待付款', '已付款', '已取消', '退款中', '已退款', '已核销', '已取票'],
        navActive: 1,//1全部，2待付款，3已付款
        lastLoadTime: 0,//上一次加载的时间
        loadMoreIs: false,//监控是否是下拉加载更多
        dataList: [],//列表
        page: 1,//当前页数
        limit: 10,//每页显示的条数
        totalPage: 0,//总页数
        totalCount: 0,//总条数
        thisOrgnId: '',//哪一个机构的id，针对战略合作
    },
    onLoad: function (options) {
        if (options.thisOrgnId) {
            this.setData({ thisOrgnId: options.thisOrgnId });
        }
        this.getDataList();
    },
    onShow: function () {
        // this.setData({
        //     page: 1,
        //     dataList: [],
        // });
        // this.getDataList();
    },

    // 显示输入框
    searchBoxTap: function () {
        this.setData({
            showInput: true,
            inputFocus: true,
        });
    },

    // 监听输入框
    searchInput: function (e) {
        var val = e.detail.value;
        this.setData({
            searchVal: val,
        });
    },

    // 输入框失去焦点
    searchBlur: function (e) {
        var val = e.detail.value;
        this.setData({
            showInput: false,
            inputFocus: false,
            searchVal: val == '' ? '搜索订单' : val,
        });
    },

    // 输入框确定
    searchConfirm: function (e) {
        var val = e.detail.value;
        this.setData({
            showInput: false,
            inputFocus: false,
            searchVal: val,
        });
        this.getSearchResult(val);
    },

    // 点击导航栏
    navTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            navActive: index,
            page: 1,
            loadMoreIs: false,
            dataList: [],
        });
        this.getDataList();
    },

    // 点击订单按钮  product_type= 1:门票 2:酒店 3:特产 4:定制旅游 5:车辆租赁 6:美食
    theBtnTap: function (e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        var theType = e.currentTarget.dataset.theType;

        if (theType == 0) {//取消订单
            this.cancelOrder(index);

        } else if (theType == 1) {//付款
            wx.setStorageSync("orderStatus", list[index].orderStatus);
            const paramStr = '?orderId=' + list[index].orderId + '&orderTime=' + list[index].createTime;
            if (list[index].product_type == 4) {//订制旅游
                wx.navigateTo({
                    url: '../../direct_train/orderDetail/orderDetail' + paramStr,
                });
            } else {
                // wx.navigateTo({
                //     url: '../myOrderDetail/myOrderDetail',
                // });
                wx.navigateTo({
                    url: '../../direct_train/orderDetail/orderDetail' + paramStr,
                });
            }

        } else if (theType == 2) {//申请退款
            const obj = {
                'orderId': list[index].orderId,
                'orderImg': list[index].photos[0],
                'orderName': list[index].productName,
                'orderCount': list[index].ticketNum,
                'orderTotal': list[index].amount,
            }
            wx.setStorageSync('REFUNDINFO', obj);
            wx.navigateTo({
                url: '../refundPage/refundPage',
            });

        } else if (theType == 3) {//去评价
            var paramStr = '?orderId=' + list[index].orderId;
            // if (list[index].product_type == 1) {//游：是对机构评价
            //     paramStr = '?orgnId=' + list[index].orgnId;

            // } else if (list[index].product_type == 2) {//住：是对机构评价
            //     paramStr = '?orgnId=' + list[index].orgnId;

            // } else if (list[index].product_type == 3) {//购：是对订单评价
            //     paramStr = '?orderId=' + list[index].orderId;

            // } else if (list[index].product_type == 6) {//吃：是对机构评价
            //     paramStr = '?orgnId=' + list[index].orgnId;
            // }
            console.log(paramStr);//return;
            wx.navigateTo({
                url: '../comment/comment' + paramStr,
            });

        } else if (theType == 4) {//再来一单
            if (list[index].product_type == 4) {//订制旅游
                wx.navigateTo({
                    url: '../../direct_train/tailorMade_detail/tailorMade_detail?ticketcode=' + list[index].productId,
                });
            } else if (list[index].product_type == 5) {//租车
                wx.navigateTo({
                    url: '../../intelligentHomePage/intelligentHomePage?hasTab=false&tabIndex=2',
                });
            } else {
                var paramStr = '';
                if (list[index].product_type == 1) {
                    paramStr = '?id=' + list[index].orgnId + '&productTitle=tourism';

                } else if (list[index].product_type == 2) {
                    paramStr = '?id=' + list[index].orgnId + '&productTitle=live';

                } else if (list[index].product_type == 3) {
                    paramStr = '?id=' + list[index].productId + '&productTitle=buy';

                } else if (list[index].product_type == 6) {
                    paramStr = '?id=' + list[index].orgnId + '&productTitle=eat';
                }
                console.log(paramStr);//return;
                wx.navigateTo({
                    url: '../productDetail/productDetail' + paramStr,
                });
            }
        }
    },

    // 获取订单列表
    getDataList: function (e) {
        var that = this;
        var kkParams = { "limit": this.data.limit, "page": this.data.page };
        if (this.data.navActive != 1) {//除了全部以外的状态订单
            kkParams.type = this.data.navActive;
        }
        if (this.data.thisOrgnId) {
            kkParams.orgnId = this.data.thisOrgnId;
        }
        // console.log(kkParams);//return;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/order/orderList", 1, wx.getStorageSync('sessionId'), kkParams, "GET", false, function (res) {
            console.log(res);
            if (res.code == 200) {
                var datas = res.content.list;
                var endNewDate = new Date();
                datas.map(function (item, i, a) {
                    var theData = item.createTime.split(' ')[0];
                    var beginNewDate = new Date(theData.split('-')[0], theData.split('-')[1] - 1, theData.split('-')[2]);
                    var days = Math.floor((endNewDate.getTime() - beginNewDate.getTime()) / (24 * 3600 * 1000));
                    // console.log(endNewDate, beginNewDate, days);
                    item.overdue = days;
                })
                if (that.data.loadMoreIs == false) {
                    that.setData({
                        dataList: datas,
                        totalPage: res.content.totalPage,
                        totalCount: res.content.totalCount,
                    });
                } else {
                    that.setData({
                        dataList: that.data.dataList.concat(datas),
                        totalPage: res.content.totalPage,
                        totalCount: res.content.totalCount,
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

    // 加载更多
    loadMore: function (e) {
        var that = this;
        var currentTime = e.timeStamp;//得到当前加载的时间
        var lastTime = this.data.lastLoadTime;//得到上一次加载的时间
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
                loadMoreIs: true
            });
            this.getDataList();
        }
    },

    // 取消订单
    cancelOrder: function (index) {
        var that = this;
        var list = this.data.dataList;
        util.HttpRequst(true, "ztc/order/cancelOrder", 1, wx.getStorageSync("sessionId"), {
            'orderId': list[index].orderId,
        }, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                list.splice(index, 1);
                that.setData({ dataList: list });
                // that.getDataList();//更新订单列表
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