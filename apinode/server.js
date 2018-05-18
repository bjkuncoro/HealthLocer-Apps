var http = require ('http');
var app = require ('./app');
var port = '3001';


var server = http.createServer();

server.listen(port,function(){
	console.log('server berjalan di port '+port);
});
