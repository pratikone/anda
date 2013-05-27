/*

Meri Bhains Ko Anda kyun Maara ?

Copyright:
@author:PRATIK ANAND
pratik@pratikanand.com
twitter/irc:pratikone

2012


Images used are copyrights of respective owners
*/



// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

document.body.appendChild(canvas);


//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";


//Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
heroReady = true;
};
heroImage.src = "images/hero.png";

//Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
monsterReady = true;
};
monsterImage.src = "images/buffalo.png";


//Bullet image
var missileImage=new Image();
missileImage.src="images/missile.png";

//Gobar image
var bombImage=new Image();
bombImage.src="images/gobar.png";

//Omelette image
var omeletteImage=new Image();
omeletteImage.src="images/omelette.png";



//Egg image
var eggL=new Image();
eggL.src="images/eggL.png";
var eggR=new Image();
eggR.src="images/eggR.png";


//Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};


var omelette = {
	x: 0,
	y: 0,
	draw: false
};


var monstersCaught = 0;
var totalMissiles=2;
var fireTime=0;
var eggChangeTime=0;
var omeletteChangeTime=0;
var missiles=[]; //missile cache
var bombs=[];	//bomb cache
var eggs=[];   //egg cache

//Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Reset the game when the player catches a monster
var reset = function () {
	missiles=[];
	bombs=[];
	eggs=[];
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	resetMonster();
};

var resetMonster=function(){
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	fireBomb(monster.x,monster.y);

}

//Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(hero.y>32)
		{
		   hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y<(canvas.height-64))
		{
			hero.y += hero.speed * modifier;
		}	
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x>32)
		{
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x<(canvas.width-64))
		{
			hero.x += hero.speed * modifier;
		}
	}
	
	if (32 in keysDown && missiles.length<=totalMissiles) { // Player holding space
				var new_now=Date.now();
			if((new_now-fireTime)>=100){  		//more time to fire a missile
					invokeMissile();
					fireTime=new_now;
			}
			
			
			//console.log(""+missiles.length)
		
	}
	
	
		
	
	
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
	
	
};

//push missiles into cache
var invokeMissile=function(){
		var abc=new Object();
		abc.x=hero.x;
		abc.y=hero.y;
		abc.bool=-1; //L or R: applicable to eggs only
		missiles.push(abc);
		eggs.push(abc);
}

//push bombs into cache
var fireBomb=function(x,y){
		var abc=new Object();
		
		abc.x=x;
		abc.y=y;
		abc.x_dest=hero.x;
		abc.y_dest=hero.y;
		
		var div=150;
		var max=0.1;
		
		if(abc.x<=abc.x_dest){//left of hero
		 		abc.x_ctr=Math.max(Math.abs((abc.x_dest-abc.x)/div),max);
				
				 }
		 else{ 									 //right of hero
				abc.x_ctr=-Math.max(Math.abs((abc.x_dest-abc.x)/div),max);
				
				}
				
		if(abc.y<=abc.y_dest){//above hero
		 		abc.y_ctr=Math.max(Math.abs((abc.y_dest-abc.y)/div),max);
				
		 }
		 else{ 									 //below hero
				abc.y_ctr=-Math.max(Math.abs((abc.y_dest-abc.y)/div),max);
				
				}		
		
		
		
		bombs.push(abc);

}

var checkHit=function(){  //if missile hits an object
/*
for (var i = 0; i < missiles.length; i++) {
        if (
		missiles[i].x <= (monster.x + 32)
		&& monster.x <= (missiles[i].x + 32)
		&& missiles[i].y <= (monster.y + 32)
		&& monster.y <= (missiles[i].y + 32)
	) {
		++monstersCaught;  
		reset();
		break;
		}
	}
*/	
for (var i = 0; i < eggs.length; i++) {
        if (
		eggs[i].x <= (monster.x + 32)
		&& monster.x <= (eggs[i].x + 32)
		&& eggs[i].y <= (monster.y + 32)
		&& monster.y <= (eggs[i].y + 32)
	) {
		showbrokenegg(eggs[i].x,eggs[i].y);
		++monstersCaught;
		reset();
		break;
		}
	}	

	for (var i = 0; i < bombs.length; i++) {
        if (
		bombs[i].x <= (hero.x + 32)
		&& hero.x <= (bombs[i].x + 32)
		&& bombs[i].y <= (hero.y + 32)
		&& hero.y <= (bombs[i].y + 32)
	) {
		--monstersCaught;
		reset();
		break;
	}
    
	}
}

var showbrokenegg=function(x,y){
	omelette.x=x;
	omelette.y=y;
	omelette.draw=true;

}


var updateMissilePos=function(){ 	//update position of fired missiles

for (var i = 0; i < missiles.length; i++) {
        missiles[i].x+=3;
		if(missiles[i].x>canvas.width){
			missiles.splice(i,1);
		}
    }
	
	
for (var i = 0; i < eggs.length; i++) {
        eggs[i].x+=2;
		if(eggs[i].x>canvas.width){
			eggs.splice(i,1);
		}
    }	

}

var updateBombPos=function(){ 	//update position of fired bombs

for (var i = 0; i < bombs.length; i++) {
        bombs[i].x+=bombs[i].x_ctr;
		bombs[i].y+=bombs[i].y_ctr;
				
		if(bombs[i].x>canvas.width || bombs[i].x<=0 || bombs[i].y>canvas.height || bombs[i].y<=0){
			bombs.splice(i,1);
		}
    }

}



var teleport=function(){  	 //teleport a monster regularly

var new_now=Date.now();
			if((new_now-fireTime)>=1500){  		
					resetMonster();
					fireTime=new_now;
			}

}


var refresh=function(){     //refresh

	updateMissilePos();
	updateBombPos();
	checkHit();
	teleport();


};

//Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
	//console.log(omelette.draw);
	if (omelette.draw) {
		ctx.drawImage(omeletteImage, omelette.x, omelette.y);
		var new_now=Date.now();
				if((new_now-omeletteChangeTime)>=3000){  		//calculate time to change sprite
					omelette.draw=false;
					omeletteChangeTime=new_now;
				}
	}
	console.log(omeletteChangeTime);
	
	/*
	if (missiles.length)
    for (var i = 0; i < missiles.length; i++) {
        ctx.drawImage(missileImage, missiles[i].x, missiles[i].y);
    }
	*/
	
	if (eggs.length){
		for (var i = 0; i < eggs.length; i++) {
			if(eggs[i].bool==-1){  			//L
				ctx.drawImage(eggL, eggs[i].x, eggs[i].y);
				}
			else{							//R
				ctx.drawImage(eggR, eggs[i].x, eggs[i].y);
				}
		}	
			var new_now=Date.now();
				if((new_now-eggChangeTime)>=300){  		//calculate time to change sprite
					for(var i=0;i<eggs.length;i++){
						eggs[i].bool*=-1;
					}
						eggChangeTime=new_now;
				}
		
	}
	
	if (bombs.length)
    for (var i = 0; i < bombs.length; i++) {
        ctx.drawImage(bombImage, bombs[i].x, bombs[i].y);
    }
	
	refresh(); //refreshing few elements of the game
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Bhains nuked: " + monstersCaught, 32, 32);
	//ctx.fillText('Created by Pratik Anand', 32, 64);
	ctx.fillText('Meri bhains ko anda kyun maara', 32, 50);
	
};

//The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};


//Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

