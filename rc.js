'use strict';
//全局变量，在响应式设计时，计算各项参数，包括画布宽高、小球半径、边距、倒计时的日期设定等
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var r = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var endTime = new Date(2017,7,18,15,15,15);
var curShowTimeSeconds = 0;
//colors里面存放一些颜色，动画效果中随机挑选颜色
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];


//画图程序
window.onload = function () {
    var rc = document.getElementById("rc"); //获取画布
    var ctx = rc.getContext("2d");          //创建上下文环境

    rc.width = WINDOW_WIDTH;
    rc.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getcurShowTimeSeconds();

    //每隔一段时间重绘
    setInterval(
        function(){
            render(ctx);
            update();
        },
        50
    );
};

//获取当前时间和倒计时设定时间的时间差值，并将其转化为秒
function getcurShowTimeSeconds(){
    var curTime = new Date();
    var ms = endTime.getTime() - curTime.getTime();
    ms = Math.round(ms/1000);

    return ms >= 0 ? ms : 0;
}
//时间的更新以及小球动画效果的更新
function update(){

    //这里每执行一次获得一次最新的时间
    var nextShowTimeSeconds = getcurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    //curShowTimeSeconds是在onload时候获取的，相当于一个当前固定的时间
    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    //判断时间是否发生变化，发生变化则在变化的地方产生新的彩色小球，同时更新curShowTimeSeconds到新的时间
    if(nextSeconds !== curSeconds){
        if( parseInt(curHours/10) !== parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) !== parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(r+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) !== parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(r+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) !== parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(r+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) !== parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(r+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) !== parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(r+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }

        curShowTimeSeconds = nextShowTimeSeconds;//更新一次时间
    }

    updateBalls();//小球动画效果的更新
}

//绘制动画时，实际上是在时间显示的小球上有添加了新的彩色小球，并对这些彩色小球进行绘制
function addBalls(x , y, num){
    for( var i = 0  ; i < digit[num].length ; i ++ ){             //循环的是行
        for( var j = 0  ; j < digit[num][i].length ; j ++ ){      //循环的是每一行中的元素
            if( digit[num][i][j] == 1 ){                          //元素是1才有小球
                var aBall = {
                    x : x + j * 2 * (r+1) + (r+1),             //x位置
                    y : y + i * 2 * (r+1) + (r+1),             //y位置
                    g : 1.5 + Math.random(),                   //加速度
                    vx : Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4, //x方向速度
                    vy : -5,                                                   //y方向速度
                    color: colors[ Math.floor( Math.random()*colors.length ) ] //小球颜色，使用了很简单的随机机制
                };
                balls.push( aBall );//将需要动画的小球全部推入balls数组中等待动画的改变
            }
        }
    }
}
//彩色小球动画的实现
function updateBalls(){
    //给在balls数组中的小球设定动画
    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        //碰撞检测并减少碰撞后的速度，令效果更加逼真
        if( balls[i].y >= WINDOW_HEIGHT - r ){
            balls[i].y = WINDOW_HEIGHT - r;
            balls[i].vy = - balls[i].vy * 0.75;
        }
    }
    //性能优化，如果不把已经移出屏幕的小球移出数组，则数组越来越长，最终会导致性能下降
    var cnt = 0;
    for(var i = 0; i < balls.length;  i++){
        //将数组重新赋值，保留仍在画布内的小球，设计巧妙在于cnt必然<=
        if(balls[i].x + r > 0 && balls[i].x - r < WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }
    }
    //进行到此，则索引在cnt后的小球均已无用，索引在cnt前的小球都是仍在画布内的，因此可将后面没用的小球移出数组
    while(balls.length > cnt){
        balls.pop();
    }

}

//倒计时时钟本身的绘制
function render(ctx) {
    //每次重绘前要清空画布内容，否则会一直在画布上累计
    ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    //倒计时时钟的绘制
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);
    renderDigit(MARGIN_LEFT+15*(r+1), MARGIN_TOP, parseInt(hours % 10), ctx);
    renderDigit(MARGIN_LEFT+30*(r+1), MARGIN_TOP, 10,ctx);
    renderDigit(MARGIN_LEFT+39*(r+1), MARGIN_TOP, parseInt(minutes / 10), ctx);
    renderDigit(MARGIN_LEFT+54*(r+1), MARGIN_TOP, parseInt(minutes % 10), ctx);
    renderDigit(MARGIN_LEFT+69*(r+1), MARGIN_TOP, 10,ctx);
    renderDigit(MARGIN_LEFT+78*(r+1), MARGIN_TOP, parseInt(seconds / 10), ctx);
    renderDigit(MARGIN_LEFT+93*(r+1), MARGIN_TOP, parseInt(seconds % 10), ctx);
    //绘制动画小球的初始状态
    for( var i = 0 ; i < balls.length ; i ++ ){
        ctx.fillStyle=balls[i].color;

        ctx.beginPath();
        ctx.arc( balls[i].x , balls[i].y , r , 0 , 2*Math.PI , true );
        ctx.closePath();

        ctx.fill();
    }

}
//每一个点阵数字的绘制方法，即按需遍历digit中的数组
function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = "blue";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                ctx.arc(x + j * 2 * (r + 1) + (r + 1), y + i * 2 * (r + 1) + (r + 1), r, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}



