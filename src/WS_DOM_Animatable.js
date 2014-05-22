/**
 * @class
 */
function WS_DOM_Animatable ( tag, css, attribs, name, dimensions, animation, placement ) {
	WS_DOM_Element.call( this, tag, css, attribs, name, dimensions ); /* Super call */
	// Instantiate class variables
	this.placement = placement;
	this.animType = animation.type; 
	this.animTimer = [animation.appear, animation.disappear]; // in seconds
	this.animClear = Boolean( true );
	this.tempTime = 0;
}

WS_DOM_Animatable.prototype.animate = function() {
	this.transitionReady = false;
	var html = this.htmlElement, aCls = this.animationClass, tCls = this.transitionClass;
	if ( html.className.indexOf(aCls) === -1 ) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Animatable.prototype.setAnimation = function( animationClass, transitionClass ) { 
	this.animationClass = animationClass;
	this.transitionClass = transitionClass;
	var html = this.htmlElement;
	html.className = animationClass+' '+transitionClass;
	this.transitionReady = true;
};

// For custom banner placement, don't draw the banner bigger than the video. If thats the case, cut down the dimensions of the element
WS_DOM_Animatable.prototype.setMaxSpace = function( maxWidth, maxHeight ) {
	var ms = this.getMaxSpace();
	if (ms[0] > maxWidth) {
		var dif = ms[0] - maxWidth;
		this.dimensions.x = this.dimensions.x - dif;
	}
	if (ms[1] > maxHeight) {
		var dif = ms[1] - maxHeight;
		this.dimensions.y = this.dimensions.x - dif;
	}
};

/*
* @return {[]}
*/
// Returns the max width and height of this animatable element, i.e. for width: the placement offset plus the width.
WS_DOM_Animatable.prototype.getMaxSpace = function(  ) {
	return [this.placement.x + this.dimensions.x, this.placement.y + this.dimensions.y];
};

WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round( duration );
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};
