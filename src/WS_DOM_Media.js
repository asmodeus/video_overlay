/**
 * Class for handling html video elements.
 * @param {string} tag 
 * @param {Object.<string, string>} css
 * @param {Object.<string, string>} attribs
 * @param {Object.<string, number>} dimensions 
 * @extends {WS_DOM_Element}
 * @constructor
 */
function WS_DOM_Media ( tag, css, attribs, dimensions ) {
	WS_DOM_Element.call( this, tag, css, attribs, dimensions); /* Super call */
}

/**
 * @param {} Calculate ratio of this video element for resizeing.
 */
WS_DOM_Media.prototype.setRatio = function (  ) {
	var html = this.htmlElement;
	this.ratio = [1, html.videoHeight/html.videoWidth];
};
