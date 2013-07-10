function Weapon(world) {
	Entity.call(this);
	this.world = world;
	this.orig = {x : 0, y : 0};
	this.range = 0;
	this.damage = 0;
}
Weapon.prototype = new Entity();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.distance = function() {
	return Point.distance([this.x, this.y], [this.orig.x, this.orig.y]);
}

Weapon.prototype.draw = function(screen) {
	alert('default weapon draw()');
}

Weapon.prototype.finished = function() {
	return this.distance() > this.range;
}

Weapon.prototype.finish = function() {

}

Weapon.prototype.handle = function() {
	this.x += this.v.x;
	this.y += this.v.y;
}



function Bullet(world) {
	Weapon.call(this, world);

	var that = this;
	this.sprite = new Sprite("img/bullet.png", function(sprite) {
	that.w = sprite.width();
	that.h = sprite.height();	
	});
	this.range = 300;
	this.damage = 1;
}
Bullet.prototype = new Weapon();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.x + this.world.level.x, this.y + this.world.level.y);
}



function Grenade(world) {
	Weapon.call(this, world);

	var that = this;
	this.sprite = new Sprite("img/grenade.png", function(sprite) {
	that.w = sprite.width();
	that.h = sprite.height();	
	});
	this.rotation = 0;
	this.range = 200;
	this.damage = 2;
	this.ds = 0.1;
	this.s = 1.0;
}
Grenade.prototype = new Weapon();
Grenade.prototype.constructor = Grenade;

Grenade.prototype.handle = function() {
	this.x += this.v.x;
	this.y += this.v.y;
	this.rotation += 0.3;
	this.sprite.rotate(this.rotation);
	if(this.distance() < this.range / 2) {
		this.s += this.ds;
	} else {
		this.s -= this.ds;
	}
	if(this.s < 1) {
		this.s = 1;
	} else if(this.s > 3) {
		this.s = 3;
	}
	this.sprite.scale(this.s);
}

Grenade.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.x + this.world.level.x, this.y + this.world.level.y);
}


Grenade.prototype.finish = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}