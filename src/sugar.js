"use strict";

// Really weird behavior, all arrays are added with 
// these prototypes when created they cannot be removed popped.
Array.prototype.contains_ws_ = function() {
	var ret = false, args = arguments;
	for (var k in args) {
		this.forEach(function(val){
			if ( this.indexOf(args[k]) >= 0 ) {
				ret = true;
			}
		}, this);
	}
	return ret;
};


Array.prototype.remove_ws_ = function (elem) {
	this.splice(this.indexOf(elem), 1);
};
