'use strict'

var mongoose = require('mongoose');

//Todos los mongoose comienzan con schema. Cada schema mapea con una collecion en la db y debe definir la forma de los datos.
var Schema = mongoose.Schema;


//Creamo la "DTO" donde voy a almacenar los datos.
var UserSchema = new Schema({
	loginId: String,
	name:String,
	surename: String,
	email: String,
	password: String,
	role: String,
	image:String,
});

//Exportamos el modelo de mongus con el DTO
//Pasamos el nombre de la tabla y le digo cual es mi dto.
module.exports = mongoose.model('user',UserSchema);