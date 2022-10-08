const canvas = document.getElementById('GCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let  gameSpeed = 8;

//Background
const bg = new Image();
bg.src = "/Resources/BG1.png";
let y=0;
let y2=680;

class Background{
    constructor(image, speedModifier){
        this.x=0;
        this.y=0;
        this.width=1278;
        this.height=680;
        this.y2=-this.height;
        this.image=image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed*this.speedModifier;
    }
    update(){
        this.speed = gameSpeed*this.speedModifier;
        if(this.y > this.height){
            this.y = -this.height + this.y + this.speed;
        }
        else{
            this.y = Math.floor(this.y + this.speed);
        }
        if(this.y2 > 0){
            this.y2 = -this.height +this.y2 + this.speed;
        }
        else{
            this.y2 = Math.floor(this.y2 + this.speed);
        }
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x, this.y2);
    }
}
const background1 = new Background(bg, 0.1);
function bganimate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    background1.draw();
    background1.update();
    // ctx.drawImage(bg, 0, y);
    // ctx.drawImage(bg, 0, y2);
    // if(y>680){
    //     y=-680+gamespeed+4;
    // }
    // else y += gamespeed;
    // if(y2>680){
    //     y2=-680+gamespeed+4;
    // }
    // else y2 += gamespeed;
    requestAnimationFrame(bganimate);
}
bganimate();