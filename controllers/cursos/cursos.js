'use strict'

const { validationResult } = require('express-validator')
const Curso  = require('../../models/cursos/curso');
const AlumnoService  = require('../../controllers/alumnos/alumnos');

module.exports = {
	getCursos,
	getCurso,
	getCursoByYearAndDuration,
	crearCurso,
	agregarAlumnoCurso,
	eliminarAlumnoCurso,
	eliminarCurso,
	editarCurso,
	editarCursoNota,
};


// ########## FUNCTION INIT  ##########>>
/**
 * Obtiene todos los alumnosActivados
 */
function getCursos(req,res){
	const find = Curso.find();
	find.exec((err,cursos)=>{
		if(err){
			res.status(500).send({message:'Error Interno obteniendo cursos'});
		}else{
			if(!cursos){
				res.status(404).send({message:'Error al obtener los cursos'});
			}else{
				res.status(200).send(cursos);
			}
		}
	});
}


/**
 * Obtiene un curso segun id pasado como parametro
 */
function getCurso(req,res){

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const {cursoId} = req.params;
	const find = Curso.findOne({'_id':cursoId});
	find.exec((err,curso)=>{
		if(err){
			res.status(500).send({message:'Error Interno obteniendo Curso'});
		}else{
			if(!curso){
				res.status(404).send({message:'Error al obtener el Curso'});
			}else{
				res.status(200).send(curso);
			}
		}
	});
}


/**
 * Obtiene todos los cursos por año y dusracion
 */
function getCursoByYearAndDuration(req,res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
		
	const {year,duration} = req.params;
	const find= (duration)? Curso.find({$and:[{"anioDictado":year},{"duracion":duration}]})
												: Curso.find({"anioDictado":year})
	find.exec((err,cursos)=>{
		if(err){
			res.status(500).send({message:'Error Interno obteniendo Cursos'});
		}else{
			if(!cursos){
				res.status(404).send({message:'Error al obtener los Cursos'});
			}else{
				res.status(200).send(cursos);
			}
		}
	});
}


/** Crear un nuevo Curso
  * Se debe validar que no exista, y que los datos esten completos.
 * @param {*} curso Curso a dar de alta
*/
function crearCurso(req,res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	var params = req.body.curso;
	if(params){
		var cursoNuevo = new Curso();
		cursoNuevo.tema = params.tema;
		cursoNuevo.descripcion = params.descripcion;
		cursoNuevo.anioDictado = params.anioDictado;
		cursoNuevo.duracion = params.duracion;
		cursoNuevo.estado = params.estado ? params.estado : 'borrador';
		cursoNuevo.save((err,cursoStore)=>{
			if(err){
				res.status(500).send({message:'Error guardando curso'});
			}else{
				if(!cursoStore){
					res.status(404).send({message:'El curso no se ha guardado correctamente'});
				}else{
					res.status(200).send({curso:cursoStore});
				}
			}
		});
	}else{
		res.status(404).send({error:1001, message:'El alumno enviado no es valido.'});
	}
}



/**
 * Obtiene todos los alumnosActivados
 */
function existAlumnoCurso(cursoId,alumnoId){
	if(cursoId && alumnoId){
		return new Promise((resolve,reject)=>{
			const find = Curso.findOne({'_id':cursoId,'alumnos.alumnoId':alumnoId},{_id:1});
			find.exec((err,cursoAlumno)=>{
				if(err){
					reject(err);
				}else{
					resolve(cursoAlumno);
				}
			});
		});
	}
	return null;
}


/** Crear un nuevo Curso
  * Se debe validar que no exista, y que los datos esten completos.
 * @param {*} curso Curso a dar de alta
 */
