
var port = process.argv[2];
var express = require('express');
var app = express();

app.configure(function () {
	app.use(express.static(__dirname + '/static'));
});

app.listen(port);