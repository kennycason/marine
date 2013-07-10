
function PlayerTank(world) {
	Entity.call(this);
	this.world = world;

	this.x = 640/2;
	this.y = 480/2;

	this.invincible = false;
	this.lastHitTime = 0;

	var that = this;
	this.base = new Sprite("img/tank2_base.png", function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.base.x = 640/2;
	this.base.y = 480/2;
	this.gun = new Sprite("img/tank2_gun.png"); 

	this.gunTheta = 0;
	this.initTheta = 0;

	this.hp = 10;
	this.hpm = 10;

	$("#canvas").mousemove(function() {
		that.pointGunToMouse();
	});

	$("#canvas").click(function(e) {
		that.firePrimary();
	});

	$('#canvas').bind("contextmenu", function(e){
	    that.fireSecondary();
	    return false;
	}); 


}

PlayerTank.prototype = new Entity();
PlayerTank.prototype.constructor = PlayerTank;

PlayerTank.prototype.hit = function(damage) {
	if(!this.invincible) {
		this.invincible = true;
		this.lastHitTime = Clock.time();
		this.hp -= damage;
		if(this.hp <= 0) {
			window.location.reload();
		}
	} else {
		if(Clock.time() - this.lastHitTime > 300) {
			this.invincible = false;
		}
	}
}

PlayerTank.prototype.handle = function() {
	if(this.world.level.collideEnemies(this, this.x, this.y)) {
		this.hit(1);
	}

	this.v.x += this.a.x;
	this.v.y += this.a.y;
	
	// limit velocity
	var lsqr = this.v.x*this.v.x + this.v.y*this.v.y;
	var max = 2*2;
	if(lsqr > max*max && lsqr > 0) {
		var ratio = max / Math.sqrt(lsqr);
		this.v.x *= ratio;
		this.v.y *= ratio;
	}
	this.world.level.v.x = this.v.x;
	this.world.level.v.y = this.v.y;
	this.x += this.v.x;
	this.y += this.v.y;

	this.world.level.x += -this.world.level.v.x;
	this.world.level.y += -this.world.level.v.y;
}

PlayerTank.prototype.firePrimary = function() {
	var bullet = new Bullet(this.world);
	bullet.locate(this.x, this.y);
	bullet.orig.x = this.x;
	bullet.orig.y = this.y;
 	//  A · B = |A||B| cos θ
	var b = Vector.unit([this.world.mouse.x - this.base.x, this.world.mouse.y - this.base.y]);
	bullet.v.x = b[0] * 8;
	bullet.v.y = b[1] * 8;
	this.world.level.bullets.push(bullet);
}


PlayerTank.prototype.fireSecondary = function() {
	var grenade = new Grenade(this.world);
	grenade.locate(this.x, this.y);
	grenade.orig.x = this.x;
	grenade.orig.y = this.y;
	var b = Vector.unit([this.world.mouse.x - this.base.x, this.world.mouse.y - this.base.y]);
	grenade.v.x = b[0] * 8;
	grenade.v.y = b[1] * 8;
	this.world.level.bullets.push(grenade);
}

PlayerTank.prototype.draw = function(screen) {
	this.pointBase();
	this.base.draw(screen, this.base.x, this.base.y);
	this.gun.draw(screen, this.base.x, this.base.y);
}

PlayerTank.prototype.pointGunToMouse = function() {
	var mx = this.world.mouse.x;
	var my = this.world.mouse.y;

	var A = [mx - this.base.x, my - this.base.y];
	var B = [this.base.x - this.base.x, (this.base.y-1) - this.base.y];

	this.gunTheta = Vector.theta(A,B);
	if(mx < this.base.x) {
		this.gunTheta *= -1;
	}
	this.gun.rotate(this.gunTheta);
}

PlayerTank.prototype.pointBase = function(e) {
	var A = [0 - this.v.x, 0 - this.v.y];
	var B = [this.v.x - this.v.x, (this.v.y-1) - this.v.y];

	var theta = Vector.theta(A,B);
	if(0 < this.v.x) {
		theta *= -1;
	}
	theta += Math.PI;
	this.base.rotate(theta);
}