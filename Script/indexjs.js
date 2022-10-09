const canvas = document.getElementById('game');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const c = canvas.getContext('2d');

var mouse={
    x:undefined,
    y:undefined
};
addEventListener("mousemove",function(event){
    mouse.x=event.x;
    mouse.y=event.y;
})
addEventListener("resize",function(){
    canvas.width=this.innerWidth;
    canvas.height=this.innerHeight;

    init();
});
function randomIntFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function object(x,y,dy,r){
    this.x=x;
    this.y=y;
    this.dy=dy;
    this.r=r;
    this.update=function(){
        if(this.y+this.r>canvas.height){
            this.dy=-this.dy;
        }
        else{
            this.dy+=1;
            //console.log(this.dy);
        }
        this.y+=this.dy;
        this.draw();
    }
    this.draw=function(){
        c.beginPath();
        c.arc(this.x,this.y,this.r,0,Math.PI*2,0);
        c.fillStyle='red';
        c.fill();
        c.closePath();
    };
}
var ball;
function init(){
    //console.log("naman1");
    ball=new object(canvas.width/2,canvas.height/2,2,30);
    //console.log("naman2");
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    ball.update();
}
init();
animate();