'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = new express();


var user_routes = require('./routes/user');
var alumnos_routes = require('./routes/alumnos/alumnos');
var cursos_routes = require('./routes/cursos/cursos');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configuramos los header http
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
	next();
});


app.use('/api',user_routes); 
app.use('/api',alumnos_routes); 
app.use('/api',cursos_routes); 

module.exports = app;


