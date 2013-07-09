function Keyboard() {

	this.pressed = [256];

	this.keyPressedEvents = [256];

	this.keyReleasedEvents = [256];

	this.init = function() {
		var that = this;
		// bind events
		$(document).keydown(function(event){
	    	that.keyPressed(event.keyCode);
		});

		$(document).keyup(function(event){
	    	that.keyReleased(event.keyCode);
		});
	}

	this.isKeyPressed = function(code) {
		return this.pressed[code];
	}

	this.keyPressed = function(code) {
		this.pressed[code] = true;
		if(this.keyPressedEvents[code] == null) {
			return;
		}
		for(var i = 0; i < this.keyPressedEvents[code].length; i++) {
			this.keyPressedEvents[code][i]();
		}
	}

	this.keyReleased = function(code) {
		this.pressed[code] = false;
		if(this.keyReleasedEvents[code] == null) {
			return;
		}
		for(var i = 0; i < this.keyReleasedEvents[code].length; i++) {
			this.keyReleasedEvents[code][i]();	
		}
	}


	this.onKeyPressed = function(code, fn) {
		if(this.keyPressedEvents[code] == null) {
			this.keyPressedEvents[code] = [];
		}
		this.keyPressedEvents[code].push(fn);
	}

	this.onKeyReleased = function(code, fn) {
		if(this.keyReleasedEvents[code] == null) {
			this.keyReleasedEvents[code] = [];
		}
		this.keyReleasedEvents[code].push(fn);
	}

	this.unbindAll = function () {
		this.events = [];
	}

	this.init();
}


var Keys = {};
Keys.BACKSPACE	= 8;
Keys.TAB		= 9;
Keys.ENTER 		= 13;
Keys.SHIFT		= 16;
Keys.CTRL		= 17;
Keys.ALT		= 18;
Keys.BREAK		= 19;
Keys.CAPS		= 20;
Keys.ESCAPE		= 27;
Keys.PAGE_UP	= 33;
Keys.PAGE_DOWN	= 34;
Keys.END		= 35;
Keys.HOME		= 36;
Keys.LEFT 		= 37;
Keys.UP 		= 38;
Keys.RIGHT 		= 39;
Keys.DOWN 		= 40;
Keys.INSERT		= 45;
Keys.DELETE		= 46;
Keys.NUM_0		= 48;
Keys.NUM_1		= 49;
Keys.NUM_2		= 50;
Keys.NUM_3		= 51;
Keys.NUM_4		= 52;
Keys.NUM_5		= 53;
Keys.NUM_6		= 54;
Keys.NUM_7		= 55;
Keys.NUM_8		= 56;
Keys.NUM_9		= 57;
Keys.A 			= 65;
Keys.B 			= 66;
Keys.C 			= 67;
Keys.D 			= 68;
Keys.E 			= 69;
Keys.F 			= 70;
Keys.G 			= 71;
Keys.H 			= 72;
Keys.I 			= 73;
Keys.J 			= 74;
Keys.K 			= 75;
Keys.L			= 76;
Keys.M 			= 77;
Keys.N 			= 78;
Keys.O 			= 79;
Keys.P			= 80;
Keys.Q 			= 81;
Keys.R 			= 82;
Keys.S 			= 83;
Keys.T 			= 84;
Keys.U 			= 85;
Keys.V 			= 86;
Keys.W 			= 87;
Keys.X 			= 88;
Keys.Y 			= 89;
Keys.Z 			= 90;