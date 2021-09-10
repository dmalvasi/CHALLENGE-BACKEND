'use strict'

var express = require('express');
var api = express.Router();

var AlumnosController = require('../../Controllers/alumnos/alumnos');
var AlumnosValidator = require('../../Controllers/cursos/cursosValidator');

var md_auth = require('../../middlerwares/authenticated');
var api = express.Router();


api.post('/alumno/crear',md_auth.ensureAuth,AlumnosController.createAlumno);
api.get('/alumnos',md_auth.ensureAuth,AlumnosController.getAlumnos);
api.get('/alumno/:alumnoId',md_auth.ensureAuth,AlumnosValidator.validatorId,AlumnosController.getAlumno);
api.delete('/alumno/:alumnoId',md_auth.ensureAuth,AlumnosController.deleteAlumno);


module.exports = api;