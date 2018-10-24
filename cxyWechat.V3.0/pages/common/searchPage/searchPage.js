var util = require('../../../utils/util.js');
Page({
    data: {
        focusVal: true,
        showHistory: true,
        inputVal: '',
        result: [],
        historyRes: [],
        productTypes: ['', '游', '住', '购', '定制旅游', '车辆租赁', '吃'],
    },
    onLoad: function (options) {
        var historyRes = wx.getStorageSync('HISTORYRES') || [];
        this.setData({ historyRes: historyRes.reverse() });
    },

    // 点击搜索结果item
    gotoDetail: function (e) {
        this.saveHistoryResult(this.data.inputVal);//保存历史搜索
        // 跳转到对应产品
        var result = this.data.result;
        var index = e.currentTarget.dataset.index;
        if (result[index].productType == 1) {
            wx.redirectTo({
                url: '../../cxyMallPage/productDetail/productDetail?id=' + result[index].orgnId + '&productTitle=tourism',
            });
        } else if (result[index].productType == 2) {
            wx.redirectTo({
                url: '../../cxyMallPage/productDetail/productDetail?id=' + result[index].orgnId + '&productTitle=live',
            });
        } else if (result[index].productType == 3) {
            wx.redirectTo({
                url: '../../cxyMallPage/productDetail/productDetail?id=' + result[index].productId + '&productTitle=buy',
            });
        } else if (result[index].productType == 6) {
            wx.redirectTo({
                url: '../../cxyMallPage/productDetail/productDetail?id=' + result[index].orgnId + '&productTitle=eat',
            });
        }
    },

    // 监听输入框
    searchInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({ showHistory: false, inputVal: val });//关闭历史搜索
            this.getData(val);//获取数据
        } else {
            this.setData({ showHistory: true });//打开历史搜索
        }
    },

    // 回车键/确定按钮
    searchConfirm: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {//将搜索关键词保存成历史搜索
            this.setData({ inputVal: val });
            this.saveHistoryResult(val);//保存历史搜索
        }
    },

    // 点击历史搜索结果item
    historyItem: function (e) {
        this.setData({ showHistory: false });//关闭历史搜索
        var index = e.currentTarget.dataset.index;
        var name = this.data.historyRes[index];
        this.setData({ inputVal: name });
        this.getData(name);//获取数据
    },

    // 清除
    clearHistory: function (e) {
        if (wx.getStorageSync('HISTORYRES')) {
            wx.removeStorageSync('HISTORYRES');
            this.setData({ historyRes: [] });
        }
    },

    // 保存历史搜索
    saveHistoryResult: function (keywords) {
        var historyRes = wx.getStorageSync('HISTORYRES') || [];
        historyRes.push(keywords);
        historyRes.unique = function () { //数组去重(对象存放，哈希算法(映射)判断)
            // n为hash表，r为临时数组
            var n = {}, r = [];
            for (var i = 0; i < this.length; i++) {
                // 如果hash表中没有当前项
                if (!n[this[i]]) {
                    // 存入hash表
                    n[this[i]] = true;
                    // 把当前数组的当前项push到临时数组里面
                    r.push(this[i]);
                }
            }
            return r;
        }
        wx.setStorageSync('HISTORYRES', historyRes.unique());
    },

    // 数据请求
    getData: function (keywords) {
        var that = this;
        var orgnList = [], productsList = [];
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/product/list", 2, "", {
            "productOrOrgnName": keywords
        }, "GET", false, function (res) {
            // console.log(res);
            if (res.code == 200) {
                var list = res.list;
                if (list.length > 0) {
                    list.map(function (item1, i, self1) {
                        if (item1.orgnName.indexOf(keywords) >= 0) {//匹配关键字
                            orgnList.push({
                                'name': item1.orgnName,
                                'orgnId': item1.orgnId,
                                'productId': item1.product[0] ? item1.product[0].productId : '',
                                'productType': item1.product[0] ? item1.product[0].productType : '',
                            });
                        }
                        if (item1.product.length > 0) {
                            item1.product.map(function (item2, j, self2) {
                                if (item2.productType == 1 || item2.productType == 2 || item2.productType == 3 || item2.productType == 6) {
                                    // 1游，2住，3购，6吃
                                    if (item2.productName.indexOf(keywords) >= 0) {//匹配关键字
                                        productsList.push({
                                            'name': item2.productName,
                                            'orgnId': item1.orgnId,
                                            'productId': item2.productId,
                                            'productType': item2.productType,
                                        });
                                    }
                                } else if (item2.productType == 4) { // 定制旅游
                                    // productsList.push();

                                } else if (item2.productType == 5) { // 车辆租赁
                                    // productsList.push();

                                }
                            });
                        } else {
                            console.log('该机构下没有产品！');
                        }
                    });
                    // console.log(orgnList);
                    // console.log(productsList);
                    that.setData({ result: orgnList.concat(productsList) });
                } else {
                    console.log('没有搜索结果！');
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
})