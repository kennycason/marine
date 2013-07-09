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
		var time = new Date().getTime();
		if(time - this.lastHit > 2000) {
			this.invincible = false;
		}
	}
}

Enemy.prototype.hit = function(weapon) {
	if(!this.invincible) {
		if(this.collide(weapon)) {
			this.hp -= weapon.damage;
			this.lastHit = new Date().getTime();
			this.invincible = true;
		}
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
	this.ds = 0.003;
	this.x = x;
	this.y = y;
	this.hp = 3;
	this.hpm = 3;
}

EnemyJet.prototype = new Enemy();
EnemyJet.prototype.constructor = EnemyJet;

EnemyJet.prototype.dead = function() {
	return this.hp <= 0;
}

EnemyJet.prototype.die = function() {
	this.world.explosions.push(new Explosion(this.world, this.x, this.y));
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
	this.hp = 1;
	this.hpm = 1;
}

EnemyChopper.prototype = new Enemy();
EnemyChopper.prototype.constructor = EnemyChopper;

EnemyChopper.prototype.handle = function() {
	Enemy.prototype.handle.call(this);

	this.blades.rotate((Math.PI / 180.0) * this.bladesTheta);
	this.bladesTheta -= 30;
	this.base.x = this.x;
	this.base.y = this.y;
	this.pointBaseToMouse();
}

EnemyChopper.prototype.dead = function() {
	return this.hp <= 0;
}

EnemyChopper.prototype.die = function() {
	this.world.explosions.push(new Explosion(this.world, this.x, this.y));
}

EnemyChopper.prototype.draw = function(screen) {
	this.base.draw(screen, this.world.level.x + this.x, this.world.level.y + this.y);
	this.blades.draw(screen, this.world.level.x + this.x + -1, this.world.level.y + this.y );
}

EnemyChopper.prototype.pointBaseToMouse = function() {
	var mx = this.world.player.x;
	var my = this.world.player.y;

	var A = [mx - this.x, my - this.y];
	var B = [this.x - this.x, (this.y-1) - this.y];
	this.baseTheta = vectorTheta(A,B);
	if(mx < this.x) {
		this.baseTheta *= -1;
	}
	this.base.rotate(this.baseTheta);
}

