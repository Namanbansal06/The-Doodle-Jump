const canvas = document.getElementById('game');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const c = canvas.getContext('2d');

function object(x,y,dy,dx,r){
    this.x=x;
    this.y=y;
    this.dy=dy;
    this.r=r;
    this.dx=dx;
    var key=false;
    var playerdir=0;
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
// key movements
        window.addEventListener("keydown",(e)=>{
            switch(e.key){
                case 'ArrowRight':
                    key=true;
                    this.dx=8;
                    playerdir=1;
                    break;
                    case 'ArrowLeft':
                        key=true;
                        this.dx=-8;
                        playerdir=-1;
                        break;
                        default:
                            break;
            }
        });
        document.addEventListener('keyup', function(e) {
            key = false;
          });

          if (!key) {
            if (playerDir < 0) {
              if (this.x > 0) {
                this.x = 0;
                playerDir = 0;
              }
            }
            else if (playerDir > 0) {
              if (this.dx < 0) {
                this.dx = 0;
                playerDir = 0;
              }
            }
          }
          if(this.x+this.r>canvas.width){
            this.dx=-this.dx;
          }
          else if(this.x-this.r<0){
            this.dx=-this.dx;
          }
          this.x += this.dx;
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
    ball=new object(canvas.width/2,canvas.height/2,2,1,30);
    //console.log("naman2");
}
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    ball.update();
}
init();
animate();