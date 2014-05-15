document.onreadystatechange = function() {
	if (document.readyState === "complete") {
		var overlay = document.getElementById("overlay");
		var v = document.getElementById("v");
		console.log(overlay);
		v.addEventListener("timeupdate", function() {
			console.log("asd");
		});
	}
};

window.addEventListener("load", function (event) { 
	var overlay = document.getElementById("overlay");
	var v = document.getElementById("v");
	console.log(v.videoWidth);
});

window.onload = function(event){
	var overlay = document.getElementById("overlay");
	var v = document.getElementById("v");
	console.log(v.videoWidth);
};

"use strict";
var util = {	
	// Self executing JSON clutters the global object
	init : function () {
		function testClass (arg) {
			this.x = arg;
		};
		testClass.prototype.test = function() {
			console.log('test');
		};
		return {testClass : testClass};
	}(),
};

console.log(util.init);