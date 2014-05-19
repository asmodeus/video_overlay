function WS_DOM_Element () {

}

WS_DOM_Element.prototype.applyCss = function(css) {
	for ( var key in css ) {
		this.style[key] = css[key];
	}
};

