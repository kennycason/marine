function Mouse() {

	this.x = -1;
	this.y = -1;

	var that = this;
	$("#canvas").mousemove(function(e) {
		var offset = $("#canvas").offset();
		that.x = e.clientX - offset.left + $(window).scrollLeft();
		that.y = e.clientY - offset.top + $(window).scrollTop();
	});
	
}

