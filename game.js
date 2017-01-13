

//Initialize our variables, that's a lot of variables
var canvas, context, frameRate, preLoader, spriteSheet, gameLoop, player, secondCounter, secondsPlayed, 
enemies, spawnCounter, asteroidSprite, activeAsteroids, enemyShoot, bullets, fireCounter, playerSprite, 
enemySprites, bulletSprite, shotsFired, gameTime, playerHealth, waitingToStart, playerMoveSpeed, healthSprite, 
metalSprite, spaceRubble, healthPowerupSprite, powerups, powerBulletSprite, bulletPowerup, bulletPowerupSprite, 
enemyBulletSprite, enemyBullet, gunEnergy, leftKey = false, rightKey = false, upKey = false, downKey = false, 
fireKey = false, enemySpawnTime = 40, playerReloadTime = 10, playerScore = 0, totalEnemies = 0;


//Our important functions!
function Sprite(img, spriteSheetX, spriteSheetY, spriteSheetWidth, spriteSheetHeight) 
{
  this.img = img;
  this.spriteSheetX = spriteSheetX;
  this.spriteSheetY = spriteSheetY;
  this.spriteSheetWidth = spriteSheetWidth;
  this.spriteSheetHeight = spriteSheetHeight;
}

function Button(text, bx, by, bw, bh)
{
	
	if (canvas && canvas.getContext) 
	{
		// list of rectangles to render
		var rects = [{x: bx, y: by, w: bw, h: bh}];
  
		
		if (context) 
		{

			for (var i = 0, len = rects.length; i < len; i++) 
			{
				context.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
				context.fillStyle = "orange";
				context.fillRect(bx, by, bw, bh);
				context.fillStyle = "red";
				context.fillText(text, bx+6, by+33);
			}

		}
	
	
		canvas.addEventListener('click', function(e) 
		{
			
			var rect = collides(rects, e.offsetX, e.offsetY);
			if (rect) 
			{
				
				if(playerHealth == 0) location.reload();
					else if(waitingToStart == 1) initialize();
			} 
			
		}, false);
	}
}
	
	
function collides(rects, x, y) 
{
    var isCollision = false;
    for (var i = 0, len = rects.length; i < len; i++) 
	{
        var left = rects[i].x, right = rects[i].x+rects[i].w;
        var top = rects[i].y, bottom = rects[i].y+rects[i].h;
        if (right >= x && left <= x && bottom >= y && top <= y) 
		{
            isCollision = rects[i];
        }
    }
    return isCollision;
}

function Player(sprite, x, y) 
{
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.radius = 45;
}



function Enemy(x, y, enemyType) 
{
	//eType 1 == normal enemy
	//eType 2 == asteroid
	switch(enemyType)
	{
		case 0:
		{
			this.name = "Orange Drone";
			this.sprite = enemySprites[0];
			this.x = x;
			this.y = y;
			this.speed = (Math.random()*1.3+1) + enemyModifier/10;
			this.radius = 40;
			this.scoreModifier = 1;
			this.health = 1;
			this.eType = 1;
			this.shootSpeed = 1;
			break;
		}
		
		case 1:
		{
			this.name = "Green Spotter";
			this.sprite = enemySprites[1];
			this.x = x;
			this.y = y;
			this.speed = (Math.random()*2.8+0.8) + enemyModifier/10;
			this.radius = 40;
			this.scoreModifier = 3;
			this.health = 2;
			this.eType = 1;
			this.shootSpeed = 2;
			break;
		}
		
		case 2:
		{
			this.name = "Blue Lethal Unit";
			this.sprite = enemySprites[2];
			this.x = x;
			this.y = y;
			this.speed = (Math.random()*1.8+1.5) + enemyModifier/10;
			this.radius = 40;
			this.scoreModifier = 4;
			this.health = 4;
			this.eType = 1;
			this.shootSpeed = 3;
			break;
		}
		
		case 10:
		{
			var diffModifier = GetRandomInt(1, 3);
			this.name = "Dr. Mitch Asteroid v" + diffModifier + "d";
			this.sprite = asteroidSprite;
			this.x = x;
			this.y = y;
			this.speed = ((Math.random()*0.5+1) + enemyModifier/25) - diffModifier/4;
			this.health = 10 * diffModifier;
			this.scoreModifier = 15 * diffModifier;
			this.radius = 45;
			this.eType = 2;
			break;
		}
	}
	this.shotLoad = 0;
	this.enemyType = enemyType;
}

