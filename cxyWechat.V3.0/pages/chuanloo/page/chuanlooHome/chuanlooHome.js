Page({
    data: {
        imgHome: true, //首页
        imgPersonal: false, //个人中心
        tabIndex: '0',
        navIndex: '0',
        // -------------轮播图：广告栏-------------------
        indicatorDots: true,
        autoplay: true,
        interval: 2500,
        duration: 1000,
        circular: true,
        bannerImgs: [], //banner图片列表
        // -------------列表-------------------
        dataList: [
            { imgUrl: '../imgs/5D_1.png', scoreInt: '9', scoreFloat: '.0', name: '5D影院', times: '30分钟', types: '动作/冒险', director: '罗曼蒂克', desc: '亡灵莎娜团长带率领灵退出百慕大三角...' },
            { imgUrl: '../imgs/5D_2.png', scoreInt: '9', scoreFloat: '.5', name: '动物童话王国', times: '30分钟', types: '剧情/喜剧', director: '罗曼蒂克', desc: '开来看看动物们的童话世界是怎么样的吧...' },
            { imgUrl: '../imgs/5D_3.png', scoreInt: '9', scoreFloat: '.6', name: '小猪跳水', times: '30分钟', types: '动作/搞笑', director: '罗曼蒂克', desc: '可爱的小猪来跳水啦，快来围观吧...' },
            { imgUrl: '../imgs/5D_1.png', scoreInt: '9', scoreFloat: '.0', name: '5D影院', times: '30分钟', types: '动作/冒险', director: '罗曼蒂克', desc: '亡灵莎娜团长带率领灵退出百慕大三角...' },
            { imgUrl: '../imgs/5D_2.png', scoreInt: '9', scoreFloat: '.5', name: '动物童话王国', times: '30分钟', types: '剧情/喜剧', director: '罗曼蒂克', desc: '开来看看动物们的童话世界是怎么样的吧...' },
            { imgUrl: '../imgs/5D_3.png', scoreInt: '9', scoreFloat: '.6', name: '小猪跳水', times: '30分钟', types: '动作/搞笑', director: '罗曼蒂克', desc: '可爱的小猪来跳水啦，快来围观吧...' },
        ],
    },
    onLoad: function (options) {

    },
    changePersonalActive: function() {
        wx.redirectTo({
            url: '../menuList/menuList',
        })
    },

    // 影院、游乐、商家
    tabItem: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ tabIndex: index });
    },

    // 正在开放、即将开放
    navItem: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ navIndex: index });
    },

    // 进入详情
    gotoDetail: function (e) {
        var list = this.data.dataList;
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../scheduleDetail/scheduleDetail?id=' + index,
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})