window.addEventListener('load', () => {
    const canvas = document.getElementById('GCanvas');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = window.innerWidth;
    const CANVAS_HEIGHT = canvas.height = window.innerHeight;
    var s=true;
    class Background{
        constructor(game){
            this.game = game;
            this.x = 0;
            this.y = 0;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.image = document.getElementById('bg1');
        }
        update(){
            if(this.y > this.height){
                this.y = 0;
                this.game.add_platforms(-this.height*2, -30-this.height);
            }
            else{
                this.y += this.game.vy;
                
                if(this.game.vy>0){
                    this.game.scorept += Math.floor(this.game.vy * 0.4);
                }
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
            this.width = 120;
            this.height = 30;
            this.type = type;
            this.x = Math.floor(Math.random()*((this.game.width-this.width)+1));
            this.y =  this.calc_Y(upperY, lowerY);
            this.vx = (this.type == 'blue') ? this.game.object_vx : 0;
            this.image = document.getElementById('tiles');
            this.markedForDeletion = false;
        }
    
        update(){
            if(this.type == 'blue'){
                if(this.x < 0 || this.x > this.game.width - this.width) this.vx = -this.vx;
            }
            this.x += this.vx;
            this.y += this.game.vy;

            if(this.y >= this.game.height + game.player.height*2){
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
                return upperY;
            }
            else{
                return this.game.platforms[0].y - this.game.platform_gap;
            }
        }
    }

    class Player{
        constructor(game){
            this.game = game;
            this.width = 60;
            this.height = 75;
            this.x = this.game.platforms[this.game.platforms.length-1].x + 6;
            this.y = this.game.platforms[this.game.platforms.length-1].y - this.height;
            this.min_y = (this.game.height/2);
            this.min_vy = -18;
            this.max_vy = this.game.platforms[0].height;
            this.vy = this.min_vy;
            this.jump = 0.5;
            this.image = document.getElementById('player');
            this.vx = 0;
            this.max_vx = 5;
        }

        update(inputHandler){
            this.x +=this.vx;
            if(inputHandler.keys.includes('ArrowLeft')){
                this.image = document.getElementById('playerM');
                this.vx = -this.max_vx;
            }
            else if(inputHandler.keys.includes('ArrowRight')){
                this.image = document.getElementById('player');
                this.vx = this.max_vx;
            }
            else{
                this.vx = 0;
            }

            if(this.x < -this.width/2){
                this.x = this.game.width - (this.width/2);
            }
            if(this.x + (this.width/2) > this.game.width) {
                this.x = (-this.width/2);
            }

            if(this.vy > this.jump){
                let platformType = this.onPlatform();
                if(platformType == 'white' || platformType == 'blue' || platformType == 'green') this.vy = this.min_vy;

                if(platformType == 'white') new Audio("Resources/Sounds/jump.wav").play();
                else if((platformType == 'blue') || (platformType == 'green')) new Audio("Resources/Sounds/jump-arcade.mp3").play();
            }

            if(this.vy < this.max_vy){
                this.vy += this.jump;
            }
            if(this.y*2 > this.min_y || this.vy > (this.jump)){
                this.y += this.vy;
            }

            if(this.y <= this.min_y && this.vy < this.width){
                this.game.vy = -this.vy;
            }
            else this.game.vy = 0;
        }

        draw(context){
            context.strokeRect(this.x+15, this.y, this.width-30, this.height);
            context.drawImage(this.image, 0, 0, 173, 235, this.x, this.y, this.width, this.height);
        }

        onPlatform(){
            let type = null;
            let playerHitBox = {
                x:this.x+30,
                y:this.y,
                width:this.width-60,
                height:this.height
            }

            this.game.platforms.forEach((platform) =>{
                const X_test = (playerHitBox.x > platform.x && playerHitBox.x < platform.x + platform.width) || (playerHitBox.x + playerHitBox.width > platform.x && playerHitBox.x + playerHitBox.width < platform.x + platform.width);
                const Y_test = (platform.y - (playerHitBox.y + playerHitBox.height) <= 0) && (platform.y - (playerHitBox.y + playerHitBox.height) >= -platform.height);
                
                if(X_test && Y_test){
                    type = platform.type;
                    platform.markedForDeletion = (type == 'white') ? true : false;
                }
            });

            return type;
        }
    }

    class InputHandler{
        constructor(game){
            this.keys = [];
            this.game = game;
            
            window.addEventListener('keydown', (e) =>{
                if((e.key == 'ArrowLeft' || e.key == 'ArrowRight') && !this.keys.includes(e.key)){
                    this.keys.push(e.key);
                }
                if(e.key == 'Enter'){
                    this.game.gameStart = true;
                }
            });

            window.addEventListener('keyup', (e) => {
                if((e.key == 'ArrowLeft' || e.key == 'ArrowRight') && this.keys.includes(e.key)){
                    this.keys.pop(e.key);
                }
            });
        }
    }
    
    class Game{
        constructor(width, height){
            this.width = width;
            this.height  = height;
            this.vy = 0;
            this.gameStart = false;
            this.platforms = [];
            this.object_vx = 3;
            this.platform_gap = 55;
            this.scorept = 0;
            this.blue_white_platform_chance = 20;
            this.add_platforms(0, this.height-30);
            this.add_platforms(-this.height, -30);
            this.introimage = document.getElementById('intro');
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
                context.font = "bold 30px Arial";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.drawImage(this.introimage, 0, 0, innerWidth, innerHeight);
                context.fillText("Press Enter to Start", this.width*0.5, this.height*0.5);
            }
            else if(this.player.y> this.width){
                if(s) {
                    new Audio("Resources/Sounds/losing.wav").play();
                    s=false;
                }
                context.font = "bold 70px Arial";
                context.fillStyle = "Green";
                context.textAlign = "center";
                context.fillText("Your Score is "+this.scorept, this.width*0.5, this.height*0.5);
                context.font = "bold 30px Arial";
                context.fillStyle = "black";
                context.fillText("Game End, Load to Restart", this.width*0.5, this.height*0.5+40);
            }
            else{
                this.platforms.forEach(platform => {
                    platform.draw(context);
                });

                this.player.draw(context);

                context.font = "bold 30px Arial";
                context.fillStyle = "black";
                context.textAlign = "start";
                context.fillText("Score: "+this.scorept, 20, 40);
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

