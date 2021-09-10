//Controlador User
'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user'); //Importo el modelo
var jwt = require('../services/jwt'); //Importo el modelo



module.exports = {
	saveUser,
	loginUser,
	validateLogin,
}

function loginUser(req,res){
	var params = req.body;
	var userName = params.userName;
	var password = params.password;
	User.findOne({loginId:userName.toLowerCase()},(err,user)=>{
		if(err){
				res.status(500).send({message:'Error en la validacion de usaurio'});
		}else{
			if(!user){
				res.status(404).send({message:'El usuario ' + userName + ' no existe'});
			}else{
				bcrypt.compare(password,user.password,(err,check)=>{
					if(check){
						res.status(200).send({token:jwt.createToken(user),user});
					}else{
						res.status(404).send({message:'La constraseña es incorrecta'});
					}
				});
			}
		}
	});
}

function saveUser(req,res){
	var user = new User();
	var params = req.body;
	user.name = params.name;
	user.surename = params.surename;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';
	if(params.password){
		bcrypt.hash(params.password,null,null,function(err,hash){
			user.password = hash;
			if(user.name != null && user.surename != null && user.email != null){
				user.save((err,userStored)=>{
					if(err){
						res.status(500).send({message:'Error al guardar el usaurio'});
					}else{
						if(!userStored){
							res.status(404).send({message:'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user:userStored});
						}
					}
				});
			}else{
				res.status(200).send({message:'Introduce todos los campos'});
			}
		});
	}else{
		res.status(200).send({message:'Introduce la constraseña'}); //Lo dejamos en 200 porque falta datos // 500 es para error faltalx|
	}
}
/**
 * La idea es que cuando se logue, guarde el token en la base de datos con un timeToLive.
 * Si esta validacion es correcta, entonces devuelve un true.
 * Podria devolver el id de registro tambien asi valida token mas id de registro.
 * Podria poner el id de registro tambien en el token.
 * @param {*} req 
 * @param {*} res 
 */
function validateLogin(req,res){
	const token = req.body.token;
	const isValid = jwt.validateToken(token);
	res.status(200).send({isValid:isValid});
};


