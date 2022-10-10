window.addEventListener('load', () => {
    const canvas = document.getElementById('GCanvas');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = window.innerWidth;
    const CANVAS_HEIGHT = canvas.height = window.innerHeight;
    // let BGvalue=0;
    // function changeBackground(){
    //     if(BGvalue<2){
    //         BGvalue++;        
    //     }
    //     else BGvalue=0;
    // }
    class Background{
        constructor(game){
            this.game = game;
            this.x = 0;
            this.y = 0;
            this.width =1278;
            this.height = 680;
            this.image = document.getElementById('bg1');
            this.speed = 2;
        }
        update(){
            if(this.y > this.height){
                this.y = 0;
                this.game.add_platforms(-this.height*2, -15);
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
    
    class Platform{
        constructor(game, lowerY, upperY, type){
            this.game = game;
            this.width = 121;
            this.height = 35;
            this.type = type;
            this.x = Math.floor(Math.random()*((this.game.width-this.width) + 1));
            this.y =  this.calc_Y(upperY, lowerY);
            this.vx = (this.type == 'blue') ? this.game.object_vx : 0;
            this.image = document.getElementById('tiles');
            this.markedForDeletion = false;
        }
    
        update(){
            if(this.type == 'blue'){
                if(this.x < 0 || this.x > this.game.width - this.width) this.vx *= -1;
            }
            this.x += this.vx;
            this.y += 3;

            if(this.y >= this.game.height){
                this.markedForDeletion = true;
            }
        }
    
        draw(context){
            let k;
            if(this.type == 'green'){
                k=0;
            }
            else if(this.type == 'blue'){
                k=35;
            }
            else{
                k=70;
            }
            context.drawImage(this.image, 0, k, 121, 35, this.x, this.y, this.width, this.height);
        }
    
        calc_Y(upperY, lowerY){
            if(!this.game.platforms.length){
                return Math.floor(Math.random() * (upperY - (upperY-100) + 1)) + (upperY-100);
            }
            else{
                return this.game.platforms[0].y - (Math.floor(Math.random() * (this.game.platform_gap  - (this.game.platform_gap - 30) + 1)) + (this.game.platform_gap - 30));
            }
        }
    }

    class Player{
        constructor(game){
            this.game = game;
            this.sizeModifier = 0.2;
            this.width = 395 * this.sizeModifier;
            this.height = 488 * this.sizeModifier;
            this.x = this.game.platforms.filter(platform => platform.type == 'green').slice(-1)[0].x +6;
            this.y = this.game.platforms.filter(platform => platform.type == 'green').slice(-1)[0].y - this.height;
            this.image = document.getElementById('player1');
            this.vx = 0;
            this.max_vx = 8;
        }

        update(inputHandler){
            this.x +=this.vx;
            if(inputHandler.keys.includes('ArrowLeft')){
                this.vx = -this.max_vx;
            }
            else if(inputHandler.keys.includes('ArrowRight')){
                this.vx = this.max_vx;
            }
            else{
                this.vx = 0;
            }
        }

        draw(context){
            context.drawImage(this.image,this.x, this.y, this.width, this.height);
        }
    }

    class InputHandler{
        constructor(game){
            this.keys = [];
            this.game = game;
            
            window.addEventListener('keydown', (e) =>{
                if((e.key == 'ArrowLeft' || e.key == 'ArrowRight') && !this.keys.includes(e.key)){
                    this.keys.push(e.key)
                }
                if(e.key == 'Enter'){
                    this.game.gameStart = true;
                }
            });

            window.addEventListener('keyup', (e) => {
                if((e.key == 'ArrowLeft' || e.key == 'ArrowRight') && this.keys.includes(e.key)){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }
    
    class Game{
        constructor(width, height){
            this.width = width;
            this.height  = height;
            this.gameStart = false;
            this.platforms = [];
            this.object_vx = 3;
            this.platform_gap = 65;
            this.blue_white_platform_chance = 20;
            this.add_platforms(0, this.height-15);
            this.add_platforms(-this.height, -15);
            this.background = new Background(this); 
            this.player = new Player(this);
            this.inputHandler = new InputHandler(this);
            
        }
    
        update(){
            this.background.update();

            this.platforms.forEach(platform =>{
                platform.update();
            });

            this.player.update(this.inputHandler);

            this.platforms = this.platforms.filter(platform => !platform.markedForDeletion);
        }
    
        draw(context){
            this.background.draw(context);

            if(!this.gameStart){
                context.font = "bold 30px Helvetica";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText("Press Enter to Start", this.width*0.5, this.height*0.5);
            }
            else{
                this.platforms.forEach(platform => {
                    platform.draw(context);
                });

                this.player.draw(context);
            }
        }

        add_platforms(lowerY, upperY){
            do{
                let type = 'green';
                if(Math.random() < (this.blue_white_platform_chance/100)){
                    type = (Math.random() < 0.5) ? 'blue' : 'white';
                }
                this.platforms.unshift(new Platform(this, lowerY, upperY, type));
            }while(this.platforms[0].y >= lowerY);
        }
        
    }
    
    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if(game.gameStart) game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});

