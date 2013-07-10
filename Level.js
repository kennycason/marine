function Level(level, world) {
	this.world = world;

	this.bullets = [];
	this.ebullets = [];
	this.events = [];

	if(level == 1) {
		this.enemies = [
			new EnemyChopper(world, 200, 100), 
			new EnemyChopper(world, 400, 400), 
			new EnemyChopper(world, 300, -200), 
			new EnemyChopper(world, 450, -50), 
			new EnemyJet(world, 500, -200),
			new EnemySoldier(world, 25, 40),
			new EnemySoldier(world, 25, 65)
		];
		for(var i = 0; i < 50; i++) {
			this.enemies.push(new EnemySoldier(world, Dice.roll(3000) - 1500, Dice.roll(3000) - 1500));
		}
	}
	this.x = 0;
	this.y = 0;

	this.v = {x:0, y:0};
	this.a = {x:0, y:0};

	this.bgColor = new Color(100,100,100);
	this.bg = new Sprite("img/bg.png");
	this.bg.x = 0;
	this.bg.y = 0;
}

// collide with intraversable entities
Level.prototype.collide = function(e, ex, ey) {
	return false;
}

// collide with enemies
Level.prototype.collideEnemies = function(e, ex, ey) {
	for(var i = 0; i < this.enemies.length; i++) {
		if(this.enemies[i].collide(e, ex, ey)) {
			return true;
		}
	}
	return false;
}

Level.prototype.handle = function() {
	for(var i = 0; i < this.enemies.length; i++) {
		// handle general stuff
		this.enemies[i].handle();
		// handle death
		if(this.enemies[i].dead()) {
			this.enemies[i].die();
			this.enemies.splice(i, 1);
			i--;
		}
	}

	// player bullets
	for(var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].handle();
		if(this.bullets[i].finished()) {
			this.bullets[i].finish();
			this.bullets.splice(i, 1);
			i--;
		}
	}
	// handle player bullet/enemy collision
	for(var i = 0; i < this.bullets.length; i++) {
		for(var j = 0; j < this.enemies.length; j++) {
			var hit = this.enemies[j].hit(this.bullets[i]);
			if(hit) {
				this.bullets[i].finish();
				this.bullets.splice(i, 1);
				i--;
				break;
			}
		}
	}
	// enemy bullets
	for(var i = 0; i < this.ebullets.length; i++) {
		var finished = false;
		if(this.world.player.collide(this.ebullets[i])) {
			this.world.player.hit(this.ebullets[i].damage);
			finished = true;
		} else {
			this.ebullets[i].handle();
			if(this.ebullets[i].finished()) {
				finished = true;
			}
		}
		if(finished) {
			this.ebullets[i].finish();
			this.ebullets.splice(i, 1);
			i--;
		}
	}
	// events
	for(var i = 0; i < this.events.length; i++) {
		if(this.events[i].finished()) {
			this.events.splice(i, 1);
			i--;
		}
	}
}


Level.prototype.drawBackground = function(screen) {
	screen.clear(this.bgColor);
	for(var y = 0; y < 8; y++) {
		for(var x = 0; x < 8; x++) {
			this.bg.draw(screen, (this.x % 128) + x * 128 -128,  (this.y % 128) + y * 128 - 128);
		}	
	}
}

Level.prototype.draw = function(screen) {
	this.drawBackground(screen);
	this.world.player.draw(screen);

	for(var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(screen);
	}
	$("#data").html(screen);
	for(var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].draw(screen);
	}
	for(var i = 0; i < this.ebullets.length; i++) {
		this.ebullets[i].draw(screen);
	}
	for(var i = 0; i < this.events.length; i++) {
		this.events[i].draw(screen);
	}
}

Level.prototype.tileWidth = function() {
	return this.tileWidth;
}

Level.prototype.tileHeight = function() {
	return this.tileHeight;
}