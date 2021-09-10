'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //Fecha de creacion de token y fecha de caducacion
var secret = 'pswdm28admin';

exports.createToken = function(user){
	//datos a codificar
	var userValue = {
		sub: user._id,
		name: user.name,
		loginId: user.loginId,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(), //Fecha de creacion token, en formato unix
		exp: moment().add(30,'days').unix() //fecha de expiracion, son 30 dias. En formato unix
	};
	return jwt.encode(userValue,secret); 
};