function Bullet(x, y, type) 
{
	this.x = x;
	this.y = y;
	
	switch(type)
	{
		case 0:
		{
			this.sprite = bulletSprite;
			this.speed = 8;
			this.radius = 5;
			this.damage = 1;
			break;
		}
		case 1:
		{
			this.sprite = powerBulletSprite;
			this.speed = 12;
			this.radius = 8;
			this.damage = 2;
			break;
		}
	}
  
}

function BulletEnemy(x, y, type)
{
	this.x = x;
	this.y = y;
	this.speed = 5;
	switch(type)
	{
		case 0:
			this.damage = 1;
		break;
		
		case 1:
			this.damage = 1;
		break;
		
		case 2:
			this.damage = 2;
		break;
		
	}
	this.sprite = enemyBulletSprite;
	this.radius = 5;
	
}

function Powerup(type, x, y)
{
	this.x = x;
	this.y = y;
	this.radius = 10;
	this.type = type;
	switch(type)
	{
		case 0: 
			this.sprite = healthPowerupSprite;
		break;
		
		case 1:
			this.sprite = bulletPowerupSprite;
		break;
	}
}

function SpaceRubble(x, y)
{
	this.sprite = metalSprite;
	this.x = x;
	this.y = y;
	this.decayTime = 50;
}

Sprite.prototype.draw = function(x, y)
{
  context.drawImage(
    this.img,
    this.spriteSheetX,        //x in sheet
    this.spriteSheetY,        //y in sheet
    this.spriteSheetWidth,    //width in sheet
    this.spriteSheetHeight,   //height in sheet
    x,                        //x in canvas
    y,                        //y in canvas
    this.spriteSheetWidth,    //width in canvas
    this.spriteSheetHeight   //height in canvas
  );
}

function preLoaderCheck() 
{
	if (spriteSheet.ready) 
	{
		clearInterval(preLoader);
		PreInitialize();
	}
}

preLoader = setInterval(preLoaderCheck, 20);

//Load spritesheet
spriteSheet = new Image();
spriteSheet.src = "sheet.png";
spriteSheet.ready = false;
spriteSheet.onload = setAssetReady;

function setAssetReady() 
{
	this.ready = true;
}

function keyDownHandler(event) 
{
	var keyPressed = String.fromCharCode(event.keyCode);
	if (keyPressed == "W") 
	{
	upKey = true;
	}
	if (keyPressed == "S")	  
	{
	downKey = true;
	}
	if (keyPressed == "A") 
	{
	leftKey = true;
	}
	if (keyPressed == "D") 
	{
	rightKey = true;
	}
	if (keyPressed == "E") 
	{
	fireKey = true;
	}
}

function GetDifficultyName(difficulty)
{
	switch(difficulty-4) //difficulty-4 because of the default 4 enemies that spawn
	{
		case 0: 
			return "Extremely easy";
			break;
			
		case 1:
			return "Easy in so many ways";
			break;
			
		case 2:
			return "Normal";
			break;
		
		case 3:
			return "Advanced";
			break;
			
		case 4:
			return "Advanced";
			break;
		
		case 5:
			return "Hard";
			break;
		
		case 6:
			return "Really hard";
			break;
			
		default: 
			return "Extraordinary difficult";
		
	}
}

function keyUpHandler(event) 
{
	var keyPressed = String.fromCharCode(event.keyCode);
	if (keyPressed == "W") 
	{
		upKey = false;
	}
	if (keyPressed == "S") 
	{
		downKey = false;
	}
	if (keyPressed == "A") 
	{
		leftKey = false;
	}
	if (keyPressed == "D") 
	{
		rightKey = false;
	}
	if (keyPressed == "E") 
	{
		fireKey = false;
	}
}

function circularHitDetection(entity1, entity2) 
{
  var a = entity1.x - entity2.x;
  var b = entity1.y - entity2.y;
  var distance = Math.sqrt(a * a + b * b);
  if (distance < entity1.radius + entity2.radius) return true;
  return false;
}


function removeClickHandler()
{
    document.getElementById("demo").innerHTML = Math.random();
}




