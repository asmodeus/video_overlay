/**
 * Class for animating html elements.
 * @param {string} tag 
 * @param {Object.<string, string>} css
 * @param {Object.<string, string>} attribs
 * @param {Object.<string, number>} dimensions 
 * @param {Object.<string, *>} animation
 * @param {Object.<string, *>} placement
 * @extends {WS_DOM_Element}
 * @constructor
 */
function WS_DOM_Animatable ( tag, css, attribs, dimensions, animation, placement ) {
	WS_DOM_Element.call( this, tag, css, attribs, dimensions ); /* Super call */
	// Instantiate class variables
	this.placement = placement;
	this.animType = animation.type; 
	this.animTimer = [animation.appear, animation.disappear]; // in seconds
	this.animClear = Boolean( true );
	this.tempTime = 0;
}

/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 */
WS_DOM_Animatable.prototype.animate = function() {
	this.transitionReady = false;
	var html = this.htmlElement, aCls = this.animationClass, tCls = this.transitionClass;
	if ( html.className.indexOf(aCls) === -1 ) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

/**
 * Operates on an instance of WS_DOM_Animatable and returns something.
 * @param {string} animationClass Name of animation class
 * @param {string} transitionClass Name of transition class
 */
WS_DOM_Animatable.prototype.setAnimation = function( animationClass, transitionClass ) { 
	this.animationClass = animationClass;
	this.transitionClass = transitionClass;
	var html = this.htmlElement;
	html.className = animationClass+' '+transitionClass;
	this.transitionReady = true;
};

/**
 * Takes the maximum width and height of an element and changes this instances dimensions to match.
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 */
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

/**
 * Operates on an instance of WS_DOM_Animatable and returns something.
 * @return {Array.{number, number}} Maximum space for this element ontop the video.
 */
WS_DOM_Animatable.prototype.getMaxSpace = function(  ) {
	return [this.placement.x + this.dimensions.x, this.placement.y + this.dimensions.y];
};

/**
 * Check the video timer of the WS_DOM_Animatable object
 * @param {number} duration Total duration of video element.
 */
WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round( duration );
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};
