var util = require('../../../utils/util.js');
var pageTimer = [];//页面中的所有定时器
Page({
    data: {
        HTTPS: util.baseUrl,
        isCheck: false,//是否勾选
        isCheckIndex: 0,//是否勾选的 item
        showAddBox: false,//是否显示弹窗
        dataList: [],//列表
        errorTip: '',//错误提示语
        codeText: '获取验证码',//验证码按钮文字
        codeMin: 60,//验证码倒计时
        codeFocus: false,//是否获取验证码焦点
        showCodeBox: true,//是否显示验证码
        nameVal: '',//姓名
        phoneVal: '',//手机号
        codeVal: '',//验证码
        optionIndex: '',//当前操作的是哪个 item
        optionType: '',//操作类型：edit、del
    },
    onLoad: function (options) {
        if (options.concatIndex && options.concatIndex != '') {
            // 存在已选中的联系人
            this.setData({
                isCheck: true,
                isCheckIndex: options.concatIndex,
            });
        }
        this.getDataList();
    },

    // 勾选
    checkTap: function (e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        this.setData({
            isCheck: true,
            isCheckIndex: index,
        });
        var pages = getCurrentPages(); //获取所有页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            concatIndex: index,
            concatId: list[index].id,
            concatName: list[index].contactName,
            concatPhone: list[index].contactPhone,
        });
        wx.navigateBack();
    },

    // 显示新增窗口
    addTap: function (e) {
        var txt = e.currentTarget.dataset.txt;
        this.setData({
            nameVal: '',
            phoneVal: '',
            codeVal: '',
            optionType: txt,
        });
        if (txt === 'add') {
            this.setData({
                showAddBox: true,
                showCodeBox: true,//显示获取验证码
                codeText: "获取验证码",
                codeMin: 60,
            });
        } else if (txt === 'cancel') {
            this.setData({ showAddBox: false });
        }
    },

    // 编辑 or 删除
    optionTap: function (e) {
        var list = this.data.dataList;
        var txt = e.currentTarget.dataset.txt;
        var index = e.currentTarget.dataset.index;
        this.setData({
            optionIndex: index,
            optionType: txt
        });
        if (txt === 'edit') {
            this.setData({
                showAddBox: true,//显示弹窗
                showCodeBox: false,//隐藏获取验证码
                nameVal: list[index].contactName,
                phoneVal: list[index].contactPhone,
            });

        } else if (txt === 'del') {
            this.deleteContact(list[index].id);
        }
    },

    // 保存按钮
    saveTap: function (e) {
        if (this.data.errorTip != '') {
            return;
        }
        if (this.data.nameVal == '') {
            this.setData({ errorTip: '姓名不能为空！' });
            return;
        }
        if (this.data.phoneVal == '') {
            this.setData({ errorTip: '手机号不能为空！' });
            return;
        }
        if (this.data.optionType === 'add') {
            if (this.data.codeVal == '') {
                this.setData({ errorTip: '验证码不能为空！' });
                return;
            }
            this.newlyAdded();//新增
        }
        if (this.data.optionType === 'edit') {
            this.updateContact();//编辑
        }
    },

    // 姓名监听
    nameInput: function (e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                nameVal: val,
                errorTip: '',
            });
        }
    },

    // 电话监听
    phoneInput: function (e) {
        var val = e.detail.value;
        var regs = /^1(3|4|5|7|8)[0-9]{9}$/;
        if (val.length == 11) {
            if (regs.test(val)) {
                this.setData({
                    phoneVal: val,
                    errorTip: '',
                });

                // 编辑时做处理
                if (this.data.optionType === 'edit') {
                    var list = this.data.dataList;
                    var index = this.data.optionIndex;
                    if (list[index].contactPhone != val) {
                        this.setData({ showCodeBox: true });
                    } else {
                        this.setData({ showCodeBox: false });
                    }
                }
            } else {
                this.setData({
                    errorTip: '手机号有误，请输入正确的手机号！',
                });
            }
        } else {
            this.setData({ errorTip: '' });
        }
    },

    // 验证码监听
    codeInput: function (e) {
        var that = this;
        var val = e.detail.value;
        if (val.length == 6) {
            this.setData({ codeVal: val });
        }
        if (val.length < 6) {
            this.setData({ errorTip: '' });
        }
    },

    // 获取验证码
    getCodeTap: function (e) {
        var timer;
        var that = this;
        var countdown = 60;//倒数60s
        var phoneLen = this.data.phoneVal.toString().length;
        if (phoneLen < 11 && phoneLen > 0) {
            this.setData({ errorTip: "手机号有误，请输入正确的手机号！" });
        } else if (phoneLen == 0) {
            this.setData({ errorTip: "手机号不能为空！" });
        } else if (phoneLen == 11) {
            if (this.data.errorTip == "") {
                //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
                util.HttpRequst(true, "ztc/product/sendMsgCode", 3, wx.getStorageSync("sessionId"), {
                    "userPhone": that.data.phoneVal
                }, "POST", true, function (res) {
                    console.log(res)
                    if (res.code == 200) {
                        pageTimer['timer1'] = setTimeout(function () {
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
            pageTimer['timer2'] = setTimeout(function () {
                that.fun();
            }, 1000);
        }
    },

    // 查询联系人列表
    getDataList: function () {
        var that = this;
        util.HttpRequst(true, "ztc/user/contactList", 1, wx.getStorageSync("sessionId"), {}, "GET", true, function (res) {
            // console.log(res);
            if (res.code == 200) {
                that.setData({ dataList: res.list });
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

    // 新增联系人
    newlyAdded: function (e) {
        var that = this;
        console.log('提交！');
        util.HttpRequst(true, "ztc/user/addContact", 1, wx.getStorageSync("sessionId"), {
            "contactName": this.data.nameVal,
            "contactPhone": this.data.phoneVal,
            "code": this.data.codeVal,
        }, "GET", true, function (res) {
            console.log(res);
            if (res.code == 200) {
                that.setData({ showAddBox: false });
                that.getDataList();//更新列表
                for (var i = 0; i < pageTimer.length; i++) {
                    // 情况页面开启的所有定时器
                    clearTimeout(pageTimer[i]);
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

    // 编辑联系人
    updateContact: function () {
        var that = this;
        var list = this.data.dataList;
        var index = this.data.optionIndex;
        if (list[index].contactName === this.data.nameVal && list[index].contactPhone === this.data.phoneVal) {
            wx.showToast({ title: '您未做任何修改！', icon: 'success' });
            that.setData({ showAddBox: false });
            return;
        } else {
            var params = {
                "contactId": list[index].id,
                "contactName": this.data.nameVal,
                "contactPhone": this.data.phoneVal
            }
            if (list[index].contactPhone != this.data.phoneVal) {// 修改了手机号
                if (this.data.codeVal == '') {
                    this.setData({ errorTip: '验证码不能为空！' });
                    return;
                }
                params.code = this.data.codeVal;
            }
            // console.log(params);return;
            util.HttpRequst(true, "ztc/user/updateContact", 1, wx.getStorageSync("sessionId"), params, "GET", true, function (res) {
                console.log(res);
                if (res.code == 200) {
                    that.setData({ showAddBox: false });
                    that.getDataList();//更新列表
                    for (var i = 0; i < pageTimer.length; i++) {
                        // 情况页面开启的所有定时器
                        clearTimeout(pageTimer[i]);
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
        }
    },

    // 删除联系人
    deleteContact: function (contactId) {
        var that = this;
        console.log('删除！');
        util.HttpRequst(true, "ztc/user/deleteContact", 1, wx.getStorageSync("sessionId"), {
            "contactId": contactId,
        }, "GET", true, function (res) {
            console.log(res);
            if (res.code == 200) {
                that.getDataList();//更新列表
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