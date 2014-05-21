function extendObj( extension, obj ){
  for ( var key in extension ){
    obj[key] = extension[key];
  }
}

function extendClass( sub, base ) {
  	var origProto = sub.prototype;
	sub.prototype = Object.create(base.prototype);
	for ( var method in origProto ) {
		if ( Object.hasOwnProperty.call(sub.prototype, method) ) {
			throw new Error("Cannot extend: "+sub.toString()+", property is taken");
		} else {
			sub.prototype[method] = origProto[method];
		}
	}
	sub.prototype.constructor = sub;
	Object.defineProperty(sub.prototype, 'constructor', { 
		enumerable: false, 
		value: sub 
	});		
}

function isEmpty (obj){
	if(Object.getOwnPropertyNames(obj).length === 0){
		return true;
	} else 
		return false
}

function Subject () {
	this.observerList = [];
}

Subject.prototype.addObserver = function( observer ) {
	this.observerList.push( observer );
};

Subject.prototype.removeObserver = function( observer ) {
	this.observerList.remove_ws_( observer );
};

Subject.prototype.notify = function( context ) {
	for (var i=0; i < this.observerList.length ; i++){
		this.observerList[i].update( context );
	}	
};

function Observer () {
	this.update = function () {
		// body...
	}
}
