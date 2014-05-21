WS_DOM_Element.prototype.setRatio = function() {
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

// Somewhat modified function, same as from here: http://www.quirksmode.org/js/findpos.html
WS_DOM_Element.prototype.getPosition = function( ) {
	var html = this.htmlElement;
	var curleft = 0, curtop = 0;
	while (html.offsetParent !== null){
		curleft += html.offsetLeft;
		curtop += html.offsetTop;
		html = html.offsetParent;
	}
	return [curleft, curtop];
};