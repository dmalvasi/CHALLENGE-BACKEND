'use strict'

var express = require('express');

var api = express.Router();

var CursosController = require('../../Controllers/cursos/cursos');
var CursoValidator = require('../../Controllers/cursos/cursosValidator');

var md_auth = require('../../middlerwares/authenticated');

var api = express.Router();


//md_auth.ensureAuth,
api.get('/cursos',CursosController.getCursos);
api.get('/curso/:cursoId',md_auth.ensureAuth,CursoValidator.validatorId,CursosController.getCurso);
api.post('/curso/crear',md_auth.ensureAuth,CursoValidator.validatorCrearCurso,CursosController.crearCurso);
api.get('/curso/search/:year/:duration?',md_auth.ensureAuth,CursoValidator.validatorGetCursoByYearAndDuration,CursosController.getCursoByYearAndDuration);

api.post('/curso/addAlumno/:cursoId',md_auth.ensureAuth,CursoValidator.validatorAsociacionAlumnoCurso,CursosController.agregarAlumnoCurso);
api.put('/curso/deleteAlumno/:cursoId',md_auth.ensureAuth,CursoValidator.validatorAsociacionAlumnoCurso,CursosController.eliminarAlumnoCurso);
api.put('/curso/:cursoId',md_auth.ensureAuth,CursosController.editarCurso);
api.put('/curso/notas/:cursoId',md_auth.ensureAuth,CursosController.editarCursoNota);
api.delete('/curso/:id',md_auth.ensureAuth,CursosController.eliminarCurso);


module.exports = api;