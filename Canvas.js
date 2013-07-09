// static objects
function Canvas() {

	this.canvas = $("#canvas").get(0);
	$("#canvas").show();
	this.width = $("#canvas").width();
	this.height = $("#canvas").height();
	this.context = this.canvas.getContext('2d');

	this.drawText = function(text, x, y, color, font) {
		if(color == null) {
			color = Palette.BLACK;
		}
		if(font != null) {
			font = "normal 24px Comic San";
		}
		this.context.font = font;
		this.context.fillStyle = color.getHex();
		this.context.fillText(text, x, y);
	}

	this.drawSquare = function(x, y, dim, color) {
		this.drawRect(x, y, dim, dim, color);
	}

	this.drawRect = function(x, y, w, h, color) {
		if(color == null) {
			color = Palette.BLACK;
		}
		this.context.fillStyle = color.getHex();
		this.context.fillRect(x, y, w, h);
	}

	this.drawPixel = function(x, y, r, g, b, a) {
		var index = (x + y * this.width) * 4;
		var data = this.context.getImageData(0, 0, this.width, this.height);
		data.data[index + 0] = r;
		data.data[index + 1] = g;
		data.data[index + 2] = b;
		data.data[index + 3] = a;
	}
	
	this.drawCircle = function(x, y, r, color) {
		this.drawEmptyCircle(x, y, r, color);
		this.context.fillStyle = color.getHex();
		this.context.fill();
	}

	this.drawSprite = function(sprite, x, y) {
		sprite.draw(this.context, x, y);
	}

	this.drawEmptyCircle = function(x, y, r, color, lineWidth) {
		if(lineWidth == null) {
			lineWidth = 5;
		}
		this.context.beginPath();
		this.context.arc(x, y, r, 0, 2 * Math.PI, false);
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = color.getHex();
		this.context.stroke();
	}

	this.updateCanvas = function() {
		this.context.putImageData(this.offscreenCanvasData, 0, 0);
	}

	this.clear = function(color) {
		if(color == null) {
			color = Palette.BLACK;
		}
		this.drawRect(0, 0, this.width, this.height, color);
	}
	
}