function initialize() 
{

	clearInterval(gameLoop);
	clearInterval(secondCounter);
	clearInterval(enemyShoot);
	frameRate = 1000 / 50;
	spawnCounter = 0;
	fireCounter = 0;
	playerSprite = new Sprite(spriteSheet, 325, 0, 99, 74);
	bulletSprite = new Sprite(spriteSheet, 835, 753, 13, 36);
	healthSprite = new Sprite(spriteSheet, 391, 991, 36, 26);
	asteroidSprite = new Sprite(spriteSheet, 327, 548, 98, 95);
	metalSprite = new Sprite(spriteSheet, 144, 239, 50  , 48);
	healthPowerupSprite = new Sprite(spriteSheet, 774, 977, 33, 33);
	powerBulletSprite = new Sprite(spriteSheet, 849, 310, 12, 54);
	bulletPowerupSprite = new Sprite(spriteSheet, 775, 647, 33, 32);
	enemyBulletSprite = new Sprite(spriteSheet, 843, 904, 13, 34);
	
	enemySprites = [
	new Sprite(spriteSheet, 423, 644, 96, 84),
	new Sprite(spriteSheet, 519, 493, 81, 84),
	new Sprite(spriteSheet, 425, 469, 92, 83)
	];
	player = new Player(playerSprite, canvas.width / 2, canvas.height / 2);
	enemies = [];
	bullets = [];
	rubble = [];
	powerups = [];
	enemyBullet = [];
	
	bulletPowerup = 0;
	document.addEventListener("keydown", keyDownHandler);
	document.addEventListener("keyup", keyUpHandler);
	
	gameLoop = setInterval(update, frameRate);
	enemyShoot = setInterval(NewEnemyShot, 1500);
	secondsPlayed = 0;
	spawnCounter = 0;
	totalEnemies = 0;
	gameTime = 0;
	playerHealth = 3;
	playerMoveSpeed = 6;
	activeAsteroids = 0;
	shotsFired = 0;
	gunEnergy = 1000;
	secondCounter = setInterval(function() { secondsPlayed++; }, 1000);
	canvas.removeEventListener("click", removeClickHandler);
		

}

function NewEnemyShot()
{
	for(var i = 0; i < enemies.length; i++)
	{
		if(enemies[i].eType != 2) //If enemy is not an asteroid
		{
			enemies[i].shotLoad++;
			if(enemies[i].shotLoad == enemies[i].shootSpeed)
			{
				enemies[i].shotLoad = 0;
				enemyBullet.push(new BulletEnemy(enemies[i].x, enemies[i].y, enemies[i].enemyType));
			}
		}
	}
}



