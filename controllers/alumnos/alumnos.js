'use strict'
/**
 * Clase persistencia Alumnos.
 */
var path = require('path');
var fs = require('fs');
var url = require('url');

/* Importo el modelo de datos*/
var Alumno  = require('../../models/alumnos/alumno');
const { resolve } = require('path');



module.exports = {
	getAlumnos,
	getAlumno,
	createAlumno,
	deleteAlumno,
	getAlumnoById
};


/**
 * Obtiene todos los alumnos
 */
function getAlumnos(req,res){
	const find = Alumno.find();
	find.exec((err,alumnos)=>{
		if(err){
			res.status(500).send({message:'Error Interno obteniendo alumnos'});
		}else{
			if(!alumnos){
				res.status(404).send({message:'Error al obtener los alumnos'});
			}else{
				res.status(200).send(alumnos);
			}
		}
	});
}



/**
 * Obtiene todos los alumnosActivados
 */
function getAlumno(req,res){
	const alumnoId = req.params.alumnoId;
	if(alumnoId){
		const find = Alumno.findOne({'_id':alumnoId},{'nombre':1,'apellido':1,'dni':1});
		find.exec((err,alumno)=>{
			if(err){
				res.status(500).send({message:'Error Interno obteniendo alumno'});
			}else{
				if(!alumno){
					res.status(404).send({message:'Error al obtener el alumno'});
				}else{
					res.status(200).send({alumno});
				}
			}
		});
	}else{
		res.status(404).send({message:'Error al obtener el alumno'});
	}
}



function createAlumno(req,res){
	console.debug('---> CREO NUEVO ALUMNO ---');
	var params = req.body.alumno;//Type: JSON
	if(params){
		var alumnoNuevo = new Alumno();
		alumnoNuevo.nombre = params.nombre;
		alumnoNuevo.apellido = params.apellido;
		alumnoNuevo.dni = params.dni;
		alumnoNuevo.direccion = params.direccion;
		alumnoNuevo.creacionFecha = new Date();
		alumnoNuevo.creacionUsuario = '';
		alumnoNuevo.estado = params.estado ? params.estado : 'borrador';
		alumnoNuevo.save((err,alumnoStore)=>{
			if(err){
			 res.status(500).send({message:'Error guardando alumno'});
		 }else{
			 if(!alumnoStore){
				 res.status(404).send({message:'El alumno no se ha guardado correctamente'});
			 }else{
				 res.status(200).send({alumno:alumnoStore});
			 }
		 }
	 });
 }else{
	 res.status(404).send({error:1001, message:'El alumno enviado no es valido.'});
 }

}


function deleteAlumno(req,res){
	var alumnoId = req.params.alumnoId;
	Alumno.findByIdAndDelete(alumnoId,function(err,data){
    if(err){
				res.status(500).send({message:'Error al eliminar el alumno ' + templateId});
    }else{
			if (!data) {
				res.status(404).send({message:'El usuario no ha sido eliminado'});
			} else {
				res.status(200).send({alumno:data.data});
			}
		}
	});
}

function getAlumnoById(alumnoId){
	if(alumnoId){
		return new Promise((resolve,reject)=>{
			const find = Alumno.findOne({'_id':alumnoId},{'nombre':1,'apellido':1,'dni':1});
			find.exec((err,newAlumno)=>{
				if(err){
					reject(err);
				}else{
					resolve(newAlumno);
				}
			});
		});
	}
	return null;
}
