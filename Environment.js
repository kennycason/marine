function Environment(world) {
	Entity.call(this);
	this.world = world;

	this.name = "None";

	this.hp = 1;
	this.hpm = 1;
	this.lastHit = 0;
	this.invincible = true;
}

Environment.prototype = new Entity();
Environment.prototype.constructor = Enemy;

Environment.prototype.handle = function() {
	if(this.invincible) {
		var time = Clock.time();
		if(time - this.lastHit > 200) {
			this.invincible = false;
		}
	}
}

Environment.prototype.hit = function(weapon) {
	if(!this.invincible) {
		this.hp -= weapon.damage;
		this.lastHit = Clock.time();
		this.invincible = true;
	}
}

Environment.prototype.draw = function() {
	alert('default Environment draw()');
}

Environment.prototype.destroy = function() {
	alert('default Environment die()');
}

Environment.prototype.destroyed = function() {
	alert('default Environment dead()');
}

function Hut1(world, x, y) {
	Environment.call(this);

	this.world = world;
	this.name = "Hut";
	var that = this;
	this.sprite = new Sprite("img/hut.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});

	this.x = x;
	this.y = y;
	this.z = 0;
	this.hp = 5;
	this.hpm = 5;
	this.score = -300;
	this.invincible = true;
}


Hut1.prototype = new Environment();
Hut1.prototype.constructor = Hut1;

Hut1.prototype.destroyed = function() {
	return !this.invincible && this.hp <= 0;
}

Hut1.prototype.destroy = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
	this.world.player.score += this.score;
}

Hut1.prototype.handle = function() {
	Environment.prototype.handle.call(this);

}

Hut1.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}