function GetRandomInt(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

function RandomizeEnemysMore(enemy)
{
	
	var ret = enemy;
	
	if(enemy == 2)
	{	
		
		if(GetRandomInt(1, 50) < 30) 
		{
			ret = GetRandomInt(0, 2);
		}
		
	}
	
	return ret;
}

function DropPowerup(posx, posy)
{
	var chance = GetRandomInt(0, 100);
	if(chance <= 5)
	{
		powerups.push(new Powerup(GetRandomInt(0, 2), posx, posy));
	}
}

function update() 
{
  spawnCounter++;
  gameTime++;

  enemyModifier = Math.floor((gameTime/1500) + 4); //approx. 36 seconds until difficulty increases
  
  if (spawnCounter > enemySpawnTime && totalEnemies < enemyModifier)
  {
	  spawnCounter = 0;
	  if(enemyModifier > 7 && GetRandomInt(0, 50) < 20 && activeAsteroids < Math.floor(2 + enemyModifier/10)) //Spawn asteroid
	  {
		var leftright = GetRandomInt(0, 2);
		
		var randomSpawnPosX;
		if(leftright == 0) randomSpawnPosX = GetRandomInt(5, canvas.width/6);
		if(leftright == 1) randomSpawnPosX = GetRandomInt(1005, canvas.width);
		enemies.push(new Enemy(randomSpawnPosX, -50, 10));
		totalEnemies++;
		activeAsteroids++;
	  }
	  else
	  {
		  
		var randomEnemy = Math.floor(Math.random() * enemySprites.length);
		randomEnemy = RandomizeEnemysMore(randomEnemy);
		var randomSpawnPosX = GetRandomInt(150, canvas.width);
		enemies.push(new Enemy(randomSpawnPosX, -50, randomEnemy));
		totalEnemies++;
	  }
    
  }
  
  if (fireCounter > 0) 
  {
    fireCounter--;
  } 
  else if (fireKey && fireCounter == 0) 
  {
    fireCounter = playerReloadTime;
    if(bulletPowerup > 0 && gunEnergy > 75)
	{
		bullets.push(new Bullet(player.x, player.y, 1));
		gunEnergy -= 75;
		bulletPowerup--;
	}
	else if(gunEnergy > 65 && bulletPowerup < 1)
	{
		bullets.push(new Bullet(player.x, player.y, 0));
		gunEnergy -= 65;
		shotsFired++;
	}
	
  }


  
  for (var i = 0; i < enemies.length; i++) 
  {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height + 50) 
	{
		if(enemies[i].eType == 2) activeAsteroids--;

		enemies.splice(i, 1);
		i--;
		totalEnemies--;
    }
  }
  for (var i = 0; i < bullets.length; i++)
  {
	bullets[i].y -= bullets[i].speed;
	if (bullets[i].y < 0) 
	{
		bullets.splice(i, 1);
		i--;
	}
  }
  
  for (var i = 0; i < enemyBullet.length; i++)
  {
		enemyBullet[i].y += enemyBullet[i].speed;
		if (enemyBullet[i].y > canvas.height) 
		{
			enemyBullet.splice(i, 1);
			i--;
		}
		else if(circularHitDetection(player, enemyBullet[i]))
		{
			playerHealth = playerHealth-enemyBullet[i].damage;
			console.log(enemyBullet[i].damage);
			enemyBullet.splice(i, 1);
			i--;
		}
  }


  for (var i = 0; i < bullets.length; i++) 
  {
    for (var j = 0; j < enemies.length; j++) 
	{
      if (circularHitDetection(bullets[i], enemies[j])) 
	  {
		  
		enemies[j].health -= bullets[i].damage;
		
		if(enemies[j].health  < 1)
		{
			
			playerScore += Math.floor((enemies[j].scoreModifier * enemyModifier/10) + enemies[j].scoreModifier);
			
			if(enemies[j].eType == 2) activeAsteroids--;
			
			rubble.push(new SpaceRubble(enemies[j].x, enemies[j].y));
			DropPowerup(enemies[j].x, enemies[j].y);
			enemies.splice(j, 1);
			
			totalEnemies--;
			
			
		}
		 
		
		bullets.splice(i, 1);
		i--;
		
		break;
      }
	
		
    }
  }
  
  
	
  
	for(var i = 0; i < enemies.length; i++)
	{
	  
		if(circularHitDetection(player, enemies[i]))
		{
			if(enemies[i].eType == 2) activeAsteroids--;
			rubble.push(new SpaceRubble(enemies[i].x, enemies[i].y));
			enemies.splice(i, 1);
			totalEnemies--;
			i--;
			playerHealth--;
		}
	}
	
	
	for(var i = 0; i < powerups.length; i++)
	{
	  
		if(circularHitDetection(player, powerups[i]))
		{
			if(powerups[i].type == 0) playerHealth++;
			else if(powerups[i].type == 1) bulletPowerup = 5;
			
			powerups.splice(i, 1);
			i--;
		}
	}
		

	if (leftKey && player.x > 0) 
	{
		player.x -= playerMoveSpeed;
	} 
	else if (rightKey && player.x < canvas.width) 
	{
		player.x += playerMoveSpeed;
	}
	if (upKey && player.y > 0) 
	{
		player.y -= playerMoveSpeed;
	} 
	else if (downKey && player.y < canvas.height) 
	{
		player.y += playerMoveSpeed;
	}

	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	

	
	for (var i = 0; i < enemies.length; i++)
	{
		context.save();
		context.translate(-enemies[i].sprite.spriteSheetWidth / 2,
		  -enemies[i].sprite.spriteSheetHeight / 2);
		enemies[i].sprite.draw(enemies[i].x, enemies[i].y);
		context.fillStyle = "red";
		context.font = "10px Arial";
		context.fillText(enemies[i].name, enemies[i].x, enemies[i].y-25);
		context.fillText("Health: " + enemies[i].health, enemies[i].x+20, enemies[i].y-10);	
		context.restore();
	}
	for (var i = 0; i < bullets.length; i++)
	{
		context.save();
		context.translate(-bullets[i].sprite.spriteSheetWidth / 2,
		  -bullets[i].sprite.spriteSheetHeight / 2);
		bullets[i].sprite.draw(bullets[i].x, bullets[i].y);
		context.restore();
	}
	
	for (var i = 0; i < enemyBullet.length; i++)
	{
		context.save();
		context.translate(-enemyBullet[i].sprite.spriteSheetWidth / 2,
		  -enemyBullet[i].sprite.spriteSheetHeight / 2);
		enemyBullet[i].sprite.draw(enemyBullet[i].x, enemyBullet[i].y);
		context.restore();
	}
	  
	for(var i = 0; i < rubble.length; i++)
	{
	  if(rubble[i].decayTime > 0)
	  {
		  context.save();
		  rubble[i].sprite.draw(rubble[i].x, rubble[i].y);
		  context.restore();
		  rubble[i].decayTime--;
	  }
	  else
	  {
		  rubble.splice(i, 1);
	  }
	}
	
	for(var i = 0; i < powerups.length; i++)
	{
	  
	  context.save();
	  powerups[i].sprite.draw(powerups[i].x, powerups[i].y);
	  context.restore();
  
	}
	
	
	context.save();
	context.fillStyle = "lightblue";
	context.fillRect(player.x - 50, player.y + 50, gunEnergy/10, 25);
	context.restore();
	
	if(gunEnergy < 1000) gunEnergy += 2.5;
	
	
	context.save();
	context.translate(-player.sprite.spriteSheetWidth / 2,
	  -player.sprite.spriteSheetHeight / 2);

	player.sprite.draw(player.x, player.y);
	context.restore();

	context.fillStyle = "red";
	context.font = "20px Arial";
	context.fillText("Health: ", 5,25); //Draw the health sprites behind this string
	context.fillText("Score: " + playerScore,5,55);
	context.fillText("Difficulty: " + GetDifficultyName(enemyModifier) + " (" + enemyModifier + ")", 5, canvas.height-5.3);
	context.fillText("Enemies: " + totalEnemies + "/" + enemyModifier, canvas.width-140, canvas.height-5.3);

	
	if(playerHealth == 0)
	{
		ShowGameOverScreen();
	}
	
	for(var i = 0; i < playerHealth; i++)
	{
		context.save();
		healthSprite.draw(75 + (i * 41), 4);
		context.restore();
	}
	

	
}


