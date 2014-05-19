"use strict";

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
