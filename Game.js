function Game() {

	this.keyboard = new Keyboard();
	this.mouse = new Mouse();

	this.screen = new Canvas();

	// global entities, move to level?
	this.bullets = [];
	this.explosions = [];

	this.level = new Level(1, this);

	this.player = new PlayerTank(this);

	this.paused = false;

	this.gameloopInterval;

/*	this.marine = new Sprite("img/marine1.png");
	this.troops = [
				[new Entity(this.marine, 550, 300), new Entity(this.marine, 550, 315), new Entity(this.marine, 550, 330)],
				[new Entity(this.marine, 565, 300), new Entity(this.marine, 565, 315), new Entity(this.marine, 565, 330)],
				[new Entity(this.marine, 580, 300), new Entity(this.marine, 580, 315), new Entity(this.marine, 580, 330)],
				[new Entity(this.marine, 595, 300), new Entity(this.marine, 595, 315), new Entity(this.marine, 595, 330)]
			];*/

	this.run = function() {
		this.initKeyboard();
		var that = this;
		var FPS = 30;
		window.addEventListener('focus', function() {
			that.gameloopInterval = setInterval(function() {
				if(!that.paused) {
					that.handle();
					that.draw();	
				}
			}, 33);
		});    
		window.addEventListener('blur', function() {
			window.clearInterval(that.gameloopInterval);
		});
	}

	this.handle = function() {
		this.player.a.x = 0; 
		this.player.a.y = 0;

		if((this.keyboard.isKeyPressed(Keys.LEFT) || this.keyboard.isKeyPressed(Keys.A))
			&& !this.level.collide(this.player, this.player.x - this.player.v.x - this.level.x, this.player.y - this.level.y)) {
			this.player.a.x = -0.5;
		}
		if((this.keyboard.isKeyPressed(Keys.RIGHT) || this.keyboard.isKeyPressed(Keys.D))
			&& !this.level.collide(this.player, this.player.x + this.player.v.x- this.level.x, this.player.y - this.level.y)) {
			this.player.a.x = 0.5;
		}
		if((this.keyboard.isKeyPressed(Keys.DOWN) || this.keyboard.isKeyPressed(Keys.S))
			&& !this.level.collide(this.player, this.player.x - this.level.x, this.player.y + this.player.v.y - this.level.y)) {
			this.player.a.y = 0.5;
		}
		if((this.keyboard.isKeyPressed(Keys.UP) || this.keyboard.isKeyPressed(Keys.W))
			&& !this.level.collide(this.player, this.player.x - this.level.x, this.player.y - this.player.v.y - this.level.y)) {
			this.player.a.y = -0.5;
		}
		this.player.handle();
		this.level.handle();
		this.handleBullets();

	}

	this.handleBullets = function() {
		for(var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].handle();
			if(this.bullets[i].finished()) {
				this.bullets[i].finish();
				this.bullets.splice(i, 1);
				i--;
			}
		}
		// handle bullet/enemy collision
		for(var i = 0; i < this.bullets.length; i++) {
			for(var j = 0; j < this.level.enemies.length; j++) {
				this.level.enemies[j].hit(this.bullets[i]);
			}
		}

		for(var i = 0; i < this.explosions.length; i++) {
			if(this.explosions[i].finished()) {
				this.explosions.splice(i, 1);
				i--;
			}
		}
	}

	this.draw = function() {
		this.level.drawBackground(this.screen);
/*		for(var y = 0; y < 3; y++) {
			for(var x = 0; x < 4; x++) {
				this.troops[x][y].x--;
				this.troops[x][y].sprite.draw(this.screen, this.level.x + this.troops[x][y].x, this.level.y + this.troops[x][y].y);
			}	
		}*/
		for(var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].draw(this.screen);
		}
		for(var i = 0; i < this.explosions.length; i++) {
			this.explosions[i].draw(this.screen);
		}
		this.player.draw(this.screen);
		this.level.draw(this.screen);
		this.drawHUD();
	}

	this.drawHUD = function() {
		for(var i = 0; i < this.player.hpm; i++) {
			this.screen.drawRect(4 + i * 10, 4, 9, 22, Palette.BLACK);
			if(this.player.hp > i) {
				this.screen.drawRect(5 + i * 10, 5, 7, 20, Palette.GREEN);
			} else {
				this.screen.drawRect(5 + i * 10, 5, 7, 20, Palette.RED);
			}
		}
		this.screen.drawText("x 3", 120, 23, Palette.BLACK, "normal 24px Comic San");
	}

	this.initKeyboard = function() {
		// bind clicks
		var that = this;
		this.keyboard.onKeyPressed(Keys.ENTER, function() {
			window.location.reload();
		});
		this.keyboard.onKeyPressed(Keys.P, function() {
			that.paused = !that.paused;
		});

	}

}

// calculate angle, theta, between two vectors
function vectorTheta(A, B) {
	// A · B = A B cos θ = |A||B| cos θ
	var A_B = A[0]*B[0] + A[1]*B[1]
	var AM = Math.sqrt(A[0] * A[0] + A[1] * A[1]);
	var BM = Math.sqrt(B[0] * B[0] + B[1] * B[1]);
	// cos θ = A · B / |A||B|
	var cosTheta = A_B/ (AM * BM);
	return Math.acos(cosTheta);
}