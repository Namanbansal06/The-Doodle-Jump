const canvas = document.getElementById('GCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
// let  gameSpeed = 8;
// //Background
// const bg1 = new Image();
// bg1.src = "Resources/Backgrounds/BG1.png";
// const bg2 = new Image();
// bg2.src = "Resources/Backgrounds/BG2.png";

// class Background{
//     constructor(image, speedModifier){
//         this.x=0;
//         this.y=0;
//         this.width=1278;
//         this.height= 680;
//         this.y2=-this.height;
//         this.image=image;
//         this.speedModifier = speedModifier;
//         this.speed = gameSpeed*this.speedModifier;
//     }
//     update(){
//         this.speed = gameSpeed*this.speedModifier;
//         if(this.y > this.height){
//             this.y = -this.height + this.y + this.speed;
//         }
//         if(this.y2 > 0){
//             this.y2 = -this.height +this.y2 + this.speed;
//         }
//         this.y = Math.floor(this.y + this.speed);
//         this.y2 = Math.floor(this.y2 + this.speed);
//     }
//     draw(){
//         ctx.drawImage(this.image, this.x, this.y);
//         ctx.drawImage(this.image, this.x, this.y2);
//     }
// }
// const background1 = new Background(bg1, 0.3);
// function bganimate(){
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     background1.draw();
//     background1.update();
//     // ctx.drawImage(bg, 0, y);
//     // ctx.drawImage(bg, 0, y2);
//     // if(y>680){
//     //     y=-680+gameSpeed+4;
//     // }
//     // else y += gameSpeed;
//     // if(y2>680){
//     //     y2=-680+gameSpeed+4;
//     // }
//     // else y2 += gameSpeed;
//     requestAnimationFrame(bganimate);
// }
// bganimate();

//Character
let x=0;
const playerImage11 = new Image();
playerImage11.src = "Resources/Mobile%20-%20Doodle%20Jump%20-%20General%20Sprites/blue-lik-left@2x.png";
const playerImage12 = new Image();
playerImage12.src = "Resources/Mobile%20-%20Doodle%20Jump%20-%20General%20Sprites/blue-lik-right@2x.png";

function characterAnimate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage12, 0, 0, 100, 100);
    x++;
    requestAnimationFrame(characterAnimate);
}
characterAnimate();