'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CursoSchema = new Schema({
	tema: String,
	anioDictado:Number,
	duracion:Number,
	descripcion: String,
	estado: String,
	alumnos:[{
		alumnoId:{type:Schema.ObjectId, ref:'Alumno'},
		nombre:String,
		nota:Number,
	}],
});

module.exports = mongoose.model('Curso',CursoSchema);