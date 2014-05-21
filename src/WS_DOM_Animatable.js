/* Extends WS_DOM_Element */
/* Extends WS_Observer */
WS_DOM_Animatable.prototype.animate = function() {
	var html = this.htmlElement, aCls = this.animationClass, tCls = this.transitionClass;
	this.transitionend = false;
	if (html.className.indexOf(aCls) === -1) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Animatable.prototype.setAnimation = function( anim_class, transform_class, timer ) { 
	var html = this.htmlElement;
	html.className = anim_class+' '+transform_class;
	html.addEventListener("transitionend", function(){
		this.transitionend = true;
	});
	this.animTimer = timer;
	this.animationClass = anim_class;
	this.transitionClass = transform_class;
};

WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round( duration );
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};