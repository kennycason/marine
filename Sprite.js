var Sprites = {

    lib : [],

    put : function(id, sprite) {
        this.lib[id] = sprite
    },
    get : function(id) {
        return this.lib[id];
    }

};


function Sprite(src, fn) {
    this.image = new Image();
    if(fn != null) {
        var that = this;
        this.image.onload = function() {
            fn(that);
        };
    }
    // load image
    this.image.src = src;
    this.rotation = null;
    this.scaling = null;
}

Sprite.prototype.width = function() {
	return this.image.width;
}

Sprite.prototype.height = function() {
	return this.image.height;
}

Sprite.prototype.rotate = function(rotation) {
	this.rotation = rotation;
}

Sprite.prototype.scale = function(scaling) {
	this.scaling = scaling;
}

Sprite.prototype.draw = function(canvas, x, y) {
    var w = this.image.width;
    var h = this.image.height;
    var context = canvas.context;
    // save state
    context.save();
    // set screen position
    context.translate(x, y);
    // set rotation
    if(this.rotation != null) {
    	context.rotate(this.rotation);
	}
    // set scale value
    if(this.scaling != null) {
    	context.scale(this.scaling, this.scaling);
    }
    // draw image to screen drawImage(imageObject, sourceX, sourceY, sourceWidth, sourceHeight,
    // destinationX, destinationY, destinationWidth, destinationHeight)
    context.drawImage(this.image, 0, 0, w, h, -w/2, -h/2, w, h);
    // restore state
    context.restore();
}

function AnimatedSprite(src, width, height, speed, fn) {
    var that = this;
    Sprite.call(this, src, fn);
    this.frameX = 0;
    this.frameY = 0;
    this.frameWidth = width;
    this.frameHeight = height;
    this.speed = speed;
    this.lastAnimated = 0;
    this.cycled = false;
}
AnimatedSprite.prototype = new Sprite();
AnimatedSprite.prototype.constructor = AnimatedSprite;

AnimatedSprite.prototype.draw = function(canvas, x, y) {
    var w = this.image.width;
    var h = this.image.height;
    var context = canvas.context;
    // save state
    context.save();
    // set screen position
    context.translate(x, y);
    // set rotation
    if(this.rotation != null) {
        context.rotate(this.rotation);
    }
    // set scale value
    if(this.scaling != null) {
        context.scale(this.scaling, this.scaling);
    }

    // draw image to screen drawImage(imageObject, sourceX, sourceY, sourceWidth, sourceHeight,
    // destinationX, destinationY, destinationWidth, destinationHeight)
    context.drawImage(this.image,  this.frameX, this.frameY, 
                                   this.frameWidth, this.frameHeight, -this.frameWidth/2, -this.frameHeight/2, 
                                   this.frameWidth, this.frameHeight);

    // restore state
    context.restore();

    // animate
    var time = Clock.time();
    if(time - this.lastAnimated > this.speed) {
        this.lastAnimated = time;
        this.frameX += this.frameWidth;
        if(this.frameX >= w) {
            this.frameX = 0;

            this.frameY += this.frameHeight;
        }
        if(this.frameY >= h) {
            this.frameY = 0;
            this.cycled = true;
        }   
    }
}