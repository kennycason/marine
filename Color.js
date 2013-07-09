function Color(r, g, b) {
	
	this.rgb = {r : 0, g : 0, b : 0};
	
	this.hex = '#000';
	
	this.rgbToHex = function(r, g, b) {
		// determine the hexadecimal equivalents
		var r16 = r.toString(16);
		var g16 = g.toString(16);
		var b16 = b.toString(16);
		// return the CSS RGB colour value
		return '#'
			+ (r16.length == 2 ? r16 : '0' + r16)
			+ (g16.length == 2 ? g16 : '0' + g16)
			+ (b16.length == 2 ? b16 : '0' + b16);
	}
	
	this.setRGB = function(r, g, b) {
		if(r < 0) {
			r = 0;
		}
		if(r > 255) {
			r = 255;
		}
		if(g < 0) {
			g = 0;
		}
		if(g > 255) {
			g = 255;
		}
		if(b < 0) {
			b = 0;
		}
		if(b > 255) {
			b = 255;
		}
		this.rgb = {r : r, g : g, b : b};
		this.hex = this.rgbToHex(r, g, b);
	}
	
	this.getRGB = function() {
		return this.rgb;
	}
	
	this.getHex = function() {
		return this.hex;
	}
	
	if(r != null && g != null && b != null) {
		this.setRGB(r, g, b);
	}
	
}

var Palette = {};
Palette.BLACK = new Color(0,0,0);
Palette.WHITE = new Color(0xff, 0xff, 0xff);
Palette.RED = new Color(0xff, 0, 0);
Palette.GREEN = new Color(0, 0xff, 0);
Palette.BLUE = new Color(0, 0, 0xff);