const { param,body,validationResult, check } = require('express-validator')

exports.validatorAlumnoId = [
    param('alumnoId').exists().withMessage('id de alumno es obligatorio').bail().not().isEmpty().withMessage('id debe ser un numero alor entero')
]


exports.validatorCrearAlumno = [
  body('alumno.nombre').exists().isEmpty().withMessage('El campo es obligatorio'),
  body('alumno.apellido').exists().withMessage('id debe ser un numero alor entero'),
  body('alumno.dni').exists().isInt({min:2000,max:new Date().getFullYear()}).withMessage('id debe ser un numero alor entero'),
  body('alumno.direccion').exists().isInt({min:1}).withMessage('id debe ser un numero alor entero'),
]