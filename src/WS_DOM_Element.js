/**
 * @class
 */
function WS_DOM_Element ( tag, css, attribs, name, dimensions ) {
	// Instantiate class variables
	this.htmlElement = document.createElement(tag);
	this.applyCss(css);
	this.applyAttributes(attribs);
	this.nameUnique = name;
	this.dimensions = dimensions;
}


WS_DOM_Element.prototype.setRatio = function(  ) {
	var html = this.htmlElement;
	if ( html instanceof HTMLVideoElement ) {
		this.ratio = [1, html.videoHeight/html.videoWidth];
	} else {
		this.ratio = [1, html.offsetHeight/html.offsetWidth];
	}
};

WS_DOM_Element.prototype.applyCss = function( css ) {
	var html = this.htmlElement;
	for ( var key in css ) {
		html.style[key] = css[key];
	}
};

WS_DOM_Element.prototype.removeCss = function( css ) {
	var html = this.htmlElement;
	for (var key in css) {
		html.style[key] = '';
	}
};

WS_DOM_Element.prototype.applyAttributes = function( attributes ) {
	var html = this.htmlElement;
	for ( var key in attributes ) {
		html.setAttribute(key, attributes[key]);
	}
};