function agregarAlumnoCurso(req,res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const cursoId = req.params.cursoId;
	const alumnoId = req.body.alumnoId;
	if(cursoId && alumnoId){
		existAlumnoCurso(cursoId,alumnoId).then(
			resolve =>{
				if(resolve){
					res.status(400).json({errors:['Ya existe Asociacion Alumno-Curso']});
				}else{
					AlumnoService.getAlumnoById(alumnoId).then(
						(alumno)=>{
							if(alumno){
								const newAlumno = {
									'alumnoId': alumno._id,
									'nombre':alumno.nombre + ", " + alumno.apellido,
									'nota':null
								}
								Curso.updateOne({_id:cursoId},{$addToSet :{alumnos:newAlumno}},
									(err,curso)=>{
										if(err){
											res.status(500).send({message:'Error el curso'});
										}else{
											if(!curso){
												res.status(404).send({message:'No se actualizo correctamente el curso'});
											}else{
												res.status(200).send({cursoId,alumno:newAlumno});
											}
										}
									}
								);
							}
						}).catch(
							(err)=>{
								res.status(404).send({message:'El alumno no existe'});
							}
						);
				}
			},
			reject => {
				res.status(404).send({errors:[{message:'El alumno ya se encuentra asociado curso'}]});	
			}
		)
	}else{
		res.status(404).send({errors:[{message:'El alumno enviado no es valido.'}]});
	}
}

/** Crear un nuevo Curso
  * Se debe validar que no exista, y que los datos esten completos.
 * @param {*} curso Curso a dar de alta
 */
function eliminarAlumnoCurso(req,res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const cursoId = req.params.cursoId;
	const alumnoId = req.body.alumnoId;
	if(cursoId && alumnoId){
		Curso.updateOne({"_id":cursoId},{$pull :{"alumnos":{"alumnoId":alumnoId}}},
			(err,curso)=>{
				if(err){
					res.status(500).send({message:'Error eliminar alumno del curso'});
				}else{
					if(!curso || curso.nModified === 0){
						res.status(404).send({message:'No se pudo eliminar el alumno correctamente'});
					}else{
						res.status(200).send({cursoId,alumnoId});
					}
				}
			}
		);
	}else{
		res.status(404).send({error:1001, message:'El alumno enviado no es valido.'});
	}
}


function eliminarCurso(req,res){
	var cursoId = req.params.id;
	Curso.findByIdAndDelete(cursoId,function(err,data){
    if(err){
				res.status(500).send({message:'Error al eliminar el curso ' + cursoId});
    }else{
			if (!data) {
				res.status(404).send({message:'El curso no ha sido eliminado'});
			} else {
				res.status(200).send(data.data);
			}
		}
	});
}

/** Crear un nuevo Curso
  * Se debe validar que no exista, y que los datos esten completos.
 * @param {*} curso Curso a dar de alta
 */
function editarCurso(req,res){
	let cursoId = req.params.cursoId;
	var curso = req.body.curso;//Type: JSON
	if(params){
		var cursoUpdate = new Curso();
		cursoUpdate.tema = params.tema;
		cursoUpdate.descripcion = params.descripcion;
		cursoUpdate.anioDictado = params.anioDictado;
		cursoUpdate.duracion = params.duracion;
		cursoUpdate.alumnos = params.alumnos;
		cursoUpdate.estado = params.estado
		cursoUpdate.findByIdAndUpdate(cursoId,cursoUpdate,(err,cursoStore)=>{
			if(err){
				res.status(500).send({message:'Error actualizar el curso'});
			}else{
				if(!cursoStore){
					res.status(404).send({message:'El curso no se ha actualizado correctamente'});
				}else{
					res.status(200).send(cursoStore);
				}
			}
		});
	}else{
		res.status(404).send({error:1001, message:'El curso que ha enviado a actualizar no es valido.'});
	}
}


/** Crear un nuevo Curso
  * Se debe validar que no exista, y que los datos esten completos.
 * @param {*} curso Curso a dar de alta
 */
function editarCursoNota(req,res){
	const cursoId = req.params.cursoId;
	var alumnos = req.body.alumnos;//Type: JSON
	if(alumnos){
		Curso.findByIdAndUpdate(cursoId,{$set:{alumnos:alumnos}},(err,cursoStore)=>{
			if(err){
				res.status(500).send({message:'Error guardando las notas del curso'});
			}else{
				if(!cursoStore){
					res.status(404).send({message:'Las notas del curso no se han guardado correctamente'});
				}else{
					res.status(200).send(cursoStore);
				}
			}
		});
	}else{
		res.status(404).send({error:1001, message:'El alumno enviado no es valido.'});
	}
}



/**
 * Obtiene todos los alumnosActivados
 */
function getCursoById(cursoId){
	if(cursoId){
		return new Promise((resolver,reject)=>{
			const find = Curso.findOne({'_id':cursoId});
			find.exec((err,curso)=>{
				if(err){
					reject(err);
				}else{
					resolve(curso);
				}
			});
		});
	}
	return null;
}

