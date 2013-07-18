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
	return !this.invincible && this.hp <= 0;
}

Environment.prototype.destroyed = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
	this.world.player.score += this.score;
}

Environment.prototype.inView = function() {
    if((this.x + this.world.level.x + this.w/2 < -200) || (this.x + this.world.level.x - this.w/2 > 640 + 200)
      || (this.y + this.world.level.y + this.h/2 < -200) || (this.y + this.world.level.y - this.h/2 > 480 + 200)) {
        return false
    }
    return true;
}

function Hut1(world, x, y) {
	Environment.call(this);

	this.world = world;
	this.name = "Hut";
	var that = this;
	this.sprite = new Sprite("img/hut.png", function(sprite) {
		that.w = sprite.width() - 5;
		that.h = sprite.height() - 5;
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

Hut1.prototype.handle = function() {
	Environment.prototype.handle.call(this);

}

Hut1.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}




function Hut2(world, x, y) {
	Environment.call(this);

	this.world = world;
	this.name = "Hut2";
	var that = this;
	this.sprite = new Sprite("img/hut2.png", function(sprite) {
		that.w = sprite.width() - 5;
		that.h = sprite.height() - 5;
	});

	this.x = x;
	this.y = y;
	this.z = 0;
	this.hp = 5;
	this.hpm = 5;
	this.score = -300;
	this.invincible = true;
}


Hut2.prototype = new Environment();
Hut2.prototype.constructor = Hut2;

Hut2.prototype.handle = function() {
	Environment.prototype.handle.call(this);

}

Hut2.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}
