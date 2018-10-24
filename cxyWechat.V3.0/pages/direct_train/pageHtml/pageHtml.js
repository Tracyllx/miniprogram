Page({
    data: {
        path: ""
    },
    onLoad: function (options) {
        var str = options.id;
        if (options.name && options.value) {
            str = options.id + "?" + options.name + "=" + options.value;
        }
        console.log(str);
        this.setData({ path: str });
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})