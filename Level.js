function Level(level, world) {
	this.world = world;
	if(level == 1) {
		this.enemies = [
			new EnemyChopper(world, 200, 100), 
			new EnemyChopper(world, 400, 400), 
			new EnemyChopper(world, 300, -200), 
			new EnemyChopper(world, 450, -50), 
			new EnemyJet(world, 500, -200)];
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

Level.prototype.collide = function(e, ex, ey) {
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
	for(var i = 0; i < this.enemies.length; i++) {
		this.enemies[i].draw(screen);
	}
}

Level.prototype.tileWidth = function() {
	return this.tileWidth;
}

Level.prototype.tileHeight = function() {
	return this.tileHeight;
}