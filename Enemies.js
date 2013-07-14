function Enemy(world) {
	Entity.call(this);
	this.world = world;

	this.hp = 1;
	this.hpm = 1;
	this.name = "None";

	this.lastHit = 0;
	this.invincible = false;
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.handle = function() {
	if(this.invincible) {
		var time = Clock.time();
		if(time - this.lastHit > 200) {
			this.invincible = false;
		}
	}
}

Enemy.prototype.hit = function(weapon) {
	if(!this.invincible) {
		this.hp -= weapon.damage;
		this.lastHit = Clock.time();
		this.invincible = true;
	}
}

Enemy.prototype.attack = function() {
	alert('default enemy attack()');
}

Enemy.prototype.draw = function() {
	alert('default enemy draw()');
}

Enemy.prototype.die = function() {
	alert('default enemy die()');
}

Enemy.prototype.dead = function() {
	alert('default enemy dead()');
}

function EnemyJet(world, x, y) {
	Enemy.call(this);

	this.world = world;
	this.name = "Jet";
	var that = this;
	this.jet = new Sprite("img/jet.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.jet.rotate(Math.PI);

	this.scale = 1;
	this.ds = 0.03;
	this.x = x;
	this.y = y;
	this.z = 2;
	this.hp = 5;
	this.hpm = 5;
}


EnemyJet.prototype = new Enemy();
EnemyJet.prototype.constructor = EnemyJet;

EnemyJet.prototype.dead = function() {
	return this.hp <= 0;
}

EnemyJet.prototype.die = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}

EnemyJet.prototype.handle = function() {
	Enemy.prototype.handle.call(this);
	this.y += 30;
	if(this.y > 2480) {
		this.y = -2291;
	}
	this.scale += this.ds;
	if(this.scale > 1.2) {
		this.scale = 1.2;
		this.ds *= -1;
	} else if(this.jet.scale < 1) {
		this.scale = 1;
		this.ds *= -1;
	}
	this.jet.scale(this.jet.scale);
}

EnemyJet.prototype.draw = function(screen) {
	this.jet.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}

function EnemyChopper(world, x, y) {
	Enemy.call(this);
	this.world = world;

	this.name = "Chopper";
	var that = this;
	this.base = new Sprite("img/chopper_base.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.blades = new Sprite("img/chopper_blades.png");
	this.baseTheta = 0;
	this.bladesTheta = 0;
	this.x = x;
	this.y = y;
	this.z = 1;
	this.hp = 3;
	this.hpm = 3;
}

EnemyChopper.prototype = new Enemy();
EnemyChopper.prototype.constructor = EnemyChopper;

EnemyChopper.prototype.handle = function() {
	Enemy.prototype.handle.call(this);

	this.blades.rotate((Math.PI / 180.0) * this.bladesTheta);
	this.bladesTheta -= 30;
	this.base.x = this.x;
	this.base.y = this.y;
	this.pointBaseToPlayer();
}

EnemyChopper.prototype.dead = function() {
	return this.hp <= 0;
}

EnemyChopper.prototype.die = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
}

EnemyChopper.prototype.draw = function(screen) {
	this.base.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
	this.blades.draw(screen, this.world.level.x + this.x + -1, this.world.level.y + this.y );
}

EnemyChopper.prototype.pointBaseToPlayer = function() {
	var px = this.world.player.x;
	var py = this.world.player.y;

	var A = [px - this.x, py - this.y]; // vector pointing to player
	var B = [this.x - this.x, (this.y-1) - this.y]; // X-axis
	this.baseTheta = Vector.theta(A,B);
	if(px < this.x) {
		this.baseTheta *= -1;
	}
	this.base.rotate(this.baseTheta);
}



function EnemySoldier(world, x, y) {
	Enemy.call(this);

	this.world = world;
	this.name = "Soldier";
	var that = this;
	this.sprite = new Sprite("img/marine1.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.standing = this.sprite;
	this.firing = new Sprite("img/marine2.png");
	this.standing.rotate(Math.PI);
	this.firing.rotate(Math.PI);
	this.theta = 0;
	this.scale = 1;
	this.ds = 0.003;
	this.x = x;
	this.y = y;
	this.z = 0;
	this.m = 0;
	this.hp = 1;
	this.hpm = 1;
	this.speed = 1;

	this.shooting = false;
	this.shootTime = 0;
}


EnemySoldier.prototype = new Enemy();
EnemySoldier.prototype.constructor = EnemySoldier;

EnemySoldier.prototype.dead = function() {
	return this.hp <= 0;
}

EnemySoldier.prototype.die = function() {
	this.world.level.env.push(new BloodSplatter(this.world, this.x, this.y));
}

EnemySoldier.prototype.handle = function() {
	Enemy.prototype.handle.call(this);

	// shoot
	if(Dice.roll(100) > 98) {
		this.sprite = this.firing;
		this.shootTime = Clock.time();
		this.shooting = true;

		var bullet = new Bullet(this.world);
		bullet.range = 200;
		bullet.locate(this.x, this.y);
		bullet.orig.x = this.x;
		bullet.orig.y = this.y;

		var v = Vector.unit([this.world.player.x - this.x, this.world.player.y - this.y]);
		bullet.v.x = v[0] * 8;
		bullet.v.y = v[1] * 8;
		this.world.level.ebullets.push(bullet);
	}

	// move
	if(!this.shooting) {
		var v = Vector.unit([this.world.player.x - this.x, this.world.player.y - this.y]);
		this.v.x = v[0] * this.speed;
		this.v.y = v[1] * this.speed;

		var d = Point.distance([this.x, this.y], [this.world.player.x, this.world.player.y]);
		if(d > 50) {
			this.x += this.v.x;
			this.y += this.v.y;
		}
	} else {
		if(Clock.time() - this.shootTime > 1000) {
			this.shooting = false;
			this.sprite = this.standing;
		}
	}
	this.pointBaseToPlayer();
}

EnemySoldier.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}

EnemySoldier.prototype.pointBaseToPlayer = function() {
	var px = this.world.player.x;
	var py = this.world.player.y;

	var A = [px - this.x, py - this.y]; // vector pointing to player
	var B = [this.x - this.x, (this.y-1) - this.y]; // X-axis
	this.theta = Vector.theta(A,B);
	if(px < this.x) {
		this.theta *= -1;
	}
	this.sprite.rotate(this.theta);
}


function EnemyMegaShip(world, x, y) {
	Enemy.call(this);

	this.world = world;
	this.name = "Mega Ship";
	var that = this;
	this.sprite = new Sprite("img/mega_ship.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.sprite.rotate(Math.PI);
	this.theta = 0;
	this.scale = 1;
	this.ds = 0.005;
	this.x = x;
	this.y = y;
	this.hp = 30;
	this.hpm = 30;

	this.shooting = false;
	this.shootTime = 0;
}


EnemyMegaShip.prototype = new Enemy();
EnemyMegaShip.prototype.constructor = EnemyMegaShip;

EnemyMegaShip.prototype.dead = function() {
	return this.hp <= 0;
}

EnemyMegaShip.prototype.die = function() {
	for(var i = 0; i < 500; i++) {
		this.world.level.events.push(new Explosion(this.world, this.x + Dice.roll(500) - 250, this.y + Dice.roll(500) - 250));
	}
}

EnemyMegaShip.prototype.handle = function() {
	Enemy.prototype.handle.call(this);

	this.scale += this.ds;

	if(this.scale < 1) {
		this.scale = 1;
		this.ds *= -1;
	} else if(this.scale > 1.2) {
		this.scale = 1.2;
		this.ds *= -1;
	}
	this.sprite.scale(this.scale);
	// shoot
	var d = Point.distance([this.x, this.y], [this.world.player.x, this.world.player.y]);
	if(d < 400) {
		if(Clock.time() - this.shootTime > 50) {
			this.shootTime = Clock.time();
			var bullet = new Bullet(this.world);
			bullet.range = 900;
			bullet.locate(this.x, this.y);
			bullet.orig.x = this.x;
			bullet.orig.y = this.y;
			var b = Vector.unit([this.world.player.x - this.x, this.world.player.y - this.y]);
			bullet.v.x = b[0] * 20;
			bullet.v.y = b[1] * 20;
			this.world.level.ebullets.push(bullet);

			var bullet2 = new Bullet(this.world);
			bullet2.range = 900;
			bullet2.locate(this.x, this.y);
			bullet2.orig.x = this.x;
			bullet2.orig.y = this.y;
			bullet2.v.x = b[0] * 20 + 4;
			bullet2.v.y = b[1] * 20;
			this.world.level.ebullets.push(bullet2);

			var bullet3 = new Bullet(this.world);
			bullet3.range = 900;
			bullet3.locate(this.x, this.y);
			bullet3.orig.x = this.x;
			bullet3.orig.y = this.y;
			bullet3.v.x = b[0] * 20 - 4;
			bullet3.v.y = b[1] * 20;
			this.world.level.ebullets.push(bullet3);

			var bullet4 = new Bullet(this.world);
			bullet4.range = 900;
			bullet4.locate(this.x, this.y);
			bullet4.orig.x = this.x;
			bullet4.orig.y = this.y;
			bullet4.v.x = b[0] * 20;
			bullet4.v.y = b[1] * 20 + 4;
			this.world.level.ebullets.push(bullet4);

			var bullet5 = new Bullet(this.world);
			bullet5.range = 900;
			bullet5.locate(this.x, this.y);
			bullet5.orig.x = this.x;
			bullet5.orig.y = this.y;
			bullet5.v.x = b[0] * 20;
			bullet5.v.y = b[1] * 20 - 4;
			this.world.level.ebullets.push(bullet5);

			var bullet6 = new Bullet(this.world);
			bullet6.range = 900;
			bullet6.locate(this.x, this.y);
			bullet6.orig.x = this.x;
			bullet6.orig.y = this.y;
			bullet6.v.x = b[0] * 20;
			bullet6.v.y = b[1] * 20 - 10;
			this.world.level.ebullets.push(bullet6);

			var bullet7 = new Bullet(this.world);
			bullet7.range = 900;
			bullet7.locate(this.x, this.y);
			bullet7.orig.x = this.x;
			bullet7.orig.y = this.y;
			bullet7.v.x = b[0] * 20;
			bullet7.v.y = b[1] * 20 + 10;
			this.world.level.ebullets.push(bullet7);

			var bullet8 = new Bullet(this.world);
			bullet8.range = 900;
			bullet8.locate(this.x, this.y);
			bullet8.orig.x = this.x;
			bullet8.orig.y = this.y;
			bullet8.v.x = b[0] * 20;
			bullet8.v.y = b[1] * 20 - 10;
			this.world.level.ebullets.push(bullet8);

			var bullet9 = new Bullet(this.world);
			bullet9.range = 900;
			bullet9.locate(this.x, this.y);
			bullet9.orig.x = this.x;
			bullet9.orig.y = this.y;
			bullet9.v.x = b[0] * 20;
			bullet9.v.y = b[1] * 20 + 10;
			this.world.level.ebullets.push(bullet9);
		}
	}
	this.pointBaseToPlayer();
}

EnemyMegaShip.prototype.draw = function(screen) {
	this.sprite.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
}

EnemyMegaShip.prototype.pointBaseToPlayer = function() {
	var px = this.world.player.x;
	var py = this.world.player.y;

	var A = [px - this.x, py - this.y]; // vector pointing to player
	var B = [this.x - this.x, (this.y-1) - this.y]; // X-axis
	this.theta = Vector.theta(A,B);
	if(px < this.x) {
		this.theta *= -1;
	}
	this.sprite.rotate(this.theta);
}

