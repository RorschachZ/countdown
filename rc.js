'use strict';

var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var r = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var endTime = new Date(2017,7,18,15,15,15);
var curShowTimeSeconds = 0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];



window.onload = function () {
    var rc = document.getElementById("rc");
    var ctx = rc.getContext("2d");

    rc.width = WINDOW_WIDTH;
    rc.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getcurShowTimeSeconds();

    setInterval(
        function(){
            render(ctx);
            update();
        },
        50
    );
};

function getcurShowTimeSeconds(){
    var curTime = new Date();
    var ms = endTime.getTime() - curTime.getTime();
    ms = Math.round(ms/1000);

    return ms >= 0 ? ms : 0;
}

function update(){
    var nextShowTimeSeconds = getcurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

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

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

function addBalls(x , y, num){
    for( var i = 0  ; i < digit[num].length ; i ++ ){
        for( var j = 0  ; j < digit[num][i].length ; j ++ ){
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(r+1)+(r+1),
                    y:y+i*2*(r+1)+(r+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                };
                balls.push( aBall );
            }
        }
    }
}

function updateBalls(){
    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT - r ){
            balls[i].y = WINDOW_HEIGHT - r;
            balls[i].vy = - balls[i].vy * 0.75;
        }
    }
    //性能优化，如果不把已经移出屏幕的小球移出数组，则数组越来越长，最终闭会导致性能下降
    var cnt = 0;
    for(var j = 0; j < balls.length; j ++){
        if(balls[j].x + r > 0 && balls[j].x - r < WINDOW_WIDTH){
            balls[cnt++] = balls[j];
        }
    }

    while(balls.length > cnt){
        balls.pop();
    }

}


function render(ctx) {

    ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

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

    for( var i = 0 ; i < balls.length ; i ++ ){
        ctx.fillStyle=balls[i].color;

        ctx.beginPath();
        ctx.arc( balls[i].x , balls[i].y , r , 0 , 2*Math.PI , true );
        ctx.closePath();

        ctx.fill();
    }

}

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



