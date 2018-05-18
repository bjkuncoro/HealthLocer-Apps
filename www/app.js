var Monitor = require('../lib/monitor');
var server = require('http').createServer(handler);
var io = require('socket.io')(server);
var fs = require('fs');
var express = require('express');
var app = express();
var router = express.Router(); 
/* Setting port di 8888 */
server.listen(1011);

// /* Ini adalah fungsi untuk penanganan membaca file html */
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/* Jika socket dalam keadaan terhubung */
io.on('connection', function (socket) {
  /* Kirim data ke client tapi bukan pesan broadcast */
  // socket.emit('data_server', { pesan : 'Halo dari server' });
    var ping2 = new Monitor({website: 'http://127.0.0.1', interval: 0.05});
    ping2.on('up', function (res) {
    console.log(res.website + " is mantap jiwa \n");  
    socket.emit('data_status', { pesan : 1 });
    });
    ping2.on('down', function (res) {
    console.log(res.website + " is Nothing \n");  
    socket.emit('data_status', { pesan : 500 });
    });
    ping2.on('error', function (res) {
    console.log(res.website + " is Ancor lalu \n");  
    socket.emit('data_status', { pesan : 404 });
    });
  /* Terima data dari client */
  socket.on('data_client', function (data) {
      console.log(data.pesan);
  });
  socket.on('disconnect',function(){
    console.log('You SUck!!')
    ping2.stop();
  });
});

app.use('/api',router);
console.log('Magic happens on port 1011' );