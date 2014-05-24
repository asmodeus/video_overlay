/**
 * Class for handling html elements.
 * @param {string} tag HTML tag.
 * @param {Object.<string, string>} css
 * @param {Object.<string, string>} attribs
 * @param {Object.<string, number>} dimensions 
 * @constructor
 */
function WS_DOM_Element ( tag, css, attribs, dimensions ) {
  /**
   * HTML element.
   * @type {Element}
   * @private
   */
	this.htmlElement = document.createElement(tag);
	this.dimensions = dimensions;
	this.ratio = [];

	this.applyCss(css);
	this.applyAttributes(attribs);
}

/**
 * @param {Object.<string, string>} css Applies css to this elements style property.
 */
WS_DOM_Element.prototype.applyCss = function( css ) {
	var html = this.htmlElement;
	for ( var key in css ) {
		html.style[key] = css[key];
	}
};

/**
 * @param {Object.<string, string>} css Removes css
 */
WS_DOM_Element.prototype.removeCss = function( css ) {
	var html = this.htmlElement;
	for (var key in css) {
		html.style[key] = '';
	}
};

/**
 * @param {Object.<string, string>} attributes Applies css using this html elements setAttribute function
 */
WS_DOM_Element.prototype.applyAttributes = function( attributes ) {
	var html = this.htmlElement;
	for ( var key in attributes ) {
		html.setAttribute(key, attributes[key]);
	}
};

/**
 * @param {} Calculate ratio of this element for resizeing.
 */
WS_DOM_Media.prototype.setRatio = function (  ) {
	var html = this.htmlElement;
	this.ratio = [1, html.videoHeight/html.videoWidth];
};