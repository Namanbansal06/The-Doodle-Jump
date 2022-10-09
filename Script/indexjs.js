const canvas = document.getElementById('GCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let  gameSpeed = 4;

// //Background
// let nbg = 0;
// const bg1 = new Image();
// bg1.src = "Resources/Backgrounds/BG1.png";
// const bg2 = new Image();
// bg2.src = "Resources/Backgrounds/BG2.png";

// window.addEventListener('load', function(){
//     class Background{
//         constructor(image, speedModifier){
//             this.x=0;
//             this.y=0;
//             this.width=1278;
//             this.height= 680;
//             this.y2=-this.height;
//             this.image=image;
//             this.speedModifier = speedModifier;
//             this.speed = gameSpeed*this.speedModifier;
//         }
//         update(){
//             this.speed = gameSpeed*this.speedModifier;
//             if(this.y > this.height){
//                 this.y = -this.height + this.y + this.speed;
//             }
//             if(this.y2 > 0){
//                 this.y2 = -this.height +this.y2 + this.speed;
//             }
//             this.y = Math.floor(this.y + this.speed);
//             this.y2 = Math.floor(this.y2 + this.speed);
//         }
//         draw(){
//             ctx.drawImage(this.image, this.x, this.y);
//             ctx.drawImage(this.image, this.x, this.y2);
//         }
//     }
//     const background1 = new Background(bg1, 0.3);
//     const background2 = new Background(bg2, 0.3);
//     const Bg = [background1, background2];
    
//     function bganimate(){
//         ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//         Bg[nbg].draw();
//         Bg[nbg].update();
//         requestAnimationFrame(bganimate);
//     }
//     bganimate();
// });


// //Character
// let x=0;
// const playerImage11 = new Image();
// playerImage11.src = "Resources/Mobile%20-%20Doodle%20Jump%20-%20General%20Sprites/blue-lik-left@2x.png";
// const playerImage12 = new Image();
// playerImage12.src = "Resources/Mobile%20-%20Doodle%20Jump%20-%20General%20Sprites/blue-lik-right@2x.png";

// function characterAnimate(){
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     ctx.drawImage(playerImage12, 0, 0, 100, 100);
//     x++;
//     requestAnimationFrame(characterAnimate);
// }
// characterAnimate();

//Enemy
const noofEnemy = 150;
const enemiesArray = [];

const enemyImage = new Image();
enemyImage.src = "Resources/Mobile%20-%20Doodle%20Jump%20-%20General%20Sprites/game-tiles-jungle@2x.png";
gameFrame=0;
class Enemy{
    constructor(x, y){
        this.x=Math.random()*canvas.width;
        this.y=Math.random()*canvas.height;
        this.speed = Math.random() * 4 - 2;
        this.spritewidth = 162;
        this.spriteheight = 92;
        this.width=this.spritewidth/2;
        this.height=this.spriteheight/2;
        this.frame = 0;

    }
    update(){
        this.x += this.speed;
        this.y += this.speed;
        if(gameFrame % 8 === 0){
            (this.frame > 2)? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(enemyImage, 295 + this.spritewidth * this.frame , 0, this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height);
    }
}

for(let i=0; i<noofEnemy; i++){
    enemiesArray.push(new Enemy());
}
function enemyAnimate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    gameFrame++;
    requestAnimationFrame(enemyAnimate);
}
enemyAnimate();