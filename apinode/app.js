var user = require ('./app/routes/user');
var express = require ('express');
var logger = require ('morgan');
var bodyParser = require ('body-parser');


var app = express();
user.configure(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
module.exports = app;
