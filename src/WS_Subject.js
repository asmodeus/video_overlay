/**
 * Class for sending notifications.
 * @constructor
 */
function WS_Subject () {
	this.observers = [];
}

WS_Subject.prototype.addObserver = function( observer ) {
	this.observers.push( observer );
};

WS_Subject.prototype.removeObserver = function( observer ) {
	this.splice(this.indexOf(observer), 1);
};

WS_Subject.prototype.notify = function( context ) {
	for (var i=0; i < this.observers.length ; i++){
		this.observers[i].update( context );
	}	
};