const { param,body,validationResult, check } = require('express-validator')

exports.validatorId = [
    param('cursoId').exists().not().isEmpty().withMessage('id debe ser un numero alor entero')
]

exports.validatorCrearCurso = [
  body('curso.tema').exists().not().isEmpty().withMessage('El campo es obligatorio'),
  body('curso.descripcion').exists().withMessage('id debe ser un numero alor entero'),
  body('curso.anioDictado').exists().isInt({min:2000,max:new Date().getFullYear()}).withMessage('id debe ser un numero alor entero'),
  body('curso.duracion').exists().isInt({min:1}).withMessage('id debe ser un numero alor entero'),
]

exports.validatorGetCursoByYearAndDuration =[
  param('year').isInt({min:2000,max:new Date().getFullYear()}).withMessage('El año debe ser numerico y entre 2020 y el año actual'),
  param('duration').optional().bail().isInt({min:1,max:300}).withMessage('La duracion debe ser numerica y entre 1 y 300'),
]


exports.validatorAsociacionAlumnoCurso =[
  param('cursoId').isString().withMessage('El id de curso debe ser string'),
  body('alumnoId').exists().not().isEmpty().withMessage('El id del alumno es requerido').isLength({ min: 24, max:24 }).withMessage('Id alumno Invalido'),
]


  