function ShowGameOverScreen()
{
	clearInterval(gameLoop);
	clearInterval(secondCounter);
	document.addEventListener("keydown", keyDownHandler);
	document.addEventListener("keyup", keyUpHandler);
	context.clearRect(0,0, canvas.width, canvas.height); 
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "red";
	context.font = "50px Arial";
	context.fillText("GAME OVER", canvas.width/2.78, canvas.height/2);
	context.font = "20px Arial";
	context.fillText("You died. Your score was " + playerScore, canvas.width/2.55, canvas.height/1.9);
	
	var r = confirm("Do you want to submit your highscore?");
	if(r == true)
	{
		var name = prompt("Please enter your name", "Your Name");
		if(name != null)
		{
			var request = new XMLHttpRequest();
			request.onload = function()
			{
				var status = request.status;
				var data = request.responseText;
			}
			
			httpGetAsync("sendscore.php?pName=" + name + "&pScore=" + playerScore + "&pLevel=" + enemyModifier + "&pShots=" + shotsFired + "&pTime=" + secondsPlayed);
			alert("Your score has been sent.");
		}
		else
		{
			alert("Warning, score not sent.");
		}
	}

	new Button("MAIN MENU", canvas.width/2.28, canvas.height/1.8, 124, 50);
	
	
}

function PreInitialize()
{
	canvas = document.getElementById("gameCanvas");
	canvas.width = 1200;
	canvas.height = 860;
	context = canvas.getContext("2d");
	
	
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "red";
	context.font = "50px Arial";
	context.fillText("Welcome to JavaSpace", canvas.width/3.7, canvas.height/2);
	context.font = "20px Arial";
	context.fillText("Click Start Game to begin", canvas.width/2.55, canvas.height/1.9);
	waitingToStart = 1;
	
	
	
	new Button("Start Game", canvas.width/2.3, canvas.height/1.8, 115, 50);
	
}

function httpGetAsync(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}