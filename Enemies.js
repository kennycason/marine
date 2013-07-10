function Enemy(world) {
	Entity.call(this);
	this.world = world;

	this.hp = 1;
	this.hpm = 1;

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
		if(this.collide(weapon)) {
			this.hp -= weapon.damage;
			this.lastHit = Clock.time();
			this.invincible = true;
			return true;
		}
	}
	return false;
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
	this.y += 8;
	if(this.y > 480) {
		this.y = -291;
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
	this.hp = 1;
	this.hpm = 1;

	this.shooting = false;
	this.shootTime = 0;
}


EnemySoldier.prototype = new Enemy();
EnemySoldier.prototype.constructor = EnemySoldier;

EnemySoldier.prototype.dead = function() {
	return this.hp <= 0;
}

EnemySoldier.prototype.die = function() {
	this.world.level.events.push(new Explosion(this.world, this.x, this.y));
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
		var b = Vector.unit([this.world.player.x - this.x, this.world.player.y - this.y]);
		bullet.v.x = b[0] * 8;
		bullet.v.y = b[1] * 8;
		this.world.level.ebullets.push(bullet);
	}
	// move
	if(!this.shooting) {
		this.v.x = 0;
		this.v.y = 0;
		if(this.x < this.world.player.x) {
			this.v.x = 1;
		} else if(this.x > this.world.player.x) {
			this.v.x= -1;
		}
		if(this.y < this.world.player.y) {
			this.v.y = 1;
		} else if(this.y > this.world.player.y) {
			this.v.y= -1;
		}
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