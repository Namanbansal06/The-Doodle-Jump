const canvas = document.getElementById('GCanvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;
let  gamespeed = 2;

//  This Background
const bg = new Image();
bg.src = "/Resources/BG1.png";
let y=0;

function bganimate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage();
    ctx.fillStyle="rgb(0,0,255)";
    // y++;  
    requestAnimationFrame(bganimate);
}
