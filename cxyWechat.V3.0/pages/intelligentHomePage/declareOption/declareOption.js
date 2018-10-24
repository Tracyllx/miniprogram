var util = require('../../../utils/util.js');
Page({
    data: {
        titleText: '',//标题
        faultId: '',
        approver: '',//审批人
        costsTotal: '',//维修费用
        dateTime: '2018-07-02',//跟进时间
        startDate: '',//可选的开始时间
        endDate: '',//可选的结束时间
        detailTxt: '',//详情
        showType: false,//是否显示状态
        chooseType: '维修',//选中的状态
        handelMan: '',//处理人
    },
    onLoad: function (options) {
        if (options.titleText == 'approval') {
            wx.setNavigationBarTitle({ title: '故障审批详情' });

        } else if (options.titleText == 'followUp') {
            wx.setNavigationBarTitle({ title: '故障跟进详情' });
            this.setData({
                dateTime: util.formatTime(new Date()).split(' ')[0],
                startDate: (new Date()).getFullYear() + '-01-01',
                endDate: (new Date()).getFullYear() + '-12-31',
            });
        }
        this.setData({
            titleText: options.titleText || '',
            faultId: options.faultId || '',
        });
    },

    // 审批人
    approverInput: function (e) {
        var val = e.detail.value;
        this.setData({ approver: val });
    },

    // 维修费用
    costsTotalInput: function (e) {
        var val = e.detail.value;
        this.setData({ costsTotal: val });
    },

    // 跟进时间
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({ dateTime: e.detail.value });
    },

    // 详情
    detailTxtInput: function (e) {
        var val = e.detail.value;
        this.setData({ detailTxt: val });
    },

    // 显示or隐藏 状态
    chooseTypeTap: function () {
        this.setData({ showType: !this.data.showType });
    },

    // 选择状态
    chooseTypeItem: function (e) {
        var name = e.currentTarget.dataset.name;
        this.setData({ chooseType: name, showType: false });
    },

    // 处理人
    handelManInput: function (e) {
        var val = e.detail.value;
        this.setData({ handelMan: val });
    },

    // 底部按钮
    buttonTap: function (e) {
        var theType = e.currentTarget.dataset.theType;
        if (theType == 'save') {//保存
            if (this.data.detailTxt == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入详情！',
                });
            } else if (this.data.chooseType == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入状态！',
                });
            } else if (this.data.handelMan == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入处理人！',
                });
            } else {
                const obj = {
                    dateTime: this.data.dateTime,
                    detailTxt: this.data.detailTxt,
                    chooseType: this.data.chooseType,
                    handelMan: this.data.handelMan
                };
                this.saveFun(obj);
            }
        } else if (theType == 'cancel') {//取消
            wx.navigateBack();

        } else if (theType == 'pass') {//审批通过
            if (this.data.approver == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入审批人！',
                });
            } else if (this.data.costsTotal == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入维修费用！',
                });
            } else {
                const obj = {
                    faultId: this.data.faultId,
                    approver: this.data.approver,
                    estimatedCost: this.data.costsTotal,
                    status: 2,
                };
                this.passFun(obj);
            }
        } else if (theType == 'noPass') {//审批不通过
            if (this.data.approver == '') {
                wx.showModal({
                    title: '提示',
                    content: '请输入审批人！',
                });
            } else {
                const obj = {
                    faultId: this.data.faultId,
                    approver: this.data.approver,
                    status: 3,
                };
                this.passFun(obj);
            }
        }
    },

    // 保存
    saveFun: function (param) {
        var that = this;
        // 4：维修 5：换件 6：自主检修
        param.status = param.chooseType == '维修' ? 4 : param.chooseType == '换件' ? 5 : 6;
        util.HttpRequst(true, "ztc/fault/handleFault", 1, wx.getStorageSync("sessionId"), {
            'followUpDate': param.dateTime,
            'followUpDetail': param.detailTxt,
            'faultId': this.data.faultId,
            'status': param.status,
            'handler': param.handelMan
        }, "GET", true, function (res) {
            if (res.code == 200) {
                wx.navigateBack();
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

    // 通过
    passFun: function (param) {
        var that = this;
        util.HttpRequst(true, "ztc/fault/approveFault", 1, wx.getStorageSync("sessionId"), param, "GET", true, function (res) {
            if (res.code == 200) {
                wx.navigateBack();
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
})