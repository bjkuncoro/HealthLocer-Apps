
var Monitor = require('../lib/monitor');
var http = require ('http');
var fs = require('fs');
var express = require('express');
var app        =  express();
var server = require('http').Server(express);                 // define our app using express
var bodyParser = require('body-parser');
var io = require ('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 1011;
var router = express.Router(); 

// website has a redirect, should emit down and show status message
var ping = new Monitor({website: 'http://127.0.0.1', interval: 0.05});

ping.on('up', function (res) {
    console.log(res.website + " is Mantap Jiwa \n");
    router.get('/', function(req, res) {
    res.json({ status: 01 });   
    });
    // ping.stop();
});

ping.on('down', function (res) {
    console.log(res.statusMessage + 'AncorBoy ' + res.website + "!\n");
    router.get('/', function(req, res) {
    res.json({ status: 0 });   
    });
    // ping.stop();
});

ping.on('error', function (res) {
    console.log(res.website + " is Ancor Lalu! \n");
    router.get('/', function(req, res) {
    res.json({ status: 404 });   
    });
    // ping2.stop();
});

// ping.on('stop', function (website) {
//     console.log(website + " monitor has stopped. \n");
// });





// website does now exist, monitor should emit down
var ping2 = new Monitor({website: 'http://203.24.50.67', interval: 0.05});

ping2.on('up', function (res) {
    console.log(res.website + " is mantap jiwa \n");
    // ping2.stop();
});

ping2.on('down', function (res) {
    console.log(res.statusMessage + ' AncorBoy ' + res.website + "!\n");
    // ping2.stop();
});

ping2.on('error', function (res) {
    console.log('Error Boy ' + res.website + "! \n");
    // ping2.stop();
});

// ping2.on('stop', function (website) {
//     console.log(website + " monitor has stopped. \n");
// });





// monitor should emit up
var ping3 = new Monitor({website: 'http://www.google.co.id', interval: 0.2});

ping3.on('up', function (res) {
    console.log(res.website + " is mantap jiwa \n");
    // ping3.stop();
});

ping3.on('down', function (res) {
    console.log(res.statusMessage + 'AncorBoy ' + res.website + "!\n");
    // ping3.stop();
});

ping3.on('error', function (res) {
    console.log('errorBoy' + res.website + "! \n");
    // ping3.stop();
});

// ping3.on('stop', function (website) {
//     console.log(website + " monitor has stopped. \n");
// });

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);