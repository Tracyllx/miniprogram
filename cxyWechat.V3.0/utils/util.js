const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// const baseUrl = "https://hi.cxtrip.cc/cxyTicket/";//开发环境

// const baseUrl = "https://wechat.cxtrip.cc/preproduct/";//体验版环境

const baseUrl = "https://wechat.cxtrip.cc/cxyTicket/";//正式环境

module.exports = {
    enshiOrgnId: 49, //恩施之旅的机构ID：179是测试，49正式环境
    xmsOrgnId: 39, //香蜜庄园的机构ID：187是测试，39正式环境
    formatTime: formatTime,
    baseUrl: baseUrl,
    newLogin: newLogin,
    newSaveUser: newSaveUser,
    HttpRequst: HttpRequst,
}

//sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
//ask是是否要进行询问授权，true为要，false为不要
//sessionChoose为1,2,3,4,所以paramSession下标为0的则为空
function HttpRequst(loading, url, sessionChoose, sessionId, params, method, ask, callBack) {
    if (loading == true) {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading'
        });
    }
    var paramSession = [{},
    { 'content-type': 'application/json', 'Cookie': 'JSESSIONID=' + sessionId },
    { 'content-type': 'application/json' },
    { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + sessionId },
    { 'content-type': 'application/x-www-form-urlencoded' }]
    wx.request({
        url: baseUrl + url,
        data: params,
        dataType: "json",
        header: paramSession[sessionChoose],
        method: method,
        success: function (res) {
            if (loading == true) {
                wx.hideToast();//隐藏提示框
            }
            if (res.data.code == 5000) {
                console.log('code:', res.data.code);
                wxLogin(loading, url, sessionChoose, sessionId, params, method, ask, callBack);
            }
            callBack(res.data);
        },
        complete: function () {
            if (loading == true) {
                wx.hideToast();//隐藏提示框
            }
        }
    })
}

function wxLogin(loading, url, sessionChoose, sessionId, params, method, ask, callBack) {
    const newStamp = new Date().getTime();
    const oldStamp = wx.getStorageSync('UTILTIMESTAMP');
    if (oldStamp && newStamp - oldStamp < 2000) { // 防止2秒内多次调用 wx.login() 方法
        console.log('小于2秒');
    } else {
        console.log(newStamp - oldStamp);
        wx.setStorageSync('UTILTIMESTAMP', newStamp);
        wx.login({
            success: function (res) {
                var code = res.code;//得到code
                HttpRequst(true, "ztc/product/login", false, "", { "code": code }, "GET", false, function (res) {
                    if (res.code == 200) {
                        console.log('set sessionId')
                        wx.setStorageSync('sessionId', res.sessionId);
                        if (res.isNeedUserInfo == true) {//用户从未授权用户信息过就进入这里
                            console.log('该用户从未授权')
                            // wx.navigateTo({
                            //     url: '../authorization/authorization',
                            // });
                        } else {//用户之前已授权用户信息
                            HttpRequst(loading, url, sessionChoose, wx.getStorageSync("sessionId"), params, method, ask, callBack);
                        }
                    }
                })
            }
        });
    }
}

function newSaveUser(result, callBack) {
    wx.request({
        url: baseUrl + "ztc/product/saveUser",
        data: { "encryptedData": result.encryptedData, "iv": result.iv },
        dataType: "json",
        header: { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId') },
        method: "POST",
        success: function (res) {
            // console.log(res.data)
            if (res.data.code == 200) {
                callBack();
            }
        },
        complete: function () {

        }
    })
}

function newLogin(callBack) {
    wx.login({
        success: res => {
            const code = res.code;
            wx.request({
                url: baseUrl + "ztc/product/login",
                data: { "code": code },
                dataType: "json",
                header: { "content-type": "application/json" },
                method: "GET",
                success: function (res) {
                    if (res.data.code == 200) {
                        console.log('newLogin set sessionId')
                        wx.setStorageSync('sessionId', res.data.sessionId);
                        callBack(res.data.isNeedUserInfo);
                    }
                },
                complete: function () {

                }
            })
        }
    })
}

/**



wx.getUserInfo({
    success: function (res) {
        HttpRequst(true, "ztc/product/saveUser", 3, wx.getStorageSync("sessionId"), { "encryptedData": res.encryptedData, "iv": res.iv }, "POST", false, function (res) {
            HttpRequst(loading, url, sessionChoose, wx.getStorageSync("sessionId"), params, method, ask, callBack);
        })
    },
    fail: function (res) {
        console.log("我还没有授权");
        if (ask == true) {
            wx.showModal({
                title: '提示',
                confirmText: "授权",
                content: '若不授权微信登陆，则无法正常使用畅享游小程序的功能；点击重新授权，则重新使用；若点击不授权，后期还使用小程序，需在微信【发现】--【小程序】--删除【广东畅享游】，重新搜索授权登陆，方可使用',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        wx.openSetting({
                            success: function (res) {
                                console.log(res)
                                if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                                    //这里是授权成功之后 填写你重新获取数据的js
                                    wx.getUserInfo({
                                        withCredentials: false,
                                        success: function (data) {
                                            HttpRequst(true, "ztc/product/saveUser", 3, wx.getStorageSync("sessionId"), { "encryptedData": res.encryptedData, "iv": res.iv }, "POST", false, function (res) {
                                                HttpRequst(loading, url, sessionChoose, wx.getStorageSync("sessionId"), params, method, ask, callBack);
                                            })
                                        },
                                        fail: function () {
                                            console.info("3授权失败返回数据");
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            })
        }
    }
})


 */