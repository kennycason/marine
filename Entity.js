function Entity() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.m = 1;
	this.w = 0;
	this.h = 0;
	this.a = {x : 0, y : 0, z : 0};
	this.v = {x : 0, y : 0, z : 0};
}

Entity.prototype.locate = function(x, y) {
	this.x = x;
	this.y = y;
}

Entity.prototype.collide = function(e, x, y, debug) {
	if(x == null) {
		x = e.x;
	}
	if(y == null) {
		y = e.y;
	}
	var w = e.w;
	var h = e.h;
	if(debug) {
		$("#data").append("<br/>");
		$("#data").append("in collide(): " + x + " " + y + "    " + w + " " + h + "<br/>");
		$("#data").append("in collide(): " + this.x + " " + this.y + "    " + this.w + " " + this.h + "<br/>");
		$("#data").append((y + h/2 > this.y - this.h/2) + "<br/>");
		$("#data").append((y - h/2 < this.y + this.h/2) + "<br/>");
		$("#data").append((x + w/2 > this.x - this.w/2) + "<br/>");
		$("#data").append((x - w/2 < this.x + this.w/2) + "<br/>");
	}
	if((y + h/2 >= this.y - this.h/2) && (y - h/2 <= this.y + this.h/2)) {
		if((x + w/2 >= this.x - this.w/2) && (x - w/2 <= this.x + this.w/2)) {
			return true;
		}
	}
	return false;
}

function DrawableEntity(sprite) {
	Entity.call(this);
	this.sprite = sprite;
	this.w = this.sprite.width();
	this.h = this.sprite.height();
}
DrawableEntity.prototype = new Entity();
DrawableEntity.prototype.constructor = DrawableEntity;


DrawableEntity.prototype.draw = function(canvas, x, y) {
	this.sprite.draw(canvas, x, y);
}


function Explosion(world, x, y) {
	Entity.call(this);
	this.world = world;
	var that = this;
	this.sprite = new AnimatedSprite("img/explosion.png", 64, 64, 0, function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.x = x;
	this.y = y;
}
Explosion.prototype = new Entity();
Explosion.prototype.constructor = Explosion;

Explosion.prototype.finished = function() {
	return this.sprite.cycled;
}

Explosion.prototype.draw = function(canvas) {
	this.sprite.draw(canvas, this.x + this.world.level.x, this.y + this.world.level.y);
}


function NukeExplosion(world, x, y) {
	Entity.call(this);
	this.world = world;
	var that = this;
	this.sprite = new AnimatedSprite("img/nuke_explosion.png", 57.6, 57.6, 0, function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.x = x;
	this.y = y;
}
NukeExplosion.prototype = new Entity();
NukeExplosion.prototype.constructor = NukeExplosion;

NukeExplosion.prototype.finished = function() {
	return this.sprite.cycled;
}

NukeExplosion.prototype.draw = function(canvas) {
	this.sprite.scale(10);
	this.sprite.draw(canvas, this.x + this.world.level.x - 30, this.y + this.world.level.y - 250);
}


function BloodSplatter(world, x, y) {
	Entity.call(this);
	this.world = world;
	var that = this;
	this.sprite = new AnimatedSprite("img/blood.png", 32, 32, -1, function(sprite) {
		that.w = sprite.width();
		that.h = sprite.height();
	});
	this.sprite.frameX = Dice.roll(3) * 32;
	this.sprite.frameY = Dice.roll(3) * 32;
	this.x = x;
	this.y = y;
}
BloodSplatter.prototype = new Entity();
BloodSplatter.prototype.constructor = BloodSplatter;

BloodSplatter.prototype.finished = function() {
	return this.sprite.cycled;
}

BloodSplatter.prototype.draw = function(canvas) {
	this.sprite.draw(canvas, this.x + this.world.level.x, this.y + this.world.level.y);
}