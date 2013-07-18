function Level(level, world) {
	this.world = world;

	this.bullets = [];
	this.ebullets = [];
	this.events = [];
	this.effects = [];
	this.env = [];
	this.enemies = [];

	if(level == 1) {
		this.enemies = [
			new EnemyChopper(world, 200, 100), 
			new EnemyChopper(world, 400, 400), 
			new EnemyChopper(world, 300, -200), 
			new EnemyChopper(world, 450, -50), 
			new EnemyJet(world, 500, -200),
			new EnemyMegaShip(world, 800, -500),
		];
		for(var i = 0; i < 500; i++) {
			this.enemies.push(new EnemySoldier(world, Dice.roll(6000) - 3000, Dice.roll(6000) - 3000));
		}
		this.env = [
			new Hut1(world, 0, 0),
			new Hut1(world, 0, 428),
			new Hut1(world, 0, 228),
			new Hut2(world, 256, 428),
			new Hut2(world, 456, 428),
			new Hut2(world, 656, 428),
			new Hut2(world, 256, 928),
			new Hut2(world, 456, 928),
			new Hut2(world, 656, 928),
		];
	}
	this.x = 0;
	this.y = 0;

	this.v = {x:0, y:0};
	this.a = {x:0, y:0};

	this.bgColor = new Color(100,100,100);
	this.bg = new Sprite("img/bg.png");
	this.bg.x = 0;
	this.bg.y = 0;

	this.playerCollide = new TankCollide(world);
}

// collide with intraversable entities
Level.prototype.collide = function(e, ex, ey) {
	for(var i = 0; i < this.env.length; i++) {
		if(e.z != this.env[i].z) {
			continue;
		}
		if(this.env[i].collide(e, ex, ey)) {
			return true;
		}
	}
	return false;
}

// collide with enemies
Level.prototype.collideEnemies = function(e, ex, ey) {
	for(var i = 0; i < this.enemies.length; i++) {
		if(e.z != this.enemies[i].z) {
			continue;
		}
		if(this.enemies[i].collide(e, ex, ey)) {
			if(e.m > this.enemies[i].m) {
				this.enemies[i].hit(this.playerCollide);
				continue;
			}
			return true;
		}
	}
	return false;
}

Level.prototype.getClosestEnemy = function(e) {
	var min_i = 0;
	var min_d = 999999999;
	for(var i = 0; i < this.enemies.length; i++) {
		var d = Point.distance([e.x, e.y], [this.enemies[i].x, this.enemies[i].y]);
		if(d < min_d) {
			min_d = d;
			min_i = i;
		}
	}
	return this.enemies[min_i];
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
			if(this.enemies[j].collide(this.bullets[i])) {
				this.enemies[j].hit(this.bullets[i]);
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
	for(var i = 0; i < this.env.length; i++) {
		this.env[i].draw(screen);
	}
	for(var i = 0; i < this.effects.length; i++) {
		this.effects[i].draw(screen);
	}

	for(var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].draw(screen);
	}
	for(var i = 0; i < this.ebullets.length; i++) {
		this.ebullets[i].draw(screen);
	}
	this.world.player.draw(screen);

	for(var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(screen);
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