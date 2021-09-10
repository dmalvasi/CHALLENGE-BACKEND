'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlumnoSchema = new Schema({
	nombre: String,
	apellido: String,
	dni: String,
	direccion: String,
	estado: String,
});

module.exports = mongoose.model('Alumno',AlumnoSchema);