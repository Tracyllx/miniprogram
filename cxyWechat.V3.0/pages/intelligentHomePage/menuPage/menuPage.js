var util = require('../../../utils/util.js');
Page({
    data: {
        list: [],
    },
    onLoad: function(options) {
        var list  = [];
        const trafficPower = wx.getStorageSync('TRAFFICPOWER');
        if (trafficPower.ztcCarManager) {
            const vehicleStr = util.baseUrl + 'theMapList&name=sessionId&value=' + wx.getStorageSync("sessionId");
            list.push({
                id: "vehicle_monitoring",
                name: "车辆监控",
                url: '../../direct_train/pageHtml/pageHtml?id=' + vehicleStr
            });
        }
        if (trafficPower.ztcITSfaultApply) {
            list.push({
                id: "failure_declare",
                name: "车辆故障申报",
                url: '../declareList/declareList?isApply=true'
            });
        }
        if (trafficPower.ztcITSfaultManager) {
            list.push({
                id: "failure_management",
                name: "车辆故障管理",
                url: '../declareList/declareList?isApply=false'
            });
        }
        if (trafficPower.ztcITSattendance) {
            list.push({
                id: "staff_attendance",
                name: "员工考勤",
                url: '../staffAttendance/staffAttendance'
            });
        }
        this.setData({ list: list });
    },
})