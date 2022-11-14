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
                this.game.change_difficulty();

                if(Math.random() < this.game.ememyChance/100){
                    this.game.add_enemy()
                }
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
    
    class Enemy{
        constructor(game){
            this.game = game;
            this.sizeModifier = 0.25;
            this.width = 238* this.sizeModifier;
            this.height = 240 * this.sizeModifier;
            this.x = Math.floor(Math.random() * ((this.game.width-this.width) - + 1));
            this.y = Math.floor(Math.random() * ((-this.height)- (-this.game.height) + 1)) + (-this.game.height);
            this.image = document.getElementById('tiles');
            this.vx = this.game.object_vx*0.9;
            this.audio = new Audio('Resources/Sounds/monsterblizu.mp3');
            this.audio.loop = true;
            this.audio.play();
            this.markedForDeletion = false;
        }

        update(){
            if(this.x < 0 || this.x > this.game.width - this.width) this.vx *= -1 
            this.x += this.vx;
            this.y += this.game.vy;

            if(this.y >= this.game.height + 2 * this.game.player.height){
                this.audio.pause();
                this.markedForDeletion = true;
            }

            let bullets = this.game.player.bullets;
            bullets.forEach(bullet => {
                if(bullet.x < this.x + this.width && bullet.x + bullet.width > this.x && bullet.y < this.y + this.height && bullet.height + bullet.y > this.y){
                    this.audio.pause();
                    new Audio("Resources/Sounds/monster-crash.mp3").play();
                    this.markedForDeletion = true;
                }
            });
        }


        draw(context){
            context.drawImage(this.image, 0, 711, 169, 109, this.x, this.y, this.width, this.height);
        }
    }

    class Platform{
        constructor(game, lowerY, upperY, type){
            this.game = game;
            this.width = 120*0.9;
            this.height = 30*0.9;
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
            this.width = 60*0.9;
            this.height = 75*0.9;
            this.x = this.game.platforms[this.game.platforms.length-1].x + 6;
            this.y = this.game.platforms[this.game.platforms.length-1].y - this.height;
            this.min_y = (this.game.height/1.8);
            this.min_vy = -18;
            this.max_vy = this.game.platforms[0].height;
            this.vy = this.min_vy;
            this.jump = 0.5;
            this.image = document.getElementById('player');
            this.vx = 0;
            this.max_vx = 5;
            this.bullets = [];
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


            if(this.collision()){
                this.game.gameOver = true;
                this.game.enemies.forEach((enemy) => {
                    enemy.audio.pause();
                });
                new Audio("Resources/Sounds/soccer-monster-crash.mp3").play();
            }

            if(this.y > this.game.width && !this.game.gameOver){
                this.game.gameOver = true;
                this.game.enemies.forEach((enemy)=>{
                    enemy.audio.pause();
                });
                new Audio("Resources/Sounds/losing.wav").play();
            }

            if(inputHandler.bulletKeyCount > 0){
                inputHandler.bulletKeyCount--;
                this.image = document.getElementById('playerF');
                this.bullets.push(new Bullet(this));
            }

            this.bullets.forEach(bullet => bullet.update());
            this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);

        }

        draw(context){
            this.bullets.forEach(bullet => bullet.draw(context))
            // context.strokeRect(this.x+15, this.y, this.width-30, this.height);
            context.drawImage(this.image, 0, 0, 173, 235, this.x, this.y, this.width, this.height);
        }

        collision(){
            let result = false;
            let playerHitBox = {x: this.x+15, y:this.y, width: this.width-30, height:this.height}
            this.game.enemies.forEach((enemy) => {
                if(playerHitBox.x < enemy.x + enemy.width && playerHitBox.x + playerHitBox.width > enemy.x && playerHitBox.y < enemy.y + enemy.height && playerHitBox.height +playerHitBox.y > enemy.y){
                    result = true;
                }
            });
            return result;
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

    class Bullet{
        constructor(player){
            this.player = player;
            this.sizeModifier = 0.06;
            this.width = 160 * this.sizeModifier;
            this.height = 512  * this.sizeModifier;
            this.x = this.player.x + (this.player.width/2) - (this.width/2)
            this.y = this.player.y + (this.player.height/2)- (this.height/2)
            this.image = document.getElementById('bullets');
            this.vy = -15;
            this.markedForDeletion = false;
            this.audio = new Audio('Resources/Sounds/pistol_shoot.mp3')
            this.audio.play()
        }

        update(){
            this.y += this.vy;
            if(this.y < -this.height){
                this.markedForDeletion = true;
            }

        }

        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class InputHandler{
        constructor(game){
            this.keys = [];
            this.bulletKeyCount = 0;
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
                if(e.key =='ArrowUp' && this.game.player.bullets.length < 3){
                    this.bulletKeyCount++;
                }
            });
        }
    }
    
    class Game{
        constructor(width, height){
            this.width = width;
            this.height  = height;
            this.vy = 0;
            this.gameOver = false;
            this.gameStart = false;
            this.platforms = [];
            this.enemies = [];
            this.level = 0;
            this.ememyChance = 10;
            this.ememyMaxChance = 50;
            this.object_vx = 3;
            this.object_max_vx = 6;
            this.platform_gap = 50;
            this.scorept = 0;
            this.blue_white_platform_chance = 0;
            this.blue_white_platform_max_chance = 85;
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

            this.enemies.forEach(enemy => {
                enemy.update();
            });

            this.platforms = this.platforms.filter(platform => !platform.markedForDeletion);
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
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
            else if(this.player.y> this.width || this.gameOver){
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

                this.enemies.forEach(enemy => {
                    enemy.draw(context);
                });

                context.font = "bold 30px Arial";
                context.fillStyle = "black";
                context.textAlign = "start";
                context.fillText("Score: "+this.scorept, 20, 40);
            }
        }

        add_enemy(){
            this.enemies.push(new Enemy(this));
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

        change_difficulty(){
            this.level++;
            if(this.platform_max_gap > this.platform_gap){
                this.platform_gap += 5;
            }
            if(this.blue_white_platform_max_chance > this.blue_white_platform_chance){
                this.blue_white_platform_chance +=1;
            }
            if(this.level%5 == 0 && this.ememyMaxChance> this.ememyChance){
                this.enemyChance += 5;
            }
        }
        
    }
    
    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if(game.gameStart) game.update();
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate();
});

