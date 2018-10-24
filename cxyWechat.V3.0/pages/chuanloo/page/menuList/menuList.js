Page({
    data: {
        imgHome: false, //首页
        imgPersonal: true, //个人中心
        list: [
            // {
            //     id: "scheduleIndex",
            //     name: "首页",
            //     url: '../chuanlooHome/chuanlooHome',
            //     width: '48rpx',
            //     height: '48rpx'
            // }, 
            {
                id: "my_order",
                name: "我的订单",
                url: '../myOrders/myOrders',
                width: '48rpx',
                height: '48rpx'
            },
            {
                id: "card_detail",
                name: "余额明细",
                url: '../cardBalance/cardBalance',
                width: '42rpx',
                height: '42rpx'
            },
            {
                id: "card_detail",
                name: "我的钱包",
                url: '../myWallet/myWallet',
                width: '42rpx',
                height: '42rpx'
            }
        ]
    },
    onLoad: function(options) {

    },
    changeHomeActive: function() {
        wx.redirectTo({
            url: '../chuanlooHome/chuanlooHome',
        })
    }
})