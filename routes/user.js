'use strict'



var express = require('express');

var UserController = require('../controllers/user');

var md_auth = require('../middlerwares/authenticated');
var api = express.Router();

var multipart = require('connect-multiparty'); //Lo utilizo para cargar los archivos.
var md_upload = multipart({uploadDir:'./uploads/users'});

api.post('/user/register',UserController.saveUser);
api.post('/user/authenticate',UserController.loginUser);
api.post('/user/login',UserController.loginUser);
api.put('/user/sessionValid',UserController.validateLogin);


module.exports = api;