var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({
    data: {
        tabIndex: 0,
        timeIndex: 1,
        hours: '',//充电时间
        chargeStatus: 0,// 0未充电，1正在充电，2充电完成
    },
    onLoad: function (options) {
        
    },

    onReady: function () {
        console.log('开始画')
        var cxt_arc = wx.createCanvasContext('canvasCircle'); //创建并返回绘图上下文context对象。
        cxt_arc.setLineWidth(10);
        cxt_arc.setStrokeStyle('#f5f5f5');
        cxt_arc.setLineCap('round')
        cxt_arc.beginPath(); //开始一个新的路径
        cxt_arc.arc(100, 100, 90, 0, 2 * Math.PI, false); //设置一个原点(100,100)，半径为 90 的圆的路径到当前路径
        cxt_arc.stroke(); //对当前路径进行描边
        cxt_arc.draw();
    },

    // 按时间充 / 自动充满
    tabItemTap: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ tabIndex: index });
    },

    // 选择充电时间
    chooseHour: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({ timeIndex: index });
    },

    // 手动输入充电时间
    inputHour: function (e) {
        var val = e.detail.value;
        this.setData({ hours: val });
    },

    // 开始充电
    beginCharging: function (e) {
        var theType = e.currentTarget.dataset.theType;
        if (theType == 'begin') {
            this.setData({
                chargeStatus: 1
            });
            this.drawCircle();//开始充电
        } else if (theType == 'finish') {
            this.setData({
                chargeStatus: 2
            });
            clearInterval(varName);//清除充电计时器
        }
    },

    // 充电中图形
    drawCircle: function () {
        clearInterval(varName);

        function drawArc(s, e) {
            ctx.setFillStyle('#f5f5f5');
            ctx.clearRect(0, 0, 200, 200);
            ctx.draw();
            var x = 100,
                y = 100,
                radius = 90;
            ctx.setLineWidth(9);
            ctx.setStrokeStyle('#39b6a3');
            ctx.setLineCap('round');
            ctx.beginPath();
            ctx.arc(x, y, radius, s, e, false);
            ctx.stroke()
            ctx.draw()
        }
        var step = 1.5, n = 3.5, sec = 8;
        drawArc(3.5 * Math.PI, sec * 2 * Math.PI / 60 + 3.5 * Math.PI);
        varName = setInterval(function() {
            if (step <= n) {
                drawArc(step * Math.PI, sec * 2 * Math.PI / 60 + step * Math.PI);
                step = step + 0.1;
            } else {
                step = 1.5;
            }
        }, 1000);

        // var step = 1,
        //     startAngle = 1.5 * Math.PI,
        //     endAngle = 0;
        // var animation_interval = 1000,
        //     n = 60;
        // var animation = function () {
        //     if (step <= n) {
        //         endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        //         drawArc(startAngle, endAngle);
        //         step++;
        //     } else {
        //         clearInterval(varName);
        //     }
        // };
        // varName = setInterval(animation, animation_interval);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})