function WS_DOMElement () {

}

WS_DOMElement.prototype.applyCss = function(css) {
	for ( var key in css ) {
		this.style[key] = css[key];
	}
};

