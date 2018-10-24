var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({
    data: {},
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.drawCircle()
    },
    onReady: function() {
        var cxt_arc = wx.createCanvasContext('canvasCircle'); //创建并返回绘图上下文context对象。
        cxt_arc.setLineWidth(10);
        cxt_arc.setStrokeStyle('#f5f5f5');
        cxt_arc.setLineCap('round')
        cxt_arc.beginPath(); //开始一个新的路径
        cxt_arc.arc(106, 106, 90, 0, 2 * Math.PI, false); //设置一个原点(106,106)，半径为 90 的圆的路径到当前路径
        cxt_arc.stroke(); //对当前路径进行描边

        cxt_arc.draw();

    },
    drawCircle: function() {
        clearInterval(varName);

        function drawArc(s, e) {
            ctx.setFillStyle('#f5f5f5');
            ctx.clearRect(0, 0, 200, 200);
            ctx.draw();
            var x = 106,
                y = 106,
                radius = 90;
            ctx.setLineWidth(9);
            ctx.setStrokeStyle('#39b6a3');
            ctx.setLineCap('round');
            ctx.beginPath();
            ctx.arc(x, y, radius, s, e, false);
            ctx.stroke()
            ctx.draw()
        }
        var step = 1,
            startAngle = 1.5 * Math.PI,
            endAngle = 0;
        var animation_interval = 1000,
            n = 60;
        var animation = function () {
            if (step <= n) {
                endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
                drawArc(startAngle, endAngle);
                step++;
            } else {
                console.log(step, '充满了！')
                clearInterval(varName);
            }
        };
        varName = setInterval(animation, animation_interval);
    }
})