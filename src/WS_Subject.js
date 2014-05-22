/**
 * @class
 */
function WS_Subject () {
	this.observerList = [];
}

WS_Subject.prototype.addObserver = function( observer ) {
	this.observerList.push( observer );
};

WS_Subject.prototype.removeObserver = function( observer ) {
	this.observerList.remove_ws_( observer );
};

WS_Subject.prototype.notify = function( context ) {
	for (var i=0; i < this.observerList.length ; i++){
		this.observerList[i].update( context );
	}	
};