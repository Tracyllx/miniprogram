var util = require('../../../utils/util.js');
Page({
    data: {
        HTTPS: util.baseUrl,
        titleText: '', //标题
        isDisabled: true, //是否不可填写
        carNum: '', //车辆编号
        userName: '', //报障人
        showType: false, //是否显示故障类型
        chooseType: '一般故障', //选中的故障类型
        contentVal: '', //故障内容
        contentLen: 0, //故障内容的长度
        chooseImgUrls: [], //选择的图片
        chooseCount: 5, //选择图片的数量
        chooseMax: 5, //最多上传的图片数
        touch_start: 0, //触摸图片开始时间
        touch_end: 0, //触摸图片结束时间
        del: false, //是否显示删除图片按钮
        sendBtn: false, //是否激活发表按钮
        approver: '审批人', //审批人
        costsTotal: '维修费用', //维修费用
    },
    onLoad: function(options) {
        if (options.titleText == 'apply') {
            wx.setNavigationBarTitle({
                title: '故障申报'
            });
            this.setData({
                isDisabled: false
            });

        } else if (options.titleText == 'approval') {
            wx.setNavigationBarTitle({
                title: '故障审批详情'
            });
            this.setData({
                faultId: options.faultId,
            });
            this.getFaultInfo();

        } else if (options.titleText == 'followUp') {
            wx.setNavigationBarTitle({
                title: '故障跟进详情'
            });
            this.setData({
                faultId: options.faultId,
            });
            this.getFaultInfo();
        }
        this.setData({
            titleText: options.titleText || ''
        });
    },

    // 审批or跟进
    gotoOption: function(e) {
        var theType = e.currentTarget.dataset.theType;
        if (theType == '审批') {
            wx.redirectTo({
                url: '../declareOption/declareOption?titleText=' + this.data.titleText + '&faultId=' + this.data.faultId,
            });
        } else if (theType == '跟进') {
            wx.redirectTo({
                url: '../declareOption/declareOption?titleText=' + this.data.titleText + '&faultId=' + this.data.faultId,
            });
        }
    },

    // 取消
    cancelTap: function() {
        wx.navigateBack();
    },

    // 车辆编号
    carNumInput: function(e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                carNum: val
            });
            if (this.data.userName && this.data.chooseType && this.data.contentVal && this.data.address) {
                this.setData({
                    sendBtn: true
                });
            }
        } else {
            this.setData({
                sendBtn: false
            });
        }
    },

    // 报障人
    userNameInput: function(e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                userName: val
            });
            if (this.data.carNum && this.data.chooseType && this.data.contentVal && this.data.address) {
                this.setData({
                    sendBtn: true
                });
            }
        } else {
            this.setData({
                sendBtn: false
            });
        }
    },

    // 故障内容
    contentInput: function(e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                contentVal: val
            });
            if (this.data.userName && this.data.chooseType && this.data.carNum && this.data.address) {
                this.setData({
                    sendBtn: true
                });
            }
        } else {
            this.setData({
                sendBtn: false
            });
        }
        this.setData({
            contentLen: val.length
        });
    },

    // 地点
    addressInput: function(e) {
        var val = e.detail.value;
        if (val.length > 0) {
            this.setData({
                address: val
            });
            if (this.data.userName && this.data.chooseType && this.data.contentVal && this.data.carNum) {
                this.setData({
                    sendBtn: true
                });
            }
        } else {
            this.setData({
                sendBtn: false
            });
        }
    },

    // 显示or隐藏 故障类型
    chooseTypeTap: function() {
        if (this.data.titleText == 'apply') {
            this.setData({
                showType: !this.data.showType
            });
        }
    },

    // 选择故障类型
    chooseTypeItem: function(e) {
        var name = e.currentTarget.dataset.name;
        this.setData({
            chooseType: name,
            showType: false
        });
    },

    // 选择图片
    chooseImg: function(e) {
        var that = this;
        var num = this.data.chooseCount;
        var max = this.data.chooseMax;
        var imgUrls = that.data.chooseImgUrls;
        wx.chooseImage({
            count: num, // 默认9
            sizeType: ['compressed'], // 可以指定是原图('original')还是压缩图('compressed')，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                if (imgUrls.length + tempFilePaths.length <= max) {
                    that.setData({
                        chooseCount: max - tempFilePaths.length
                    });
                    that.data.chooseImgUrls = that.data.chooseImgUrls.concat(tempFilePaths); // 使用concat()来把两个数组合拼起来
                } else {
                    wx.showToast({
                        title: '最多能上传' + max + '张图片！',
                        icon: 'none'
                    });
                }
                that.setData({
                    chooseImgUrls: that.data.chooseImgUrls
                }); // 修改了数据后，一定要再次执行`this.setData()，页面才会渲染数据的。
                // console.log(that.data.chooseImgUrls);
            }
        });
    },

    // 长按图片或点击图片
    imgTouchStart: function(e) {
        this.setData({
            touch_start: e.timeStamp
        });
    },
    imgTouchEnd: function(e) {
        this.setData({
            touch_end: e.timeStamp
        });
    },
    // 手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发
    imgTap: function(e) {

        // 触摸时间距离页面打开的毫秒数  
        var touchTime = this.data.touch_end - this.data.touch_start;

        if (touchTime > 350) { // 如果按下时间大于350为长按 
            this.setData({
                del: true
            });

        } else { // 否则视为点击图片
            var thisIndex = e.currentTarget.dataset.index; // 被点击图片的下标
            this.previewImg(thisIndex);
        }
    },

    // 删除图片
    deleteImg: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.chooseImgUrls;
        var imageId = this.data.imageID;
        // console.log(list, list[index])
        list.splice(index, 1);
        this.setData({
            chooseImgUrls: list
        });
        if (this.data.chooseImgUrls.length == 0) {
            this.setData({
                del: false
            });
        }
    },

    // 浏览图片
    previewImg: function(thisIndex) {
        var imgList = this.data.chooseImgUrls; // 图片http链接列表
        // var thisIndex = e.currentTarget.dataset.index; // 被点击图片的下标
        wx.previewImage({
            current: imgList[thisIndex], // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        });
    },

    // 点击提交
    sendTap: function() {
        if (this.data.sendBtn == false) {
            return;
        }
        var dataParams = {
            'carNo': this.data.carNum,
            'submitter': this.data.userName,
            'faultType': this.data.chooseType,
            'faultContent': this.data.contentVal,
            'location': this.data.address,
            'imgUrls': this.data.chooseImgUrls
        };
        if (dataParams.imgUrls.length == 0) {
            dataParams.imgUrls = '';
            this.sendFun(dataParams);
        }
        if (dataParams.imgUrls.length > 0) {
            var that = this;
            this.unloadImg(function(urls) { // 逐个上传图片，完成后发表
                dataParams.imgUrls = urls.join(',');
                that.sendFun(dataParams);
            });
        }
    },

    // 逐个上传图片
    unloadImg: function(callBack) {
        var urls = []; //图片路径
        var list = this.data.chooseImgUrls;
        wx.showLoading({
            title: '图片上传中...'
        }); //显示加载
        for (var index = 0; index < list.length; index++) {
            wx.uploadFile({
                url: util.baseUrl + 'ztc/product/uploadCommentImg',
                filePath: list[index],
                name: 'file',
                header: {
                    "content-type": "multipart/form-data"
                },
                success: function(res) {
                    var response = typeof res.data == "string" ? JSON.parse(res.data) : res.data;
                    if (response.code == 200) {
                        urls.push(response.imgUrl);
                        if (urls.length == list.length) {
                            wx.hideLoading(); //隐藏加载
                            callBack(urls); //当图片全部上传完，则执行callBack();
                            console.log('上传完成！');
                        }
                    } else {
                        console.log(res);
                        if (response.msg) {
                            wx.showToast({
                                title: '' + response.msg,
                                icon: 'none'
                            });
                        }
                    }
                },
                fail: function(res) {
                    console.log(res);
                }
            });
        }
    },

    // 正式提交
    sendFun: function(params) {
        var that = this;
        this.setData({ sendBtn: false });
        // console.log(params);return;
        //sessionChoose 1是带sessionID的GET方法  2是不带sessionID的GET方法, 3是带sessionID的Post方法,4是不带sessionID的Post方法
        util.HttpRequst(true, "ztc/fault/applyFault", 3, wx.getStorageSync("sessionId"), params, "POST", true, function(res) {
            if (res.code == 200) {
                wx.navigateBack();
            } else if (res.code == 500) {
                that.setData({ sendBtn: true });
                wx.showModal({
                    title: '提示',
                    content: '' + res.msg
                });
            } else {
                console.log(res);
            }
        });
    },

    // 查询故障详情
    getFaultInfo: function() {
        var that = this;
        util.HttpRequst(true, "ztc/fault/faultInfo", 1, wx.getStorageSync("sessionId"), {
            'faultId': this.data.faultId
        }, "GET", true, function(res) {
            if (res.code == 200) {
                // console.log(res);
                const faultInfo = res.faultInfo;
                that.setData({
                    carNum: faultInfo.car_no,
                    userName: faultInfo.submitter,
                    chooseType: faultInfo.fault_type,
                    contentVal: faultInfo.fault_content,
                    address: faultInfo.location,
                    chooseImgUrls: faultInfo.img_urls ? faultInfo.img_urls.split(',') : [],
                    approver: faultInfo.approver || '',
                    costsTotal: faultInfo.estimated_cost || '',
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
    }
})