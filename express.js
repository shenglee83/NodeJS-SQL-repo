var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var port = 8000;

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',
	extended: true
}));
var path = require('path');
app.use(express.static(__dirname + '/'));


app.get('/test', function(req, res){
	//res.sendFile(path.join(__dirname + '/'));
	res.send('Hello World');
	console.log('from Express');
})

app.listen({port: port, host: '192.168.0.252'}, function(){
	console.log('example app listening to port 8000');
});
