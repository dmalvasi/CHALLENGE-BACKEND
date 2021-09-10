'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //Fecha de creacion de token y fecha de caducacion
var secret = 'pswdm28admin';

//next para salir del middleware
exports.ensureAuth = function(req,res,next){
	if(!req.headers.authorization){
		return res.status(403).send({message:'La peticion no tiene la cabecera de autentificacion.'});
	}
	var token = req.headers.authorization.replace(/['"]+/g,'');
	try{
		var userValidate = jwt.decode(token,secret);
		if(userValidate.exp <= moment().unix()){
			return req.status(401).send({message:'El token ha expirado.'});
		}
		req.user = userValidate;
		next();

	}catch(ex){
		return res.status(404).send({message:'Token invalido'});
	}

};

exports.validateToken = function(token){
	const userValidate = jwt.decode(token,secret);
	return userValidate;
};