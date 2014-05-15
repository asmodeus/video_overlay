var json = {
	util : function () {
		function testClass (arg) {
			this.x = arg;
		};
		testClass.prototype.test = function() {
			console.log('test');
		};
		// this refers to global env
		this.testClass = testClass;
	}()
};

console.log(testClass);
