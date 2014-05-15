function extend( cls, obj ){
	for ( var k in cls ){
		obj[k] = cls[k];
	}
}

Class1.prototype.method1 = function() {
	console.log('m');
};

var a = Array;
extend(new Class1(), a)
console.log(a)