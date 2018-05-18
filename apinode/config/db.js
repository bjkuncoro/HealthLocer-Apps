var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'expo_pendidikan'
});
var app = express();

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});

app.get("/tamu",function(req,res){
connection.query('SELECT * from tamu', function(err, data) {
// connection.end();
  if (!err)
    // console.log('The solution is: ', rows);
    return res.json({status:'200',message:'success',result:data});
  else
    console.log('Error while performing Query.');
  });
});

app.get("/tamu/:id",function(req,res){
connection.query('SELECT * from tamu where id = ?',[req.params.id], function(err, data) {
// connection.end();
  if (!err)
    // console.log('The solution is: ', rows);
    return res.json({status:'200',message:'success',result:data});
  else
    console.log('Error while performing Query.');
  });
});

app.listen(3000);