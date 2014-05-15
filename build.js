var express = require('express');
var app = express();

app.use(express.static(__dirname));
console.log(__dirname);
	
app.get('/', function(req, res){
	res.sendfile("build/index.html");
});

module.exports = app;
