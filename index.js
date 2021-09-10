'use strict'

var mongoose = require('mongoose');

var app = require('./app');
var port = 3901 // process.env.PORT || 3977

mongoose.connect('mongodb://localhost:27017/react-challenge',(err,res) =>{
	if(err){
		throw err;
	}else{
		console.log('Se realizo la conexion a la base de datos correctamente....');
		app.listen(port,function(){
			console.log("Servidor del api rest react-challenge escuchando en http://localhost:" + port);
		});
	}

});