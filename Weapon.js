WeaponTypes = {};
WeaponTypes.bullet 		= 1;
WeaponTypes.grenade 	= 2;
WeaponTypes.missile1 	= 3;
WeaponTypes.missile2 	= 4;
WeaponTypes.laser1		= 5;
WeaponTypes.laser2		= 6;

function Weapon(world) {
	Entity.call(this);
	this.world = world;
	this.orig = {x : 0, y : 0};
	this.range = 0;
	this.damage = 0;
	this.isFinished = false;
}
Weapon.prototype = new Entity();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.distance = function() {
	return Point.distance([this.x, this.y], [this.orig.x, this.orig.y]);
}

Weapon.prototype.draw = function(screen) {
	alert('default weapon draw()');
}

Weapon.prototype.hud = function(screen) {
	alert('default weapon hud()');
}

Weapon.prototype.finished = function() {
	return this.distance() > this.range || this.isFinished;
}

Weapon.prototype.finish = function() {

}

Weapon.prototype.handle = function() {
	this.x += this.v.x;
	this.y += this.v.y;
}


function TankCollide(world) {
	Weapon.call(this, world);
	this.damage = 1;
}
TankCollide.prototype = new Weapon();
TankCollide.prototype.constructor = TankCollide;


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
	this.speed = 8;
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

Grenade.prototype.hud = function(screen) {
	this.sprite.scale(1.2);
	this.sprite.draw(screen, 570, this.sprite.height() / 2 + 5);
	screen.drawText(this.world.player.weapons[this.world.player.currentWeapon].ammo, 590, 23, Palette.BLACK, "normal 20px Comic San");
}

Grenade.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.x + this.world.level.x, this.y + this.world.level.y);
}


Grenade.prototype.finish = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}



function Missile1(world) {
	Weapon.call(this, world);

	var that = this;
	this.sprite = new Sprite("img/missile1.png", function(sprite) {
	that.w = sprite.width();
	that.h = sprite.height();	
	});
	this.range = 400;
	this.damage = 3;
	this.speed = 14;
}
Missile1.prototype = new Weapon();
Missile1.prototype.constructor = Missile1;

Missile1.prototype.handle = function() {
	this.x += this.v.x;
	this.y += this.v.y;

	var A = [0 - this.v.x, 0 - this.v.y];
	var B = [this.v.x - this.v.x, (this.v.y-1) - this.v.y];

	var theta = Vector.theta(A,B);
	if(0 < this.v.x) {
		theta *= -1;
	}
	theta += Math.PI;
	this.sprite.rotate(theta);

	this.sprite.scale(2);
}

Missile1.prototype.hud = function(screen) {
	this.sprite.scale(1.8);
	this.sprite.draw(screen, 570, this.sprite.height() / 2 + 9);
	screen.drawText(this.world.player.weapons[this.world.player.currentWeapon].ammo, 590, 23, Palette.BLACK, "normal 20px Comic San");
}

Missile1.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.x + this.world.level.x, this.y + this.world.level.y);
}

Missile1.prototype.finish = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}



function Missile2(world) {
	Weapon.call(this, world);

	var that = this;
	this.sprite = new Sprite("img/missile2.png", function(sprite) {
	that.w = sprite.width();
	that.h = sprite.height();	
	});
	this.range = 400;
	this.damage = 5;
	this.speed = 17;
}
Missile2.prototype = new Weapon();
Missile2.prototype.constructor = Missile2;

Missile2.prototype.handle = function() {
	this.x += this.v.x;
	this.y += this.v.y;

	var A = [0 - this.v.x, 0 - this.v.y];
	var B = [this.v.x - this.v.x, (this.v.y-1) - this.v.y];

	var theta = Vector.theta(A,B);
	if(0 < this.v.x) {
		theta *= -1;
	}
	theta += Math.PI;
	this.sprite.rotate(theta);

	this.sprite.scale(2);
}

Missile2.prototype.hud = function(screen) {
	this.sprite.scale(1.4);
	this.sprite.draw(screen, 570, this.sprite.height() / 2 + 7);
	screen.drawText(this.world.player.weapons[this.world.player.currentWeapon].ammo, 590, 23, Palette.BLACK, "normal 20px Comic San");
}

Missile2.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.x + this.world.level.x, this.y + this.world.level.y);
}

Missile1.prototype.finish = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}
