function Game() {

	this.keyboard = new Keyboard();
	this.mouse = new Mouse();

	this.screen = new Canvas();

	this.player = new PlayerTank(this);

	this.level = new Level(1, this);

	this.paused = false;

	this.gameloopInterval;

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

		if(this.keyboard.isKeyPressed(Keys.LEFT) || this.keyboard.isKeyPressed(Keys.A)) {
			if(!this.level.collide(this.player, this.player.x - this.player.v.x, this.player.y - this.level.y)) {
				this.player.a.x = -0.5;
			} else {
				this.player.a.x = 0;
				this.player.v.x = 0;
			}
		}
		if(this.keyboard.isKeyPressed(Keys.RIGHT) || this.keyboard.isKeyPressed(Keys.D)) {
			if(!this.level.collide(this.player, this.player.x + this.player.v.x, this.player.y - this.level.y)) {
				this.player.a.x = 0.5;
			} else {
				this.player.a.x = 0;
				this.player.v.x = 0;
			}
		}
		if(this.keyboard.isKeyPressed(Keys.DOWN) || this.keyboard.isKeyPressed(Keys.S)) {
			if(!this.level.collide(this.player, this.player.x, this.player.y + this.player.v.y)) {
				this.player.a.y = 0.5;
			} else {
				this.player.a.y = 0;
				this.player.v.y = 0;
			}
		}
		if(this.keyboard.isKeyPressed(Keys.UP) || this.keyboard.isKeyPressed(Keys.W)) {
			if(!this.level.collide(this.player, this.player.x, this.player.y - this.player.v.y)) {
				this.player.a.y = -0.5;
			} else {
				this.player.a.y = 0;
				this.player.v.y = 0;
			}
		}

		this.player.handle();
		this.level.handle();
	}

	this.draw = function() {
		this.level.draw(this.screen);
		this.drawHUD();
	}

	this.drawHUD = function() {
		var filled = Palette.DARK_GRAY;
		var empty = Palette.LIGHT_GRAY;
		if(this.player.invincible) {
			if(this.altColor == 1) {
				this.altColor = 0;
				filled = Palette.RED;
			} else {
				this.altColor = 1;
				filled = Palette.LIGHT_RED;
			}
		} 
		for(var i = 0; i < this.player.hpm; i++) {
			this.screen.drawRect(4 + i * 10, 4, 9, 22, Palette.BLACK);
			if(this.player.hp > i) {
				this.screen.drawRect(5 + i * 10, 5, 7, 20, filled);
			} else {
				this.screen.drawRect(5 + i * 10, 5, 7, 20, empty);
			}
		}
		// score
		if(this.player.score > 0) {
			this.screen.drawText(this.player.score, 250, 23, Palette.BLACK, "normal 20px Comic San");
		}
		// weapons
		this.player.weapons[this.player.currentWeapon].obj.hud(this.screen);
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

Clock = {

	time : function() {
		return new Date().getTime();
	}
}