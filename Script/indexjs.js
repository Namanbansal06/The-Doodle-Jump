window.addEventListener('load', () => {
    const canvas = document.getElementById('GCanvas');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = window.innerWidth;
    const CANVAS_HEIGHT = canvas.height = window.innerHeight;
    
    class Background{
        constructor(game){
            this.game=game;
            this.x=0;
            this.y=0;
            this.width=1278;
            this.height= 680;
            this.image=document.getElementById('bg');
            this.speed = 2;
        }
        update(){
            if(this.y > this.height){
                this.y = 0;
            }
            else{
                this.y += this.speed;
            }
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x, this.y-this.height, this.width, this.height);
        }
    }

    class InputHandler{
        constructor(game){
            this.game = game;
            
            window.addEventListener('keydown', (e) =>{
                this.game.gameStart = true;
            });
        }
    }
    
    class Game{
        constructor(width, height){
            this.width = width;
            this.height  = height;
            this.gameStart = false;
            this.background = new Background(this); 
            this.inputHandler = new InputHandler(this);
        }
    
        update(){
            this.background.update();
        }
    
        draw(context){
            this.background.draw(context);

            if(!this.gameStart){
                context.font = "bold 30px Helvetica";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText("Press Enter to Start", this.width*0.5, this.height*0.5);
            }
        }
    }
    
    // const input = new InputHandler();
    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if(game.gameStart) game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});